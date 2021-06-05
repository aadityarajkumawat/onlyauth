import { ResolverContext } from '../../typings';
import { LoginInput, UserResponse } from '../resolvertypes';

export async function login(
    _: any,
    args: LoginInput,
    { request, prisma }: ResolverContext
): Promise<UserResponse> {
    try {
        const user = await prisma.user.findFirst({ where: { ...args } });
        if (!user) return { error: 'User does not exist', user: null };
        request.session.userId = user.id;
        return { error: null, user };
    } catch (error) {
        console.log(error.message);
        return { error: error.message, user: null };
    }
}
