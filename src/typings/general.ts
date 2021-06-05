import { Prisma, PrismaClient } from '@prisma/client';

export type PrismaContext = PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>;

export type ResolverContext = {
    request: Express.Request & { session: { userId: number } };
    response: Express.Response;
    prisma: PrismaContext;
};

export type ContextParams = {
    prisma: PrismaContext;
};
