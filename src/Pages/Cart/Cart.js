import React, { Component } from 'react';
import CartComponents from '../../Components/CartComponents/CartComponents';
import UserContext from '../../Context/UserContext';
import './Cart.css'

class Cart extends Component {
    static contextType = UserContext

    render() {
 
        return (
            <div> 
                <CartComponents miniCart={false}></CartComponents>
            </div>
        );

    }
}

export default Cart;