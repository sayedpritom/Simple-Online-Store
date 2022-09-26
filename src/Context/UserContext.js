import React, { Component } from 'react';

const UserContext = React.createContext();

export class UserProvider extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currency: 'USD',
            category: 'all',
            symbol: '$'
        }
      }

    setCurrency = (currency, symbol) => {
        this.setState({currency: currency})
        this.setState({symbol: symbol})
    }

    setCategory = category => {
        this.setState({category: category})
    }

    render() {
        const {currency, category, symbol} = this.state;
        const {setCurrency, setCategory} = this;
        return (
            <UserContext.Provider value={{
                currency,
                symbol,
                category,
                setCurrency,
                setCategory
            }}>
                {this.props.children}
            </UserContext.Provider>
        )
    }
}

export default UserContext;