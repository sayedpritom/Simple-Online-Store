import React, { Component } from 'react';
import UserContext from '../../Context/UserContext';
import CartItem from '../CartItem/CartItem'
import './Cart.css'

class Cart extends Component {
    static contextType = UserContext

    render() {

        const miniCart = true;

        const { cart } = this.context;

        const totalPrice = (this.context.cart.map(item => item.totalPrice)).reduce((accumulator, value) => accumulator + value, 0)

        // maybe this quantity needs to be displayed on the cart icon
        const quantity = (this.context.cart.map(item => item.quantity)).reduce((accumulator, value) => accumulator + value, 0)

        console.log(this.context.cart.map(item => item.totalPrice));

        console.log(this.context.symbol);

        const currencySymbol = this.context.symbol;
 
        return (
            <div> 
                <p className={miniCart ? 'cart-heading-mini' : 'cart-heading'}>Cart</p>
                {
                    cart.map(item => <CartItem key={item.id} item={item} />)
                }
                <div className={miniCart ? 'total-costing-mini' : 'total-costing'}>
                    <p>Tax 21%: <span className={miniCart ? 'amount-mini' : 'amount'}>{currencySymbol}{Math.round(totalPrice * 0.21)}</span></p>
                    <p>Quantity: <span className={miniCart ? 'amount-mini' : 'amount'}>{quantity}</span></p>
                    <p className={miniCart ? 'total-amount-mini' : 'total-amount'}>Total: <span className={miniCart ? 'amount-mini' : 'amount'}>{currencySymbol}{totalPrice}</span></p>
                    <button className={miniCart ? 'place-order-btn-mini' : 'place-order-btn'}>Order</button>
                </div>
            </div>
        );

    }
}

export default Cart;