import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/posts";
import { Post } from "./entities/Post";
// import { Post } from "./entities/Post";

const main = async () => {
    const orm = await MikroORM.init(mikroConfig);
    const migrator = orm.getMigrator();
    const migrations = await migrator.getPendingMigrations();
    if (migrations && migrations.length > 0) {
        await migrator.up();
    };

    const app = express();

    const apolloServer = new ApolloServer({
        introspection: true,
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false
        }),
        context: () => ({ em: orm.em.fork() }),
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground({settings: {'request.credentials': 'include'}}),
        ],
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    app.listen(4000, '0.0.0.0', () => {
        console.log('the server is listening on localhost:4000');
    });

    const post = await orm.em.find(Post, {});
    console.log(post);

    await orm.close();
};

main().catch((err) => {
    console.error(err);
});
