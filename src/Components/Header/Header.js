import React, { Component } from 'react';
import "./Header.css"
import logo from '../../Images/Logo.svg'
import currencyClosedIcon from '../../Images/Icons/CurrencyClosed.svg'
import currencyOpenedIcon from '../../Images/Icons/CurrencyOpened.svg'
import cartIcon from '../../Images/Icons/Cart.svg'
import UserContext from '../../Context/UserContext';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';


class Header extends Component {

    static contextType = UserContext;

    constructor(props) {
        super(props)

        this.state = {
            currencies: []
        }
        this.state = {
            categories: []
        }

        this.state = {
            currencyDropDown: false
        }

        // This is for keeping the location reference of the closing btn  & closing the currency dropdown when clicked outside. 
        this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }


    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);

        // Load & set the categories & currencies

        const client = new ApolloClient({
            uri: 'http://localhost:4000/',
            cache: new InMemoryCache(),
        });

        client
            .query({
                query: gql`
                {
                    categories {
                      name
                    }
                    currencies {
                      label
                      symbol
                    }
                  }    
                `,
            })
            .then((result) => {
                this.setState({ categories: result.data.categories })
                this.setState({ currencies: result.data.currencies })
            })
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    // Hide the currency dropdown if clicked outside
    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.setState({ currencyDropDown: false })
        }
    }

    render() {
        // Get all the data from the global context api
        const { currency, symbol, category, setCurrency, setCategory } = this.context;

        // Change the currency in context api & set dropdown state to false
        const changeCurrency = (currency, symbol) => {
            this.setState({ currencyDropDown: false })
            setCurrency(currency, symbol)
        }

        return (
            <div className="header container">

                {/* Mapping all the categories available */}
                <div>
                    {this.state.categories?.map((category, index) => <button key={index} className={`categoryBtn ${category.name === this.context.category && 'active'}`} onClick={() => setCategory(category.name.toString())
                    }>{category.name}</button>)}
                </div>

                {/* Brand Logo */}
                <div>
                    <img className='headerLogo' src={logo} alt="" />
                </div>

                {/* Currency Dropdown & cart  */}
                <div className='CartAndCurrency'>
                    
                    <div className='currencyDropDown' ref={this.wrapperRef}>
                        {/* Currency dropdown button */}
                        <button className='currencyDropDownBtn' onClick={() => this.setState({ currencyDropDown: !this.state.currencyDropDown })}>
                            {symbol}
                            {this.state.currencyDropDown ? <img src={currencyOpenedIcon} alt="" /> : <img src={currencyClosedIcon} alt="" />}
                        </button>

                        {/* Currency Picker Buttons */}
                        {
                            this.state.currencyDropDown &&
                            <div className='currencies'>
                                {this.state.currencies?.map(currency => <button key={currency.label} onClick={() => changeCurrency(currency.label, currency.symbol)} className='currencyBtn'>{`${currency.symbol} ${currency.label}`}</button>)}
                            </div>
                        }
                    </div>

                    {/* Cart Button */}
                    <button className='cartBtn'><img src={cartIcon} alt="" /></button>
                </div>
            </div>
        );
    }
}

export default Header;