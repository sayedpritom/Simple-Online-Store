import React, { Component } from 'react';
import UserContext from '../../../Context/UserContext';
import cartIcon from '../../../Images/Icons/Green-Cart-Icon.svg'
import './Card.css'

class Card extends Component {
    static contextType = UserContext;


    render() {
        const { name, gallery, prices } = this.props.product;
        let price = prices.find(price => price.currency.label === this.context.currency && price.currency.label)
        // console.log(price.amount);
        return (
            <div className='card'>
                <div className='card-image'>
                    <img className='card-image' src={gallery[0]} alt="" />
                    <img className='green-cart-icon' src={cartIcon} alt="" />
                </div>
                <p className='product-name'>{name}</p>
                <p className='product-price'>{this.context.symbol}{price.amount}</p>
            </div>
        );
    }
}

export default Card;