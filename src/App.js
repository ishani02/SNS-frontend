import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage.js';
import NavBar from './components/NavBar.js';
const {ethereum}  = window;

function App() {
  const {ethereum} = window;
  
  return (
    <div className="App">
      <React.Fragment>
       <NavBar/>
       <LandingPage/>
       {/* <Dashboard/> */}
      </React.Fragment>
    </div>
  );
}

export default App;
