import React, { Component } from 'react';

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

    // change currency
    setCurrency = (currency, symbol) => {
        this.setState({
            currency: currency,
            symbol: symbol,
            initial: false

        })
    }

    // change category
    setCategory = category => {
        this.setState({
            category: category,
            initial: false
        })
    }

    // Add new items to the cart. Duplicate items will increase quantity, new items will be added to the queue 
    setCart = cart => {
        const oldCart = this.state.cart;

        let duplicates = []

        oldCart?.map(item => {
            if ((JSON.stringify({ id: item.id, color: item.color, otherAttributes: item.otherAttributes }) === JSON.stringify({ id: cart.id, color: cart.color, otherAttributes: cart.otherAttributes }))) {
                duplicates.push(item)
            }
        })


        if (duplicates.length === 0) {
            this.setState({
                cart: [cart, ...oldCart],
                initial: false
            })
        } else {
            let solution = oldCart.find(item => {
                if (JSON.stringify({ id: item.id, color: item.color, otherAttributes: item.otherAttributes }) === JSON.stringify({ id: cart.id, color: cart.color, otherAttributes: cart.otherAttributes })) {
                    item.quantity = item.quantity + 1;
                    return item
                }
            })
            let rest = oldCart.filter(item => {
                if (JSON.stringify(solution) !== JSON.stringify(item)) {
                    return item
                }
            })
            this.setState({
                cart: [solution, ...rest],
                initial: false
            })
        }

    }

    // update whole cart 
    updateCart = cart => {
        this.setState({
            cart: cart,
            initial: false
        })
    }

    render() {
        const { currency, category, symbol, cart } = this.state;
        const { setCurrency, setCategory, setCart, updateCart } = this;

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
        
        // if it's not initial state or currentSessionStorage is false then save the current state saved in session storage for future usage
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
                updateCart,
                setCurrency,
                setCategory,
            }}>
                {this.props.children}
            </UserContext.Provider>
        )
    }
}

export default UserContext;