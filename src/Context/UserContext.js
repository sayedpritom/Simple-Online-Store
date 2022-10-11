import React, { Component } from 'react';
import { json } from 'react-router-dom';

const UserContext = React.createContext();

export class UserProvider extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currency: 'USD',
            category: 'all',
            symbol: '$',
            cart: [],
            initial: true,
            miniCart: false,
        }

    }


    setCurrency = (currency, symbol) => {
        this.setState({ 
            currency: currency,
            symbol: symbol,
            initial: false

         })
    }

    setCategory = category => {
        this.setState({ 
            category: category,
            initial: false
         })
    }

    setCart = cart => {
        this.setState({ 
            cart: cart,
            initial: false
         })
    }

    setMiniCart = () => {
        this.setState({ 
            miniCart: !this.state.miniCart,
         })
    }

    render() {
        const { currency, category, symbol, cart, miniCart } = this.state;
        const { setCurrency, setCategory, setCart, setMiniCart } = this;

        // get & parse data from session storage
        const currentSessionStorage = JSON.parse(sessionStorage.getItem("currentState"));

        // check if it is initial state & if there is data saved in session storage, then set the data 
        if (this.state.initial && currentSessionStorage) {
            const { currency, category, symbol, cart } = currentSessionStorage;
            this.setState({
                currency: currency,
                category: category,
                symbol: symbol,
                cart: cart,
                initial: false
            })
        }
        // if it's not initial state then just keep a copy of the current state saved in session storage for future usage
        else {
            const currentState = {
                currency: this.state.currency,
                category: this.state.category,
                symbol: this.state.symbol,
                cart: this.state.cart,
    
            }
            sessionStorage.setItem("currentState", JSON.stringify(currentState))
        }
        
        return (
            <UserContext.Provider value={{
                currency,
                symbol,
                category,
                cart,
                miniCart,
                setCart,
                setCurrency,
                setCategory,
                setMiniCart,
            }}>
                {this.props.children}
            </UserContext.Provider>
        )
    }
}

export default UserContext;