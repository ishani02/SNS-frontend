import React, { useEffect, useState } from "react"
import "../styles/LandingPage.css";
import "../styles/NavBar.css";
import "../styles/Dashboard.css";
import { ethers } from "ethers";
import contractABI from "../utils/contractABI.json";
import Typewriter from 'typewriter-effect';
import { networks } from '../utils/networks';
import { Element } from "react-scroll";
import Dashboard from "./Dashboard";
import { networkInterfaces } from "os-browserify";
const Web3 = require("web3");
const tld = ".shine";
const CONTRACT_ADDRESS = "0x2db04e565C99E944a4BF534d2bD44B87aA898A37";

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
        ethereum.on('chainChanged', handleChainChanged);
        
        // if(network !== "Polygon Mumbai Testnet") {
        //   alert("Switch To polygon");
        //   return;
        // }
        function handleChainChanged(_chainId) {
          window.location.reload();
        }
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS,contractABI.abi, signer);
        let price = domain.length == 3 ? '0.5' : domain.length == 4 ? '0.3' : '0.1';
        console.log("Minting your domain",domain, "at price: ", price);

       let txn = await contract.register(domain, {value: ethers.utils.parseEther(price)}); // calls contract's method =>  metamask pops up
       const receipt = await txn.wait(); // waits for the transaction to be mined

       if(receipt.status == 1) {
         console.log("Domain minted successfully!!");
         console.log("https://mumbai.polygonscan.com/tx/"+txn.hash);
         console.log(txn.hash);
       }
       txn = await contract.attachDataToDomain(domain, record);
       await txn.wait();
         console.log("Record set successfully at https://mumbai.polygonscan.com/tx/"+txn.hash);

        // Call fetchMints after 2 seconds
        setTimeout(() => {
          fetchMints();
        }, 1000);
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

    const recordField = document.querySelector(".record-input");
    setLoading(true);
    console.log("Updating domain", domain, "with record", record);
      try {
        const {ethereum} = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
  
        let tx = await contract.attachDataToDomain(domain.split(".")[0], record);
        await tx.wait();
        console.log("Record set https://mumbai.polygonscan.com/tx/"+tx.hash);
  
        fetchMints();
        renderMints();
        setRecord('');
        setDomain('');
      }
      } catch(error) {
        console.log(error);
      }
    setLoading(false);
    setEditing(false);
    recordField.value = "";
  }

  const fetchMints = async() => {
     try {
       if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

        const names = await contract.getAllNames();

        const mintRecords = await Promise.all(names.map(async(name) => {
          //console.log(name)
          let name1 = name.split(".")[0];
          console.log(name)
          //const mintRecord = await contract.getData(name);
          const mintRecord = await contract.records(name1);
          console.log(mintRecord);
          const owner = await contract.domains(name1);
          //console.log(owner);
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
    if (network == 'Polygon Mumbai Testnet') {
      fetchMints();
      renderMints();
    }
  },[currentAccount, network]);
  
    // Add this render function next to your other render functions
const renderMints = () => {
  if (currentAccount && mints.length > 0) {
    return (
      <div className="mint-container">
        <p className="subtitle">Recently minted domains!</p>
        <div className="mint-list">
          { mints.map((mint, index) => {
            return (
              <div className="mint-item" key={index}>
                <div className='mint-row'>
                  <a className="link" href={`https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${mint.id}`} target="_blank" rel="noopener noreferrer">
                    <p className="underlined">{' '}{mint.name}{' '}</p>
                  </a>
                  {/* If mint.owner is currentAccount, add an "edit" button*/}
                  { mint.owner.toLowerCase() == currentAccount.toLowerCase() ?
                    <button className="edit-button" onClick={() => editRecord(mint.name)}>
                      <img className="edit-icon" src="https://img.icons8.com/metro/26/000000/pencil.png" alt="Edit button"/>
                      </button>
                    :
                    null
                  }
                </div>
          <p className="record"> {mint.record} </p>
        </div>
        )
        })}
      </div>
    </div>
    );
  }
};

// This will take us into edit mode and show us the edit buttons!
const editRecord = (name) => {
  console.log("Editing record for", name);
  setEditing(true);
  setDomain(name);
}
    const dashboard = () => {
        return(
        <div className="dashboard-container">
      <div className="container-contents">
        {/* <div className="dashboard-img">
          <img src="https://media4.giphy.com/media/R4UdL9xqUaOMZsRosx/giphy.gif?cid=ecf05e475mwvapr6qs9uz25po3vbtk4r89dd58x3szjzypop&rid=giphy.gif&ct=g"></img>
        </div> */}
        <div className="dashboard-content">
            {!editing ?
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
            : 
            null
           }
          <div class="input-group mb-3 input-area">
            <input
              type="text"
              class="form-control record-input"
              placeholder="Qualities that make you shine"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
              onChange={e => setRecord(e.target.value)}
            />
          </div>
          {
             editing ? (
               <div className="button-container">
                    <button type="button" class="btn btn-lg btn-primary"  disabled={loading} onClick={updateDomain}>Set Record</button>
                    <button type="button" class="btn btn-secondary btn-lg" onClick={() =>{setEditing(false)}}>Cancel</button>
                 </div>
             ):(
            <button type="button" class="btn btn-primary btn-lg" onClick = {mintDomain}>
              MINT
            </button>
             )
           }
        </div>
        <div className="recently-minted"> {mints && renderMints()}</div>
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

   return (
    <div>
        {!currentAccount && landing()}
        {currentAccount && dashboard()}
    </div>
  )
}

export default LandingPage