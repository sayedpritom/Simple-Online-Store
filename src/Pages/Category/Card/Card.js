import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import navigator from '../../../Components/HOC/navigator'
import UserContext from '../../../Context/UserContext'
import cartIcon from '../../../Images/Icons/Green-Cart-Icon.svg'
import './Card.css'



class Card extends Component {
    static contextType = UserContext

    render() {

        const { id, name, gallery, prices, attributes } = this.props.product
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


            const newCart = { id, color, otherAttributes }

            // // get decision if the item will be added or not
            // const addNewItem = function () {

            //     const result = (currentCartContext.filter(item => item.id === id)).find(item => {
            //         const { id, color, quantity, totalPrice, otherAttributes } = item
            //         const itemWithoutIndex = { id, color, quantity, totalPrice, otherAttributes }

            //         if (JSON.stringify(itemWithoutIndex) === JSON.stringify(newCart)) {
            //             item.quantity = item.quantity + 1;
            //             return item
            //         }
            //     })

            //     // const result2 = (currentCartContext.filter(item => item.id === id))

            //     console.log(result)

            //     return result
            // }()

            // if (addNewItem) this.context.setCart([{ id, color, quantity, totalPrice, otherAttributes, index }, ...this.context.cart])


            const operation = currentCartContext.map(item => {
                const { id, color, quantity, totalPrice, otherAttributes, index } = item
                const newQuantity = quantity + 1
                const newTotalPrice = newQuantity * price.amount

                let newItem = { id, color, quantity, totalPrice, otherAttributes, index }

                console.log(JSON.stringify({ id, color, otherAttributes }), JSON.stringify(newCart));

                if (JSON.stringify({ id, color, otherAttributes }) === JSON.stringify(newCart)) {
                    return newItem = { id, color, quantity: newQuantity, totalPrice: newTotalPrice, otherAttributes, index }
                }
                return newItem
            })

            // if (operation === undefined) this.context.setCart([{ id, color, quantity, totalPrice, otherAttributes, index }, ...this.context.cart])
            // this.context.setCart()
            if (operation.find(item => item.id === id)) {
                this.context.setCart(operation)
            } else if (operation.find(item => item.id === id)) {
                

            } else {
                this.context.setCart([{ id, color, quantity, totalPrice, otherAttributes, index }, ...operation])
            }
            console.log(operation)
            // operation.quantity++


            // (currentCartContext.filter(item => item.id === id)).find(item => {
            //     const { id, color, quantity, totalPrice, otherAttributes } = item
            //     const itemWithoutIndex = { id, color, quantity, totalPrice, otherAttributes }

            //     if (JSON.stringify(itemWithoutIndex) === JSON.stringify(newCart)) {
            //         item.quantity = item.quantity + 1;
            //         console.log(item);
            //         // return item
            //     } else {
            //         this.context.setCart([{ id, color, quantity, totalPrice, otherAttributes, index }, ...this.context.cart])
            //     }
            // })

        }

        const redirectToDescriptionPage = (e) => {
            e.target.className !== "green-cart-icon-image" && this.props.navigate(`/pdp/${id}`)
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
        )
    }
}

export default navigator(Card) 