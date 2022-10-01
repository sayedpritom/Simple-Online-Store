import React, { Component } from 'react'
import './App.css';
import Header from './Components/Header/Header';
import Category from './Pages/Category/Category';

import { UserProvider } from './Context/UserContext';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductDescription from './Pages/Category/ProductDescription/ProductDescription';
import Cart from './Pages/Cart/Cart';

class App extends Component {
  render() {
    return (
      <div className="App">
        <UserProvider>
          <BrowserRouter>
          <Header />
            <Routes>
              <Route index element={<Category />} />
              <Route path="pdp/:id" element={<ProductDescription />} />
              <Route path="cart" element={<Cart />} />
              
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </div>
    );
  }
}

export default App;
