import { gql } from "@apollo/client";

export const GET_GEN_3 = gql`
{
    categories {
      name
      products {
        name
        gallery
        prices {
          currency {
            label
          } 
          amount
        }
      }
    }
  }
`;