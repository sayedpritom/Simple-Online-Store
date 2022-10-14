import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import navigator from '../../../Components/HOC/navigator';
import UserContext from '../../../Context/UserContext';
import cartIcon from '../../../Images/Icons/Green-Cart-Icon.svg'
import './Card.css'



class Card extends Component {
    static contextType = UserContext;

    render() {

        const { id, name, gallery, prices, attributes } = this.props.product;
        let price = prices.find(price => price.currency.label === this.context.currency && price.currency.label)

        const addToCart = id => {

            const findColor = (attributes.find(item => item.name === 'Color'))?.items[0].value;
            const color = findColor ? findColor : "";
            const quantity = 1;
            const totalPrice = price.amount;
            const others = attributes.find(item => item.name !== 'Color');

            const name = others.name;
            const value = others.items[0].value

            const otherAttributes = { name, value }

            const currentCartContext = this.context.cart;
            const index = currentCartContext.length + 1;


            const newCart = { id, color, quantity, totalPrice, otherAttributes }

            const alreadyExists = (currentCartContext.filter(item => item.id === id)).find(item => {

                const { id, color, quantity, totalPrice, otherAttributes } = item;
                const itemWithoutIndex = { id, color, quantity, totalPrice, otherAttributes }

                if(JSON.stringify(itemWithoutIndex) === JSON.stringify(newCart)) {
                    return item
                } else {
                    return false
                }
            })

            console.log(alreadyExists);

            if (!alreadyExists) this.context.setCart([{ id, color, quantity, totalPrice, otherAttributes, index }, ...this.context.cart])
        }

        const redirectToDescriptionPage = (e) => {
            e.target.className !== "green-cart-icon-image" && this.props.navigate(`/pdp/${id}`);
        }

        return (
            <div onClick={redirectToDescriptionPage} className='card'>
                <div className='card-image'>
                    <img className='card-image' src={gallery[0]} alt="" />
                    <button ref={this.cartButtonRef} onClick={() => addToCart(id)} className='green-cart-icon'><img className='green-cart-icon-image' src={cartIcon} alt="" /></button>
                </div>
                <p className='product-names'>{name}</p>
                <p className='product-price'>{this.context.symbol}{price.amount}</p>
            </div >
        );
    }
}

export default navigator(Card);