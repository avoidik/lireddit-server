import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
//import { Post } from "./entities/Post";

import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from "./types";

const main = async () => {
    const orm = await MikroORM.init(mikroConfig);
    const migrator = orm.getMigrator();
    const migrations = await migrator.getPendingMigrations();
    if (migrations && migrations.length > 0) {
        await migrator.up();
    };

    const app = express();

    const redisStore = connectRedis(session)
    const redisClient = redis.createClient({ url: 'redis://default:password@192.168.150.101:6379' })

    app.use(
      session({
        name: 'cookie-id',
        store: new redisStore({ client: redisClient, disableTouch: true }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            sameSite: 'lax',
            secure: __prod__
        },
        secret: '7j72NXnYJM9YF9eToFCc3A4JoUsx3ot2Fw5NqwXXEWLvn9zq3yfTYfuXUyTnkjuj',
        resave: false,
        saveUninitialized: false
      })
    )

    const apolloServer = new ApolloServer({
        introspection: true,
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({ req, res }): MyContext => ({ em: orm.em.fork(), req, res }),
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground({settings: {'request.credentials': 'include'}}),
        ],
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log('the server is listening on localhost:4000');
    });

    //const post = orm.em.create(Post, {title: 'my first post'});
    //await orm.em.persistAndFlush(post);

    //const post = await orm.em.find(Post, {});
    //console.log(post);

    //await orm.close();
};

main().catch((err) => {
    console.error(err);
});
