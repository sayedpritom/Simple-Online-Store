import React, { Component } from 'react';
import UserContext from '../../Context/UserContext';
import CartItem from '../../Components/CartItem/CartItem';
import './Cart.css'

class Cart extends Component {
    static contextType = UserContext

    render() {
        const { cart } = this.context;

        const totalPrice = (this.context.cart.map(item => item.totalPrice)).reduce((accumulator, value) => accumulator + value, 0)

        console.log(this.context.cart.map(item => item.totalPrice));

        return (
            <div>
                <p className="cart-heading">Cart</p>
                {
                    cart.map(item => <CartItem key={item.id} item={item} />)
                }
                <h1>{totalPrice}</h1>
            </div>
        );
    }
}

export default Cart;