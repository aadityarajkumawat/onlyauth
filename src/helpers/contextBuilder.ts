import { ContextParameters } from 'graphql-yoga/dist/types';
import { ContextParams } from '../typings';

export const contextBuilder = {
    build(
        defaultParams: Pick<ContextParameters, 'request' | 'response'>,
        params: ContextParams
    ) {
        return { ...defaultParams, ...params };
    },
};
