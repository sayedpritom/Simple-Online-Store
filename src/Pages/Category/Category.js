import React, { Component } from 'react';
import Header from '../../Components/Header/Header';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import './Category.css';
import Card from './Card/Card';


class Category extends Component {

    constructor(props) {
        super(props)
        this.state = {
            products: []
        }
    }

    componentDidMount() {
        const client = new ApolloClient({
            uri: 'http://localhost:4000/',
            cache: new InMemoryCache(),
          });
          
          client
            .query({
              query: gql`
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
              `,
            })
            .then((result) => this.setState({products: result.data.categories[0].products}));
    }

    render() {
        console.log(this.state.products)
        // console.log(this.state.products.array.forEach(element => {
        //     console.log("object");
        // }))

        return (
            <div className='products'>
                {this.state.products.map(product => {
                    return <Card product={product} />
                })}
                

            </div>
        );
    }
}

export default Category;