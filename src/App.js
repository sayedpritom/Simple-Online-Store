import React, { Component } from 'react'
import './App.css';
import Header from './Components/Header/Header';
import Category from './Pages/Category/Category';

import { UserProvider } from './Context/UserContext';

class App extends Component {
  render() {
    return (
      <div className="App">
        <UserProvider>
          <Header />
          <Category />
        </UserProvider>
      </div>
    );
  }
}

export default App;
