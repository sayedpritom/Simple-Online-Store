import React, { Component } from 'react';
import UserContext from '../../Context/UserContext';
import CartItem from '../../Components/CartItem/CartItem';
import './Cart.css'

class Cart extends Component {
    static contextType = UserContext

    render() {
        const { cart } = this.context;

        return (
            <div>
                <p className="cart-heading">Cart</p>
                {
                    cart.map(item => <CartItem key={item.id} item={item} />)
                }
            </div>
        );
    }
}

export default Cart;