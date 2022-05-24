import React, { useEffect, useState } from "react"
import "../styles/LandingPage.css";
// import {Typewriter} from 'react-simple-typewriter';
import Typewriter from 'typewriter-effect';
import { Element } from "react-scroll";

function LandingPage() {
    const {ethereum} = window;
    const [currentAccount, setCurrentAccount] = useState('');
    const connectBtn = document.querySelector(".connect-btn");
    
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
            connectBtn.textContent = "Connected";
        }
            
        } catch (error) {
          console.log(error); 
        } 
    };

    const checkIfWalletIsConnected = async() => { // checks if metamask installed
       if(!ethereum){
        console.log("Metamask is not installed");
       } else {
        console.log("Ethereum object found", ethereum);  
       }
       
       //check if we are authorized to access user's wallet
       const accounts = await ethereum.request({method: 'eth_accounts'});

       //grab 1st account if we are authorized
       if(accounts.length != 0) {
         const account = accounts[0];
         console.log("Found an authorised account", account);
         setCurrentAccount(account);
       } else {
         console.log("No authorized account found");
       }

    };


    useEffect(() => { // rendered as soon as page loads
     checkIfWalletIsConnected();
    },[]);

  return (
    <div className="landing-container">
        {/* <div className="landing-components"> */}
        <section id="c1" className="destination-1">
            <div className="component-1">
                <div className="home-heading">
                 <p className="home-heading-text">
                <Typewriter
                 options={{autoStart: true,
                    loop: true,
                    delay: 40,
                    typeSpeed: 70,
                    strings:["SHINE NAME SERVICE 🌟"]
                }}
                />
                </p>
                   </div>
                    <div className="wallet-connect-btn body-1">
                    <button type="button" class="btn btn-success connect-btn" onClick={connectWallet}>Connect Wallet <i class="fas fa-wallet"></i></button>
                </div>
            </div>
        </section>
        <section id="c2" className="destination-2">
            <div className="component-2">
                <div className="about-us">
                    <div className="about-us-heading">
                        <h1 className="about-us-heading-text">About Us</h1>
                    </div>
                    <div className="about-us-content">
                        <p className="about-us-para">Shine Name Service(SNS) is a custom domain name service on
                         polygon.<br/>This is similar to DNS but on blockchain. Our aim is to provide users with 
                         a personal domain name (.shine) just like .eth, .sol etc. But why SNS? <br/> We provide
                         you with unique domain name that nobody else can own. Also, it is present on blockchain
                         so it will be immutable. Thus, you can use your domain name as a personal public API from
                         where others can access data or information about you that you want them to access.
                        </p>
                    </div>
                </div>
            </div>
        </section>
        <section id="c3" className="destination-3">
            <div className="component-3">
                <div className="steps">
                    <div className="steps-heading">
                        <h1>How To Use</h1>
                    </div>
                    <div className="steps-content">
                        <div className="step-1">
                            <div className="step-1-heading">
                                <h2><b>1. Connect Wallet <i class="fas fa-link"></i></b></h2>
                            </div>
                            <div className="step-1-content">
                                <p>Click on the <b>Connect Wallet</b> button and connect your wallet by 
                                selecting the desired account from the popup
                                </p>
                            </div>
                        </div>
                        <div className="step-1">
                            <div className="step-1-heading">
                                <h2><b>2. Enter Your Domain <i class="fas fa-keyboard"></i></b></h2>
                            </div>
                            <div className="step-1-content">
                                <p>Enter <b>your domain name</b> in the text area provided and  
                                click on the <b>create domain</b> button and your NFT will be minted
                                </p>
                            </div>
                        </div>
                        <div className="step-1">
                            <div className="step-1-heading">
                                <h2><b>3. View on opensea <i class="fas fa-location-arrow"></i></b></h2>
                            </div>
                            <div className="step-1-content">
                                <p>Click on the <b>domain name generated</b> and it will redirect you 
                                 to your NFT on opensea will all the details you have stored
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </div>
    // </div>
  )
}

export default LandingPage