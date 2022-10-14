import React, { Component } from 'react'
import './App.css';
import Header from './Components/Header/Header';
import Category from './Pages/Category/Category';
import { UserProvider } from './Context/UserContext';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductDescription from './Pages/Category/ProductDescription/ProductDescription';
import Bag from './Pages/Bag/Bag';


class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="app-body">
          <UserProvider>
            <BrowserRouter>
              <Header />
              <Routes>
                <Route index element={<Category />} />
                <Route path="pdp/:id" element={<ProductDescription />} />
                <Route path="/cart" element={<Bag />} />
              </Routes>
            </BrowserRouter>
          </UserProvider>
        </div>
      </div>
    );
  }
}

export default App;
