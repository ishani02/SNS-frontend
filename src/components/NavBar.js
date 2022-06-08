import React from 'react'
// import {Link} from 'react-router-dom';
import "../styles/NavBar.css";
import { useState, useEffect } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {BrowserRouter} from "react-router-dom";
import { networks } from '../utils/networks';
import {HashLink as Link} from "react-router-hash-link";
import polygonLogo from "./assets/polygonlogo.png";
import ethLogo from "./assets/ethlogo.png";
import Scroll from 'react-scroll';

function NavBar() {
  const {ethereum} = window;
    const [currentAccount, setCurrentAccount] = useState('');
    const [network, setNetwork] = useState('');
    const connectBtn = document.querySelector(".wallet");
    
    const connectWallet = async() => {  //connect wallet => like login to get read-only access to user's wallet
        try {
          if(!ethereum) {
            alert("Please install metamask from => https://metamask.io/");
            return;
          }

        //const accounts = await ethereum.request({method:"eth_requestAccounts"});
        const accounts = await ethereum.request({method: 'eth_accounts'});
        
        if(accounts.length !== 0) {
          const chainId = await ethereum.request({ method: 'eth_chainId' });
          setNetwork(networks[chainId]);
          ethereum.on('chainChanged', handleChainChanged);
          
          function handleChainChanged(_chainId) {
            window.location.reload();
          }
            setCurrentAccount(accounts[0]);
            console.log("Account connected", accounts[0]);
        } else  {
          connectBtn.textContent = "Connect Wallet";
        }
            
        } catch (error) {
          console.log(error); 
        } 
    };

    useEffect(() => { // rendered as soon as page loads
      connectWallet();
     },[]);

    const newNav = () => {
      return (
        <div className='navbar-container'> 
        <div className='links'>
        <nav>
              <div className="right wallet">
      <img alt="Network logo" className="logo" src={ network.includes("Polygon") ? polygonLogo : ethLogo} />
      { network == 'Polygon Mumbai Testnet'?<p > Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p>:<p>Switch to Polygon</p> }
    </div>
      </nav>  
    </div>
    </div>
   );
}

   const nav = () => {
     return(
      <div className='navbar-container'> 
      <div className='links'>
      <nav>
          <ul>   
             <FontAwesomeIcon icon="fa-solid fa-bars"/> 
            <BrowserRouter>
              <li className="s"><Link smooth to= "#c1" id='link'><i class="fas fa-home"></i>Home</Link></li>
              <li className="s"><Link smooth to= "#c2" id='link'><i class="fas fa-info-circle"></i>About Us</Link></li>
              <li className="s"><Link smooth to= "#c3" id='link'><i class="fas fa-file-alt"></i>Steps</Link></li>
            </BrowserRouter>
          </ul>
      </nav>  
    </div>
    </div>
     )
     }

    const selectNav = () => {
      if(currentAccount) {
        return(
         newNav()
        )
      } else {
        return(
        nav()
        )
      }
    }

  return (
      <div>
        {selectNav()}
      </div>    
  )
}

export default NavBar