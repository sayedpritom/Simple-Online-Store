import React, { Component } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import './Category.css';
import Card from './Card/Card';
import UserContext from '../../Context/UserContext';
import withRouter from '../../Components/HOC/withRouter';
import LoadingForCategory from '../../Components/LoadingForCategory/LoadingForCategory';


class Category extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props)
    this.state = {
      products: [],
      category: "all",
      currency: "$",
      loading: false
    }
  }

  loadData() {
    this.state.loading === false && this.setState({loading: true})
    const client = new ApolloClient({
      uri: 'https://e-commerce-2.onrender.com/',
      cache: new InMemoryCache(),
    });

    const { setCategory } = this.context;

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
        this.setState({ products: result.data.category.products, currency: this.context.symbol, category: this.context.category, loading: false })
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
    if (this.state.loading) {
      return <LoadingForCategory/>
    }
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