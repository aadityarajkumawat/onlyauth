import Mutation, { Mutations } from './mutations';
import Query, { Queries } from './queries';

export interface ResolversI {
    Query: Queries;
    Mutation: Mutations;
}

export default { Query, Mutation };
