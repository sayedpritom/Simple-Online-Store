import React, { Component } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import UserContext from '../../Context/UserContext';
import './CartItem.css'


class CartItem extends Component {
    static contextType = UserContext;


    constructor(props) {
        super(props)
        this.state = {
            product: {},
            price: {},
            preview: 0,
            color: "",
            otherAttributes: {},
            quantity: 0,
            currency: "",
            initial: true,
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
                product(id: "${this.props?.item.id}") {
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

        // Only reload if the currency is updated
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


        const next = preview => {
            preview < gallery.length - 1 && this.setState({ preview: preview + 1 })

        }
        const previous = preview => {
            preview > 0 && this.setState({ preview: preview - 1 })
        }


        // Set the attributes in context too
        const updateCartInContext = (name, value) => {

            let updatedItem = {
                id: this.props?.item.id,
                color: this.state.color,
                quantity: this.state.quantity,
                otherAttributes: this.state.otherAttributes
            }

            if(name === "color" )  updatedItem.color = value;
            
            if (name === "quantity") updatedItem.quantity = value;

            if (name === "otherAttributes") updatedItem.otherAttributes = value;

            this.context.setCart([updatedItem])
        }

        const pickColor = (attribute) => {
            this.setState({ color: attribute })
            updateCartInContext("color", attribute)
        }

        const pickOtherAttributes = (name, attribute) => {
            this.setState({
                otherAttributes: {
                    name: name,
                    value: attribute
                }
            })
            updateCartInContext("otherAttributes", attribute)
        }

        const changeQuantity = (input) => {
            const currentQuantity = this.state.quantity;

            let quantity = 0

            if (input === "increase") quantity = currentQuantity + 1
            
            if (input === "decrease" && currentQuantity > 0) quantity = currentQuantity - 1
            
            this.setState({ quantity: quantity })
            updateCartInContext("quantity", quantity)
        }


        // const currentContext = [...this.context.cart]
        // const others = currentContext.filter(item => item.id !== this.props?.item.id)

        // const updatedItem = {
        //     id: this.props?.item.id,
        //     quantity: this.state.quantity,
        //     otherAttributes: this.state.otherAttributes
        // }

        // const newCart = [updatedItem, ...others]

        // console.log("old", currentContext);
        // console.log("new", newCart);
        // console.log(currentContext === newCart);

        if (this.state.initial) {
            // this.context.setCart(newCart)
        }

        return (
            <div className='cart-items' >
                <div className='product-info'>
                    <h2 className='product-brand product-brand-in-cart'>{brand}</h2>
                    <h2 className='product-name'>{name}</h2>
                    {/* Price */}
                    <div className="product-price">
                        <p className='price'>Price:</p>
                        <p className='amount'>{this.state.price.symbol}{this.state.price.amount}</p>
                    </div>
                    {/* Check for any attribute that is not about color if there is any then show it in it's style */}
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
                </div>
                <div className='product-thumbnails'>
                    {
                        // gallery?.map(image => <button key={image} onClick={() => next(image)}> <img src={image} alt="" /></button>)
                    }
                </div>
                <div className="quantity-and-preview-image">
                    <div className="item-quantity">
                        <button onClick={() => changeQuantity("increase")}>+</button>
                        <p>{this.state.quantity}</p>
                        <button onClick={() => changeQuantity("decrease")}>-</button>
                    </div>
                    <div className='cart-item-image'>
                        <img src={gallery?.[this.state.preview]} alt="" />
                        {/* {console.log(gallery?.[this.state.preview])} */}
                        <div className='next-previous-buttons'>
                            <button onClick={() => previous(this.state.preview)}> &lt; </button>
                            <button onClick={() => next(this.state.preview)}> &gt; </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CartItem;