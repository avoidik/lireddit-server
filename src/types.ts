import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { Request, Response } from 'express';
import { Session } from 'express-session';

declare module 'express-session' {
    export interface Session {
        userId: number;
    }
}

export interface MyContext {
    em: EntityManager<IDatabaseDriver<Connection>>;
    req: Request & { session: Session }; // req: Request & {session: {userId?: number}}
    res: Response;
}
