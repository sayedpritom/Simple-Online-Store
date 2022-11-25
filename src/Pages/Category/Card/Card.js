import './Card.css'
import React, { Component } from 'react'
import navigator from '../../../Components/HOC/navigator'
import UserContext from '../../../Context/UserContext'
import cartIcon from '../../../Images/Icons/Green-Cart-Icon.svg'


class Card extends Component {
    static contextType = UserContext

    render() {

        const { id, name, brand, gallery, prices, inStock, attributes } = this.props.product
        let price = prices.find(price => price.currency.label === this.context.currency && price.currency.label)



        const addToCart = id => {

            const findColor = (attributes.find(item => item.name === 'Color'))?.items[0].value
            const findOthers = attributes.find(item => item.name !== 'Color')

            const color = findColor ? findColor : ""
            const others = findOthers ? findOthers : { name: "", items: [{ value: "" }] };
            const quantity = 1
            const totalPrice = price.amount

            const name = others.name
            const value = others.items[0].value

            const otherAttributes = { name, value }

            const currentCartContext = this.context.cart
            const index = currentCartContext.length + 1

            this.context.setCart({ id, color, quantity, totalPrice, otherAttributes, index })

        }

        // go to product description page when clicked on the product card div area but not on the add to cart icon
        const redirectToDescriptionPage = (e) => {
            e.target.className !== "green-cart-icon-image" && this.props.navigate(`/pdp/${id}`)
        }

        return (
            <div onClick={redirectToDescriptionPage} className='card'>
                <div className='card-image'>
                    <img className='card-image' src={gallery[0]} alt="" />
                    <button ref={this.cartButtonRef} onClick={() => inStock && addToCart(id)} className='green-cart-icon'><img className='green-cart-icon-image' src={cartIcon} alt="" /></button>
                </div>
                <p className='product-name-card'>{name} {brand}</p>
                {
                    inStock ?
                    <p className="in-stock">In stock</p> :
                    <p className="out-of-stock">Out of stock</p>
                }
                <p className='product-price'>{this.context.symbol}{price.amount}</p>
            </div >
        )
    }
}

export default navigator(Card) 