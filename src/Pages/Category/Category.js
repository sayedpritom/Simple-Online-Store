import React, { Component } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import './Category.css';
import Card from './Card/Card';
import UserContext from '../../Context/UserContext';


class Category extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props)
    this.state = {
      products: []
    }
  }

  loadData() {
    const client = new ApolloClient({
      uri: 'http://localhost:4000/',
      cache: new InMemoryCache(),
    });

    client
      .query({
        query: gql`
        {
          category(input: {title: ${JSON.stringify(this.context.category)}}) {
            name
            products {
            id
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
      .then((result) => {

        const newData = result.data.category?.products.length
        const oldData = this.state.products?.length

        if (newData !== oldData) {
          this.setState({ products: result.data.category.products })
        }
      });
  }

  componentDidMount() {
    this.loadData()
  }

  componentDidUpdate() {
    this.loadData()
  }

  render() {

    return (
      <div>
        <h1 className='category-name'>{this.context.category}</h1>

        <div className='products'>
          {this.state.products.map(product => {
            return <Card product={product} key={product.id} />
          })}
        </div>

      </div>
    );
  }
}

// Category.contextType = AuthContext;

export default Category;