import React, { Component } from 'react'
import './App.css';
import Header from './Components/Header/Header';
import Category from './Pages/Category/Category';
import { UserProvider } from './Context/UserContext';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProductDescription from './Pages/Category/ProductDescription/ProductDescription';
import Cart from './Pages/Cart/Cart';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="app-body">
          <UserProvider>
            <BrowserRouter>
              <Header />
              <Routes>
                <Route index path="/" element={<Navigate to="/products/all" />} />
                <Route path="/products/:category" element={<Category />} />
                <Route path="pdp/:id" element={<ProductDescription />} />
                <Route path="/cart" element={<Cart />} />
              </Routes>
            </BrowserRouter>
          </UserProvider>
        </div>
        <ToastContainer />
      </div>
    );
  }
}

export default App;
