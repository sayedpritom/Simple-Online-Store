import React, { Component } from 'react';
import './ProductDescription.css';
import withRouter from '../../../Components/HOC/withRouter';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import UserContext from '../../../Context/UserContext';



function createMarkup(description) {
    return { __html: `${description}` };
}


class ProductDescription extends Component {

    static contextType = UserContext;

    constructor(props) {
        super(props)
        this.state = {
            product: {},
            price: {},
            preview: "",
            color: "",
            otherAttributes: {}
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
                product(id: ${JSON.stringify(this.props.params.id)}) {
                  id
                  brand
                  name
                  prices {
                    currency {
                      label
                      symbol
                    }
                    amount
                  }
                  inStock
                  gallery
                  description
                  category
                  attributes {
                    id
                    name
                    type
                    items {
                      displayValue
                      value
                      id
                    }
                  }
                }
              }
              `,
            })
            .then((result) => {

                const price = result.data.product.prices?.find(price => price.currency.label === this.context.currency)

                // set the product details, price according to current currency & main preview image
                this.setState({
                    product: result.data.product,
                    preview: result.data.product.gallery[0],
                    price: {
                        label: price.currency.label,
                        symbol: price.currency.symbol,
                        amount: price.amount
                    }

                })

                // find out & set the color & other attributes
                const color = result.data.product.attributes.find(attribute => attribute.name === "Color")
                const otherAttributes = result.data.product.attributes.find(attribute => attribute.name !== "Color")



                color && this.setState({ color: color.items[0].value })

                otherAttributes && this.setState({
                    otherAttributes: {
                        name: otherAttributes.name,
                        value: otherAttributes.items[0].value
                    }
                })
            });
    }

    componentDidMount() {
        this.loadData()
    }
    componentDidUpdate() {
        // Only rerender if the currency is updated
        const oldCurrency = this.state.price.label;
        const newCurrency = this.context.currency;

        if (oldCurrency !== newCurrency) {
            this.loadData()
        }
    }

    render() {
        const { id, brand, name, prices, gallery, inStock, description, category, attributes, } = this.state.product;

        // Get the attributes 
        const colorAttribute = attributes?.find(attribute => attribute.name === "Color");
        const otherAttributes = attributes?.find(attribute => attribute.name !== "Color");

        const changePreview = image => {
            this.setState({ preview: image })
        }

        const pickColor = (attribute) => {
            this.setState({ color: attribute })
        }

        const pickOtherAttributes = (name, attribute) => {
            this.setState({
                otherAttributes: {
                    name: name,
                    value: attribute
                }
            })
        }

        const addToCart = id => {
            const color = this.state.color;
            const quantity = 1;
            const totalPrice = 0;
            const otherAttributes = this.state.otherAttributes;

            const currentCartContext = this.context.cart;
            const index = currentCartContext.length + 1;

            // removing the index by taking other properties(delete item.index removed index from context somehow)
            const itemsMatchedById = currentCartContext.map(item => {
                if (item.id === id) {
                    return { id: item.id, color: item.color, quantity, totalPrice, otherAttributes: item.otherAttributes }
                }
            });

            const numberOfMatchesByAttributes = itemsMatchedById.map(item => JSON.stringify(item) === JSON.stringify({ id, color, quantity, totalPrice, otherAttributes }));

            const isFound = numberOfMatchesByAttributes.find(item => item === true) ? "found" : "notFound"

            if (isFound === "notFound") {
                // this.context.setCart([{ id, color, quantity, totalPrice, otherAttributes, index }, ...this.context.cart])
            }
            this.context.setCart({ id, color, quantity, totalPrice, otherAttributes, index })
        }

        return (
            <div className='product-description'>
                <div className='product-thumbnails'>
                    {
                        gallery?.map(image => <button key={image} onClick={() => changePreview(image)}> <img src={image} alt="" /></button>)
                    }
                </div>
                <div className='product-main-image'>
                    <img src={this.state.preview} alt="" />
                </div>
                <div className='product-info'>
                    <h2 className='product-brand'>{brand}</h2>
                    <h2 className='product-name'>{name}</h2>
                    {/* Check for totalExisting attribute that is not about color if there is totalExisting then show it in it's style */}
                    {otherAttributes &&
                        <div>
                            <p className='others'>{otherAttributes.name}</p>
                            <div className='other-attributes'>
                                {otherAttributes.items.map(item => <button key={item.value} onClick={() => pickOtherAttributes(otherAttributes.name, item.value)} className={`${this.state.otherAttributes.value === item.value && 'selected-other-attributes'}`}>{item.value}</button>)}
                            </div>
                        </div>
                    }
                    {/* Check if the color attribute exists, if so then show in the colors style*/}
                    {colorAttribute &&
                        <div>
                            <p className='color'>{colorAttribute.name}:</p>
                            <div className='color-attributes'>
                                {colorAttribute.items.map(item => <button className={`${item.value === this.state.color && 'selected-color-attribute'}`} key={item.value} style={{ backgroundColor: `${item.value}` }} onClick={() => pickColor(item.value)}></button>)}
                            </div>
                        </div>
                    }
                    <div className="product-price">
                        <p className='price'>Price:</p>
                        <p className='amount'>{this.state.price.symbol}{this.state.price.amount}</p>
                    </div>
                    <button onClick={() => addToCart(id)} className="add-to-cart-btn">Add To Cart</button>
                    <div className='product-description-text' dangerouslySetInnerHTML={createMarkup(description)}></div>
                </div>
            </div>
        );
    }
}

export default withRouter(ProductDescription);