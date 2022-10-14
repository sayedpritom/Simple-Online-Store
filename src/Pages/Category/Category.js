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
      products: [],
      category: "all",
      currency: "$"
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
            attributes {
              name
              items {
                value
              } 
            }
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

        this.setState({ products: result.data.category.products, currency: this.context.symbol, category: this.context.category })

        // On currency change this data will be reloaded again. To prevent loop from componentDidUpdate, current & previous data is checked. If they are not the same then it means the currency is changed in context & new data is loaded. Only if new data is loaded then it is saved to the state. 
        const newData = result.data.category?.products.length
        const oldData = this.state.products?.length

        // if (newData !== oldData) {
        //   this.setState({ products: result.data.category.products })
        // }

      });
  }

  componentDidMount() {
    this.loadData()
  }

  componentDidUpdate() {

    // only update if the currency or category has been changed
    const oldCurrency = this.state.currency
    const newCurrency = this.context.symbol

    const oldCategory = this.state.category
    const newCategory = this.context.category

    if (oldCurrency !== newCurrency || oldCategory !== newCategory) this.loadData()

  }

  render() {
    return (
      <div>
        <h1 className='category-name'>{this.context.category.charAt(0).toUpperCase() + this.context.category.slice(1)}</h1>
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