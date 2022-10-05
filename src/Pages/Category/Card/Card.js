import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../../Context/UserContext';
import cartIcon from '../../../Images/Icons/Green-Cart-Icon.svg'
import './Card.css'
import { useNavigate } from "react-router-dom";

function navigate(Component) {
    return function WrappedComponent(props) {
        const navigator = useNavigate();
        return <Component {...props} navigator={navigator} />;
    }
}


class Card extends Component {
    static contextType = UserContext;

    render() {
        const { id, name, gallery, prices, attributes, } = this.props.product;
        let price = prices.find(price => price.currency.label === this.context.currency && price.currency.label)

        const addToCart = id => {
            let oldCart = [this.context.cart]
            let newCart = [{ id }, ...oldCart]

            if (oldCart !== newCart) this.context.setCart([{ id }, ...this.context.cart])
            // console.log(oldCart, newCart);
        }

        const redirectToDescriptionPage = (e) => {
            console.log(e.target.className);
            e.target.className !== "green-cart-icon-image" && this.props.navigator(`/pdp/${id}`);
        }

        return (
            <div onClick={redirectToDescriptionPage} className='card'>
                <div className='card-image'>
                    <img className='card-image' src={gallery[0]} alt="" />
                    <button ref={this.cartButtonRef} onClick={() => addToCart(id)} className='green-cart-icon'><img className='green-cart-icon-image' src={cartIcon} alt="" /></button>
                </div>
                <Link className='product-link' to={`pdp/${id}`}>
                    <p className='product-names'>{name}</p>
                </Link>
                <p className='product-price'>{this.context.symbol}{price.amount}</p>
            </div >
        );
    }
}

export default navigate(Card);