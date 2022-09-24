import React, { Component } from 'react';
import "./Header.css"
import logo from '../../Images/Logo.svg'
import currencyClosedIcon from '../../Images/Icons/CurrencyClosed.svg'
import currencyOpenedIcon from '../../Images/Icons/CurrencyOpened.svg'
import cartIcon from '../../Images/Icons/Cart.svg'

class Header extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currencyList: false
        }

        this.state = {
            currentCurrency: "dollar"
        }

        this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }


    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }


    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.setState({ currencyList: false })
        }
    }


    render() {
        return (
            <div ref={this.wrapperRef} className="header container">
                <div>
                    <button className='categoryBtn active'>Women</button>
                    <button className='categoryBtn'>Men</button>
                    <button className='categoryBtn'>Kids</button>
                </div>
                <div>
                    <img className='headerLogo' src={logo} alt="" />
                </div>
                <div className='CartAndCurrency'>
                    <button onClick={() => this.setState({ currencyList: !this.state.currencyList })}>
                        {this.state.currentCurrency === "dollar" && "$"}
                        {this.state.currentCurrency === "euro" && "€"}
                        {this.state.currentCurrency === "yen" && "¥"}
                        {this.state.currencyList ? <img src={currencyOpenedIcon} alt="" /> : <img src={currencyClosedIcon} alt="" />}
                    </button>
                    <button className='cartIcon'><img src={cartIcon} alt="" /></button>
                    {
                        this.state.currencyList &&
                        <div className='currencies'>
                            <button onClick={() => this.setState({ currentCurrency: "dollar", currencyList: false })} className='currency'>$ USD</button>
                            <button onClick={() => this.setState({ currentCurrency: "euro", currencyList: false})} className='currency'>€ EUR</button>
                            <button onClick={() => this.setState({ currentCurrency: "yen", currencyList: false})} className='currency'>¥ JPY</button>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default Header;