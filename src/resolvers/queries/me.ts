import { ResolverContext } from 'src/typings';
import { UserResponse } from '../resolvertypes';

export async function me(
    _: any,
    __: any,
    { prisma, request }: ResolverContext
): Promise<UserResponse> {
    // console.log({ prisma, request });
    // return { error: 'ee', user: { id: 1, name: 'aditya', username: 'aditya' } };
    if (!request.session.userId) {
        return { error: 'User not authenticated', user: null };
    }
    try {
        const user = await prisma.user.findFirst({
            where: { id: request.session.userId },
        });
        return { error: null, user };
    } catch (error) {
        console.log(error.message);
        return { error: error.message, user: null };
    }
}
