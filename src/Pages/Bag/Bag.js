import React, { Component } from 'react';
import Cart from '../../Components/Cart/Cart';
import UserContext from '../../Context/UserContext';
import './Bag.css'

class Bag extends Component {
    static contextType = UserContext

    render() {
 
        return (
            <div> 
                <Cart></Cart>
            </div>
        );

    }
}

export default Bag;