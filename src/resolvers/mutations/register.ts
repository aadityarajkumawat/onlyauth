import { ResolverContext } from '../../typings';
import { RegisterInput, UserResponse } from '../resolvertypes';

export async function register(
    _: any,
    args: RegisterInput,
    { request, prisma }: ResolverContext
): Promise<UserResponse> {
    try {
        const user = await prisma.user.create({ data: { ...args } });
        if (!user) return { error: 'Error while registering', user: null };
        request.session.userId = user.id;
        return { error: null, user };
    } catch (error) {
        console.log(error.message);
        if (error.message.includes('username')) {
            return { error: 'This username is already taken', user: null };
        }
        return { error: error.message, user: null };
    }
}
