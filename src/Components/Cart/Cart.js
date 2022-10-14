import React, { Component } from 'react';
import UserContext from '../../Context/UserContext';
import CartItem from '../CartItem/CartItem'
import './Cart.css'

class Cart extends Component {
    static contextType = UserContext

    render() {

        const miniCart = this.props.miniCart;

        const { cart } = this.context;

        const totalPrice = (this.context.cart.map(item => item.totalPrice)).reduce((accumulator, value) => accumulator + value, 0).toFixed(2)

        // maybe this quantity needs to be displayed on the cart icon
        const quantity = (this.context.cart.map(item => item.quantity)).reduce((accumulator, value) => accumulator + value, 0)

        const currencySymbol = this.context.symbol;

        return (
            <div className={`${miniCart && 'miniCart'}`}>

                {
                    miniCart ?
                        <p className='cart-heading-mini'>My Bag, <span className='item-count-miniCart'>{this.context.cart.length} items</span></p>
                        : <p className='cart-heading'>Cart</p>
                }
                {
                    cart.map(item => <CartItem key={item.index} item={item} miniCart={miniCart} />)
                }
                {
                    !miniCart ?
                        <div className='total-costing'>
                            <p>Tax 21%: <span className={miniCart ? 'amount-mini' : 'amount'}>{currencySymbol}{Math.round(totalPrice * 0.21).toFixed(2)}</span></p>
                            <p>Quantity: <span className={miniCart ? 'amount-mini' : 'amount'}>{quantity}</span></p>
                            <p className={miniCart ? 'total-amount-mini' : 'total-amount'}>Total: <span className={miniCart ? 'amount-mini' : 'amount'}>{currencySymbol}{totalPrice}</span></p>
                            <button className={miniCart ? 'place-order-btn-mini' : 'place-order-btn'}>Order</button>
                        </div>

                        :

                        <div>
                            <h3>Total: 0</h3>
                            <h3>{currencySymbol}{totalPrice}</h3>
                        </div>
                }
            </div>
        );

    }
}

export default Cart;