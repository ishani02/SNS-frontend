import React from 'react'
// import {Link} from 'react-router-dom';
import "../styles/NavBar.css";
import { useState } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {BrowserRouter} from "react-router-dom";
import {HashLink as Link} from "react-router-hash-link";
import Scroll from 'react-scroll';
const ScrollLink = Scroll.ScrollLink;

function NavBar() {
  const {ethereum} = window;
    const [currentAccount, setCurrentAccount] = useState('');
    const connectBtn = document.querySelector(".wallet");
    
    const connectWallet = async() => {  //connect wallet => like login to get read-only access to user's wallet
        try {
          if(!ethereum) {
            alert("Please install metamask from => https://metamask.io/");
            return;
          }

        const accounts = await ethereum.request({method:"eth_requestAccounts"});

        if(accounts.length !== 0) {
            setCurrentAccount(accounts[0]);
            console.log("Account connected", accounts[0]);
            connectBtn.textContent = `${accounts[0].slice(0,6)+"...."+accounts[0].slice(-4)}`;
            window.location.reload();
        } else  {
          connectBtn.textContent = "Connect Wallet";
        }
            
        } catch (error) {
          console.log(error); 
        } 
    };

  return (
    <div className='navbar-container'>
        {/* <div className='logo'>
            <Link to="/"><img src={logo} alt='logo'/></Link>
        </div> */}
        <div className='links'>
        <nav>
            <ul>
              <FontAwesomeIcon icon="fa-solid fa-bars"/>
              <BrowserRouter>
                <li className="s"><Link smooth to= "#c1" id='link'><i class="fas fa-home"></i>Home</Link></li>
                <li className="s"><Link smooth to= "#c2" id='link'><i class="fas fa-info-circle"></i>About Us</Link></li>
                <li className="s"><Link smooth to= "#c3" id='link'><i class="fas fa-file-alt"></i>Steps</Link></li>
              </BrowserRouter>
                <li className="s wallet" onClick={connectWallet}><i class="fas fa-wallet"></i>Connect Wallet</li> 
            </ul>
        </nav>  
      </div>
    </div>
  )
}

export default NavBar