import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [numNFTs, setNumNFTs] = useState(1);
  const [status, setStatus] = useState('');
  const [totalSupply, setTotalSupply] = useState(null);


  const contractAddress = '0x12f0CB0759B18f3960EC79eEe51e3DaF1e65047C'; // Replace with the actual contract address
  const abi = ['function totalSupply() view returns (uint256)']; // Make sure the ABI includes the totalSupply function
  const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = web3Provider.getSigner();
  const contract = new ethers.Contract(contractAddress,abi, signer,);
  const contractmint = new ethers.Contract(contractAddress, ['function mint(uint256) external payable'], signer);
  


  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      setProvider(web3Provider);
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
      });
    }
  }, []);

  const connectMetamask = async () => {
    if (typeof window.ethereum === 'undefined') {
      window.open('https://metamask.io/', '_blank');
      setStatus('Please install MetaMask to use this application.');
      return;
    }
  
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(window.ethereum.selectedAddress);
    } catch (error) {
      console.error(error);
      setStatus(`Error: ${error.message}`);
    }
  };

  const fetchTotalSupply = async () => {
    try {
      // Call the totalSupply function
      const supply = await contract.totalSupply();
      // Set the total supply in the state
      setTotalSupply(supply.toString());
    } catch (error) {
      console.error('Error fetching total supply:', error);
    }
  };

  const mintNFT = async () => {
    if (!numNFTs || numNFTs <= 0) {
      setStatus('Please specify a valid number of NFTs to mint.');
      return;
    }
  
    // Calculate the total value in Wei
    const totalValueWei = ethers.utils.parseEther((numNFTs * 0.0005).toString());
  
    try {
      
      // Check if the total value exceeds the maximum safe integer value
      if (totalValueWei.gt(ethers.constants.MaxUint256)) {
        setStatus('Total value exceeds the maximum allowed value.');
        return;
      }
  
      // Mint multiple NFTs
      const tx = await contractmint.mint(numNFTs, { value: totalValueWei });
      setStatus(`Minting ${numNFTs} NFT(s)... Transaction Hash: ${tx.hash}`);
    } catch (error) {
      console.error(error);
      setStatus(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    if (provider) {
      fetchTotalSupply(); // Fetch total supply when provider is available
    }
  }, [provider]);

  return (
    <div className="App">
      <h1>NFT Minting App</h1>
      {account ? (
        <div>
          <p>Connected Account: {account}</p>
        </div>
      ) : (
        <div>
          <button onClick={connectMetamask}>Connect Metamask Wallet</button>
        </div>
      )}

      {account && (
        <div>
          <h2>Mint NFTs</h2>
          <p>Specify the number of NFTs to mint:</p>
          <input
            type="number"
            name='form_value'
            min="1"
            max="20"
            value={numNFTs}
            onChange={(e) => setNumNFTs(parseInt(e.target.value))}
          />
          <button onClick={mintNFT}>Mint NFT(s)</button>
          <p>Status: {status}</p>
        </div>
      )}

      {totalSupply !== null && (
        <div>
          <h2>Total Supply of NFTs</h2>
          <p>{totalSupply} NFTs out of 1000 NFTs</p>
        </div>
      )}
    </div>
  );
}

export default App;




