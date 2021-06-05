import { me } from './me';

export default { me };

export interface Queries {
    me: typeof me;
}
