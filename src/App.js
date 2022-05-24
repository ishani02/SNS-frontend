import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage.js';
import NavBar from './components/NavBar.js';

 const App = async () => {
  const {ethereum} = window;
  let accounts;
  try {
    accounts = await ethereum.request({method: 'eth_accounts'});
  } catch (error) {
    console.log(error);
  }

  return (
  // accounts.length !== 0 ? <Route path="/"><Dashboard/></Route>: 
      //  <Router>
      //  <NavBar/>
      //   <Switch>
      //   <Route path = {`/:Dashboard/`}>
      <div className='app'>
      <React.Fragment>
        <NavBar/>
        <LandingPage/>
       </React.Fragment>
       </div>
      //  </Route> 
      // </Switch>
      //  </Router>
    
   );
}

export default App;
