import React, { Component } from 'react'
import './App.css';
import Header from './Components/Header/Header';
import Category from './Pages/Category/Category';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Category />

      </div>
    );
  }
}

export default App;
