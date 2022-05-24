import React from "react";
import "../styles/Dashboard.css";
import { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../utils/contractABI.json";
const Web3 = require("web3");
const tld = ".shine";

function Dashboard() {
  const {ethereum} = window;
  // const checkWalletConnected = async () => {
  //   try {
  //     const accounts = await ethereum.request({method: 'eth_accounts'});

  //     if(accounts.length == 0) {
  //       alert("Connect your wallet first");
  //        return;  
  //     } 
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  const [domain, setDomain] = useState('');
  const [record, setRecord] = useState('');

  const mintDomain = async() => {
    if(!domain) return;
    if(domain.length < 3) {
      alert("Domain name too short");
      return;
    }
    try {
      const {ethereum} = window;
      if(ethereum) {
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
         setDomain('');
         setRecord('');
 
      } else {
        alert("Transaction failed!! Please Try again");
      }
      
    } catch (error) {
      console.log(error);
      
    }

  }
  
  return (
    <div className="dashboard-container">
      <div className="container-contents">
        <div className="dashboard-img">
          <img src="https://media4.giphy.com/media/R4UdL9xqUaOMZsRosx/giphy.gif?cid=ecf05e475mwvapr6qs9uz25po3vbtk4r89dd58x3szjzypop&rid=giphy.gif&ct=g"></img>
        </div>
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
          <button type="button" class="btn btn-primary btn-lg" onClick={mintDomain}>
            MINT
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
