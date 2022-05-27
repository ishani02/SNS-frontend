import React, { useEffect, useState } from "react"
import "../styles/LandingPage.css";
import "../styles/NavBar.css";
// import {Typewriter} from 'react-simple-typewriter';
import { ethers } from "ethers";
import contractABI from "../utils/contractABI.json";
import Typewriter from 'typewriter-effect';
import { networks } from '../utils/networks';
import { Element } from "react-scroll";
import Dashboard from "./Dashboard";
const Web3 = require("web3");
const tld = ".shine";

function LandingPage() {
    const {ethereum} = window;
    const [currentAccount, setCurrentAccount] = useState('');
    const [domain, setDomain] = useState('');
    const [record, setRecord] = useState('');
    const [network, setNetwork] = useState('');
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const[mints, setMints] = useState([]);
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


  const mintDomain = async() => {
    if(!domain) return;
    if(domain.length < 3) {
      alert("Domain name too short");
      return;
    }
    try {
      const {ethereum} = window;
      if(ethereum) {
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        setNetwork(networks[chainId]);
        if(network !== 'Polygon Mumbai Testnet') {
          alert("Switch To polygon");
          return;
        }
        ethereum.on('chainChanged', handleChainChanged);
        
        function handleChainChanged(_chainId) {
          window.location.reload();
        }
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract("0x42B658aAd387B8471e0511964a8b60eBb4d24b46",contractABI.abi, signer);
        let price = domain.length == 3 ? '0.5' : domain.length == 4 ? '0.3' : '0.1';
        console.log("Minting your domain",domain, "at price: ", price);

       let txn = await contract.register(domain, {value: ethers.utils.parseEther(price)}); // calls contract's method =>  metamask pops up
       const receipt = await txn.wait(); // waits for the transaction to be mined

       if(receipt.status == 1) {
         console.log("Domain minted successfully!!");
         console.log("https://mumbai.polygonscan.com/tx/"+txn.hash);
         console.log(txn.hash);
       }
       txn = await contract.attachDataToDomain(domain, Array(record));
       await txn.wait();
         console.log("Record set successfully at https://mumbai.polygonscan.com/tx/"+txn.hash);
         
          // Call fetchMints after 2 seconds
        setTimeout(() => {
          fetchMints();
        }, 2000);
         setDomain('');
         setRecord('');
 
      } else {
        alert("Transaction failed!! Please Try again");
      }
      
    } catch (error) {
      console.log(error); 
    }
  }
   
  const updateDomain = async () => {
    if (!record || !domain) { return }
    setLoading(true);
    console.log("Updating domain", domain, "with record", record);
      try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract("0x42B658aAd387B8471e0511964a8b60eBb4d24b46", contractABI.abi, signer);
  
        let tx = await contract.setRecord(domain, record);
        await tx.wait();
        console.log("Record set https://mumbai.polygonscan.com/tx/"+tx.hash);
  
        fetchMints();
        setRecord('');
        setDomain('');
      }
      } catch(error) {
        console.log(error);
      }
    setLoading(false);
  }

  const fetchMints = async() => {
     try {
       if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract("0x42B658aAd387B8471e0511964a8b60eBb4d24b46", contractABI.abi, signer);

        const names = await contract.getAllNames();

        const mintRecords = await Promise.all(names.map(async (name) => {
          const mintRecord = await contract.records(name);
          const owner = await contract.domains(name);
          return {
            id: names.indexOf(name),
            name: name,
            record: mintRecord,
            owner: owner,
          };
        }));
        console.log("MINTS FETCHED ", mintRecords);
        setMints(mintRecords);

       }
     } catch (error) {
      console.log(error);
       
     }
  }

  // This will run any time currentAccount or network are changed
  useEffect(() => {
    if (network === 'Polygon Mumbai Testnet') {
      fetchMints();
    }
  },[currentAccount, network]);
  

    const dashboard = () => {
        return(
        <div className="dashboard-container">
      <div className="container-contents">
        {/* <div className="dashboard-img">
          <img src="https://media4.giphy.com/media/R4UdL9xqUaOMZsRosx/giphy.gif?cid=ecf05e475mwvapr6qs9uz25po3vbtk4r89dd58x3szjzypop&rid=giphy.gif&ct=g"></img>
        </div> */}
        <div className="dashboard-content">
          <div class="input-group mb-3 input-area">
            <input
              type="text"
              class="form-control"
              placeholder="Enter Domain Name"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
              onChange={e => setDomain(e.target.value)}
            />
            <button
              class="btn btn-outline-secondary"
              type="button"
              id="button-addon2"
              onClick={null}
            >
              {tld}
            </button>
          </div>
          <div class="input-group mb-3 input-area">
            <input
              type="text"
              class="form-control"
              placeholder="Qualities that make you shine"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
              onChange={e => setRecord(e.target.value)}
            />
          </div>
          {
             editing ? (
               <div className="button-container">
                    <button type="button" class="btn btn-lg btn-primary" disabled = {loading} onClick={updateDomain}>Set Record</button>
                    <button type="button" class="btn btn-secondary btn-lg" onClick={() =>{setEditing(false)}}>cancel</button>
                 </div>
             ):(
            <button type="button" class="btn btn-primary btn-lg" disabled = {loading} onClick={mintDomain}>
              MINT
            </button>
             )
           }
        </div>
      </div>
    </div>
    );
    }

    const landing = () => {
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
        )
    }

    const render = () => {
      if(currentAccount) {
        return(
          dashboard()
        )
      } else {
        return(
          landing()
        )
      }
    }

   return (
    // <div>
    //     {!currentAccount && landing()}
    //     {currentAccount && dashboard()}
    // </div>
    <div>
    {render()}
    </div>
  )
}

export default LandingPage