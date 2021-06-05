import { login } from './login';
import { register } from './register';

export default { login, register };

export interface Mutations {
    login: typeof login;
    register: typeof register;
}
