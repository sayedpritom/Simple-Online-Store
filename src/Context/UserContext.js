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
        }
        
      }

    setCurrency = (currency, symbol) => {
        this.setState({currency: currency})
        this.setState({symbol: symbol})
    }

    setCategory = category => {
        this.setState({category: category})
    }

    setCart = cart => {
        console.log(cart);
        this.setState({cart})
    }

    render() {
        const {currency, category, symbol, cart} = this.state;
        const {setCurrency, setCategory, setCart} = this;
        // console.log(this.state.cart);
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