import 'dotenv-safe/config';
import { GraphQLServer } from 'graphql-yoga';
import path from 'path';
import { sessionMiddleware } from './middlewares/session';
import { ResolversI } from './resolvers';
import Resolvers from './resolvers';
import { PrismaClient } from '@prisma/client';
import { contextBuilder } from './helpers/contextBuilder';

async function main() {
    const typeDefs = path.join(__dirname, 'graphql/typeDefs.graphql');
    const resolvers: ResolversI = Resolvers;

    const server = new GraphQLServer({
        typeDefs,
        resolvers: resolvers as any,
        context: (options) =>
            contextBuilder.build(options, { prisma: new PrismaClient() }),
    });

    server.express.use(sessionMiddleware(process.env.COOKIE_SECRET));

    server.start(
        { cors: { origin: '*' }, port: parseInt(process.env.PORT) },
        (options) => {
            console.log(options);
            console.log(`Server running at port ${options.port}`);
        }
    );
}

main().catch((e) => console.log(e.message));
