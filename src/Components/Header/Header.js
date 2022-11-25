import React, { Component } from 'react';
import "./Header.css"
import logo from '../../Images/Logo.svg'
import currencyClosedIcon from '../../Images/Icons/CurrencyClosed.svg'
import currencyOpenedIcon from '../../Images/Icons/CurrencyOpened.svg'
import cartIcon from '../../Images/Icons/Cart.svg'
import UserContext from '../../Context/UserContext';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { Link } from 'react-router-dom';


import CartComponents from '../CartComponents/CartComponents.js';
import navigator from '../HOC/navigator';


class Header extends Component {

    static contextType = UserContext;

    constructor(props) {
        super(props)

        this.state = {
            currencies: [],
            categories: [],
            currencyDropDown: false,
            miniCartOpen: false,
        }

        // This is for keeping the location reference of the closing btn & closing the currency dropdown, cart overlay when clicked outside. 

        this.wrapperRefCurrency = React.createRef();
        this.handleClickOutsideCurrency = this.handleClickOutsideCurrency.bind(this);

        this.wrapperRefCart = React.createRef();
        this.handleClickOutsideCart = this.handleClickOutsideCart.bind(this);
    }


    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutsideCurrency);
        document.addEventListener("mousedown", this.handleClickOutsideCart);

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
        document.removeEventListener("mousedown", this.handleClickOutsideCurrency);
        document.removeEventListener("mousedown", this.handleClickOutsideCart);
    }

    // Hide the currency dropdown if clicked outside
    handleClickOutsideCurrency(event) {
        if (this.wrapperRefCurrency && !this.wrapperRefCurrency.current.contains(event.target)) {
            this.setState({ currencyDropDown: false })
        }
    }

    // Hide the cart overlay if clicked outside
    handleClickOutsideCart(event) {
        if (this.wrapperRefCart && !this.wrapperRefCart.current.contains(event.target)) {
            this.setState({ miniCartOpen: false })
        }
    }

    render() {
        // Get all the data from the global context api
        const { currency, symbol, category, cart, miniCart, setCurrency, setCategory, setMiniCart } = this.context;

        // Get total added item quantities 
        const cartQuantity = (cart.map(item => item.quantity)).reduce((accumulator, value) => accumulator + value, 0);

        // Change the currency in context api & set dropdown state to false
        const changeCurrency = (currency, symbol) => {
            this.setState({ currencyDropDown: false })
            setCurrency(currency, symbol)
        }

        const viewBag = () => {
            this.setState({ miniCartOpen: !this.state.miniCartOpen })
            this.props.navigate('/cart')
        }

        return (
            <>
                <div className="header">
                    <div>
                        {this.state.categories?.map(category => <Link key={category.name} to={`/products/${category.name}`}><button className={`categoryBtn ${category.name === this.context.category && 'active'}`} onClick={() => setCategory(category.name.toString())
                        }>{category.name}</button></Link>)}
                    </div>
                    <div>
                        <Link to="/products/all"  onClick={() => setCategory("all")}><img className='headerLogo' src={logo} alt="" /></Link>
                    </div>
                    <div className='CartAndCurrency'>
                        <div className='currencyDropDown' ref={this.wrapperRefCurrency}>
                            <button className='currencyDropDownBtn' onClick={() => this.setState({ currencyDropDown: !this.state.currencyDropDown })}>
                                {symbol}
                                {this.state.currencyDropDown ? <img src={currencyOpenedIcon} alt="" /> : <img src={currencyClosedIcon} alt="" />}
                            </button>
                            {
                                this.state.currencyDropDown &&
                                <div className='currencies'>
                                    {this.state.currencies?.map(currency => <button key={currency.label} onClick={() => changeCurrency(currency.label, currency.symbol)} className='currencyBtn'>{`${currency.symbol} ${currency.label}`}</button>)}
                                </div>
                            }
                        </div>
                        <div className='cart-icon' ref={this.wrapperRefCart}>
                            <button onClick={() => this.setState({ miniCartOpen: !this.state.miniCartOpen })} className='cartBtn'>
                                <img src={cartIcon} alt="" />
                                <p style={{ display: `${cartQuantity > 0 ? 'block' : 'none'}` }} className='cart-length'>{cartQuantity}</p>
                            </button>
                            <div style={{ display: `${this.state.miniCartOpen ? 'block' : 'none'}` }}>
                                <div className='cart-holder'>
                                    {this.state.miniCartOpen && <CartComponents miniCart={true} />}
                                    <button onClick={() => viewBag()} className='view-bag-btn'>View Bag</button>
                                    <button className='check-out-btn'>Check Out</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ display: `${this.state.miniCartOpen ? 'block' : 'none'}` }} className='cart-dark-bg'></div>
            </>
        );
    }
}

export default navigator(Header);