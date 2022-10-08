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


        // change the preview image
        const next = preview => preview < gallery.length - 1 && this.setState({ preview: preview + 1 })
        const previous = preview => preview > 0 && this.setState({ preview: preview - 1 })


        // Set the attributes in context too
        const updateCartInContext = (name, value) => {

            const currentContext = this.context.cart

            // const others = currentContext.filter(item => item.id !== this.props?.item.id)

            const updatedCart = currentContext.map(item => {

                if (item.index === this.props?.item.index) {
                    item.id = this.props?.item.id;
                    item.color = this.state.color;
                    item.quantity = this.state.quantity;
                    item.otherAttributes = this.state.otherAttributes


                    if (name === "color") item.color = value;

                    if (name === "quantity") item.quantity = value;

                    if (name === "otherAttributes") item.otherAttributes = value;

                    // return item
                }

                return item;

            })
            this.context.setCart(updatedCart)

        }

        // Attribute selectors
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
            updateCartInContext("otherAttributes", {
                name: name,
                value: attribute
            })
        }

        const changeQuantity = (input) => {
            const currentQuantity = this.state.quantity;

            let quantity = 0

            if (input === "increase") quantity = currentQuantity + 1

            if (input === "decrease" && currentQuantity > 0) quantity = currentQuantity - 1

            this.setState({ quantity: quantity })
            updateCartInContext("quantity", quantity)
        }


        const savedAttributes = { color: this.props?.item.color, otherAttributes: this.props?.item.otherAttributes, quantity: this.props?.item.quantity };
        const attributesLength = Object.keys(savedAttributes).length;

        console.log("render");

        // if length is more than 1 then it means it has not only the id but other properties too
        // to prevent infinite loop the initial state is used.
        if (attributesLength > 1 && this.state.initial) {
            savedAttributes.color && this.setState({ color: savedAttributes.color })
            savedAttributes.otherAttributes && this.setState({ otherAttributes: savedAttributes.otherAttributes })
            savedAttributes.quantity && this.setState({ quantity: savedAttributes.quantity })
            this.setState({ initial: false })
            console.log("jj");
        }
        else if (this.state.initial) {
            console.log("kk");
            // find out color, attributes & set them
            const colors = this.state.product.attributes?.find(attribute => attribute.name === "Color")
            const otherAttributes = this.state.product.attributes?.find(attribute => attribute.name !== "Color")
            console.log(colors, this.state.product);
            colors && this.setState({ color: colors.items[0].value })

            otherAttributes && this.setState({
                otherAttributes: {
                    name: otherAttributes.name,
                    value: otherAttributes.items[0].value,
                },
                initial: false
            })
            // this.setState({initial: false})
        }

        // get the current item
        let currentItem = this.context.cart.find(item => item.index === this.props?.item.index);

        // find it's total price
        const totalPrice = this.state.quantity * this.state.price.amount;

        // create a new item
        const updatedItem = {...currentItem, totalPrice}

        // replace the old item by the new one in a new array
        const updatedCart = this.context.cart.map(item => {
            if (item.index === this.props?.item.index) {
                return updatedItem
            } else {
                return item
            }
        })

        // if the old cart is not equals to the new cart then update the cart. This helps preventing infinite loop. 
        if (JSON.stringify(this.context.cart) !== JSON.stringify(updatedCart)) {
            this.context.setCart(updatedCart)
        }




        return (
            <div className='cart-item' >
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