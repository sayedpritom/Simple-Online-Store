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
            cart,
            initial: false
         })
    }

    render() {
        const { currency, category, symbol, cart } = this.state;
        const { setCurrency, setCategory, setCart } = this;

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
        // if it's not initial stage then just keep a copy of the current state saved in session storage for future usage
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
                setCart,
                setCurrency,
                setCategory
            }}>
                {this.props.children}
            </UserContext.Provider>
        )
    }
}

export default UserContext;