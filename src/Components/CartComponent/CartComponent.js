import React, { Component } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import UserContext from '../../Context/UserContext';
import './CartComponent.css'


class CartComponent extends Component {
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


        // In cart context there are saved attributes & values which were manually selected by the user in description page and came here as props. 
        const savedAttributes = { color: this.props?.item.color, otherAttributes: this.props?.item.otherAttributes, quantity: this.props?.item.quantity };

        // To prevent infinite loop the initial state is used as the state is being set from the render function.
        if (this.state.initial) {
            this.setState({ 
                color: savedAttributes.color,
                otherAttributes: savedAttributes.otherAttributes,
                quantity: this.props?.item.quantity,
                initial: false 
            })
        }


        const { brand, name, gallery, attributes, } = this.state.product;

        // check cart status
        const miniCart = this.props.miniCart;

        // Get the attributes 
        const colorAttribute = attributes?.find(attribute => attribute.name === "Color");
        const otherAttributes = attributes?.find(attribute => attribute.name !== "Color");


        // get the current cart item & it's selected attributes
        const currentItem = this.context.cart.find(item => item.index === this.props?.item.index);
        const { quantity, color } = currentItem;
        const selectedOthersAttributes = currentItem.otherAttributes;


        // change the preview image
        const next = preview => preview < gallery.length - 1 && this.setState({ preview: preview + 1 })
        const previous = preview => preview > 0 && this.setState({ preview: preview - 1 })


        // Set the updated cart in context 
        const updateCartInContext = (name, value) => {

            const currentContext = this.context.cart

            if (name === 'deleteItem') {
                const others = currentContext.filter(item => item.index !== this.props?.item.index)
                this.context.updateCart(others)

            } else {
                const updatedCart = currentContext.map(item => {
                    if (item.index === this.props?.item.index) {
                        item.id = this.props?.item.id;
                        item.index = this.props?.item.index;
                        item.color = this.state.color;
                        item.quantity = quantity;
                        item.otherAttributes = this.state.otherAttributes

                        if (name === "quantity") item.quantity = value;
                        if (name === "totalPrice") item.totalPrice = value;
                    }

                    return item;

                })
                this.context.updateCart(updatedCart)
            }

        }


        const changeQuantity = (input) => {

            let newQuantity = 0
            let totalPrice;

            if (input === "increase") newQuantity = quantity + 1

            if (input === "decrease" && quantity > 0) newQuantity = quantity - 1

            totalPrice = newQuantity * this.state.price.amount

            updateCartInContext("totalPrice", totalPrice)
            updateCartInContext("quantity", newQuantity)

            // Remove the item from cart if it's quantity becomes 0
            newQuantity < 1 && updateCartInContext('deleteItem', 0)
        }


        return (
            <div className='cart-item' >
                <div className={`product-info ${miniCart && 'product-info-mini'}`}>
                    <h2 className={`product-brand product-brand-in-cart ${miniCart && 'product-brand-in-cart-mini'}`}>{brand}</h2>
                    <h2 className={`product-name ${miniCart && 'product-name-mini'}`}>{name}</h2>
                    {/* Price */}
                    <div className="product-price">
                        <p className={`price ${miniCart && 'price-mini'}`}>Price:</p>
                        <p className={`amount ${miniCart && 'amount-mini'}`}>{this.state.price.symbol}{this.state.price.amount}</p>
                    </div>
                    {/* Check for any attribute that is not about color if there is any then show it in it's style */}
                    {otherAttributes &&
                        <div>
                            <p className={`others ${miniCart && 'others-mini'}`}>{otherAttributes.name}</p>
                            <div className={`other-attributes ${miniCart && 'other-attributes-mini'}`}>
                                {otherAttributes.items.map(item => <button key={item.value} className={`${selectedOthersAttributes.value === item.value && 'selected-other-attributes'}`}>{item.value}</button>)}
                            </div>
                        </div>
                    }
                    {/* Check if the color attribute exists, if so then show in the colors style*/}
                    {colorAttribute &&
                        <div>
                            <p className={`color ${miniCart && 'color-mini'}`}>{colorAttribute.name}:</p>
                            <div className={`color-attributes ${miniCart && 'color-attributes-mini'}`}>
                                {colorAttribute.items.map(item => <button className={`${item.value === color && 'selected-color-attribute'} ${item.value === color && miniCart && 'selected-color-attribute-mini'}`} key={item.value} style={{ backgroundColor: `${item.value}` }} ></button>)}
                            </div>
                        </div>
                    }
                </div>
                <div className="quantity-and-preview-image">
                    <div className={`item-quantity ${miniCart && 'item-quantity-mini'}`}>
                        <button onClick={() => changeQuantity("increase")}>+</button>
                        <p className={`${miniCart && 'quantity-mini'}`}>{quantity}</p>
                        <button onClick={() => changeQuantity("decrease")}>-</button>
                    </div>
                    <div className={`cart-item-image ${miniCart && 'cart-item-image-mini'}`}>
                        <img src={gallery?.[this.state.preview]} alt="" />
                        <div style={{ display: `${gallery?.length > 1 && !miniCart ? 'block' : 'none'}` }} className={`next-previous-buttons ${miniCart && 'next-previous-buttons-mini'}`}>
                            <button onClick={() => previous(this.state.preview)}> &lt; </button>
                            <button onClick={() => next(this.state.preview)}> &gt; </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CartComponent;