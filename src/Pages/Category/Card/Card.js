import React, { Component } from 'react';
import './Card.css'

class Card extends Component {
    render() {
        const {name, gallery, prices} = this.props.product;
        return (
            <div className='card'>
                <img src={gallery[0]} alt="" />
                <h1>{name}</h1>
                <p>${prices[0].amount}</p>
            </div>
        );
    }
}

export default Card;