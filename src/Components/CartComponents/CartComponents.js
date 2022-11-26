import React, { Component } from 'react';
import UserContext from '../../Context/UserContext';
import CartComponent from '../CartComponent/CartComponent'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import './CartComponents.css'

class CartComponents extends Component {
    static contextType = UserContext

    constructor(props) {
        super(props)
        this.state = {
            totalPrice: 0,
        }
    }

    render() {

        const miniCart = this.props.miniCart;

        const { cart } = this.context;

        const currencySymbol = this.context.symbol;

        const client = new ApolloClient({
            uri: 'http://localhost:4000/',
            cache: new InMemoryCache(),
        });

        // Store all the unfulfilled promises
        let promises = [];
        this.context.cart.forEach(element => {
            promises.push(client
                .query({
                    query: gql`
                    {
                        product(id: ${JSON.stringify(element.id)}) {
                            id
                            name
                            prices {
                                currency {
                                    label
                              symbol
                            }
                            amount
                        }
                    }
                }
                `,
                }))
        })

        // fulfill all the unfulfilled promises & set the total sum of the cart products prices in state. 
        Promise.all([...promises])
            .then(result => {

                // get the ids and amounts of the cart products
                const productsIdAmount = result.map(item => {
                    let amount = item.data.product.prices.find(item => item.currency.label === this.context.currency).amount
                    const id = item.data.product.id
                    return { id, amount }

                })

                // get the total sum
                const sum = this.context.cart.map(item => {
                    const amount = productsIdAmount.find(product => product.id === item.id).amount * item.quantity
                    return amount
                }).reduce((accumulator, value) => accumulator + value, 0).toFixed(2)

                const oldTotal = this.state.totalPrice;

                if (oldTotal !== sum) {
                    this.setState({ "totalPrice": sum })
                }
            })


        // get total items quantities
        const quantity = (this.context.cart.map(item => item.quantity)).reduce((accumulator, value) => accumulator + value, 0)


        const totalPrice = Number(this.state.totalPrice);
        const tax = Number((totalPrice * 0.21).toFixed(2));

        const grandTotal = (totalPrice + tax).toFixed(2);


        return (
            <div className={`${miniCart && 'miniCart'}`}>

                {
                    miniCart ?
                        <p className='cart-heading-mini'>My Bag, <span className='item-count-miniCart'>{this.context.cart.length} {this.context.cart.length > 1 ? 'items' : 'item'}</span></p>
                        : <p className='cart-heading'>Cart</p>
                }
                {
                    cart.map(item => <CartComponent key={item.index} item={item} miniCart={miniCart} />)
                }
                {
                    !miniCart ?
                        <div className='total-costing'>
                            <p>Tax 21%: <span className={miniCart ? 'amount-mini' : 'amount'}>{currencySymbol}{tax}</span></p>
                            <p>Quantity: <span className={miniCart ? 'amount-mini' : 'amount'}>{quantity}</span></p>
                            <p className={miniCart ? 'total-amount-mini' : 'total-amount'}>Total: <span className={miniCart ? 'amount-mini' : 'amount'}>{currencySymbol}{grandTotal}</span></p>
                            <button className={miniCart ? 'place-order-btn-mini' : 'place-order-btn'}>Order</button>
                        </div>

                        :

                        <div className='total-costing-mini'>
                            <h3>Total</h3>
                            <h3>{currencySymbol}{grandTotal}</h3>
                        </div>
                }
            </div>
        );

    }
}

export default CartComponents;