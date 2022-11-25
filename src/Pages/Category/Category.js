import React, { Component } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import './Category.css';
import Card from './Card/Card';
import UserContext from '../../Context/UserContext';
import withRouter from '../../Components/HOC/withRouter';


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

    const { currency, symbol, category, cart, miniCart, setCurrency, setCategory, setMiniCart } = this.context;

    client
      .query({
        query: gql`
        {
          category(input: {title: ${JSON.stringify(this.props.params.category)}}) {
            name
            products {
            id
            name
            brand
            inStock
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
        setCategory(this.props.params.category)

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
        <h1 className='category-name'>{this.context.category?.charAt(0).toUpperCase() + this.context.category?.slice(1)}</h1>
        <div className='products'>
          {this.state.products.map(product => {
            return <Card product={product} key={product.id} />
          })}
        </div>
      </div>
    );
  }
}

export default withRouter(Category);