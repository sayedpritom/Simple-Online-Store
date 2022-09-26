import { useQuery, gql } from '@apollo/client';
import {GET_GEN_3} from './gql/Query'

const useMyQuery = () => {
    const { loading, error, data } = useQuery(GET_GEN_3);
    return { loading, error, data }
}

export default useMyQuery;
