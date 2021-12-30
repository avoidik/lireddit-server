import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { __prod__ } from "./constants";
import { Options } from "@mikro-orm/core";
import path from "path";

const config: Options = {
    migrations: {
        path: path.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post, User],
    //dbName: 'database',
    //user: 'admin',
    //password: 'password',
    //host: '192.168.150.101',
    //port: 5432,
    clientUrl: 'postgres://admin:password@192.168.150.101:5432/database',
    type: 'postgresql',
    debug: !__prod__,
};

export default config;
