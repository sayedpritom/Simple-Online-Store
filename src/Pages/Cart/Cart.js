import React, { Component } from 'react';
import UserContext from '../../Context/UserContext';
import CartItem from '../../Components/CartItem/CartItem';

class Cart extends Component {
    static contextType = UserContext

    render() {
        const { cart } = this.context;

        return (
            <div>
                {
                    cart.map(item => <CartItem key={item.id} item={item} />)
                }
            </div>
        );
    }
}

export default Cart;