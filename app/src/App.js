import React, {useEffect, useState} from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import CandyMachine from './CandyMachine';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [hasSolana, setHasSolana] = useState(false)
  const [walletAddress, setWalletAddress] = useState(null);
  const [appLoading, setAppLoading] = useState(false);

  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
  useEffect(() => {
    const onLoad = async () => {
      setAppLoading(true)
      await checkIfWalletIsConnected();
      setAppLoading(false)
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  const handleError = (e) => {
      console.log('Error:', e);
      if (e.code === 4001 && e.message === 'User rejected the request.')
        window.alert('An error occured. Make sure to login to Phantom.');
    };

  const checkIfWalletIsConnected = async () => {
    await checkIfPhantomIsConnected()
  }
  
  const checkIfPhantomIsConnected = async () => {
      try {
        await connectToPhantomWallet();
      } catch (e) {
        handleError(e);
      }
    };

  const connectToPhantomWallet = async () => {
      try {
        const { solana } = window;

        if (solana) {
          setHasSolana(true)
          if (solana.isPhantom) {
            const response = await window.solana.connect({ onlyIfTrusted: true });
            setWalletAddress(true)
            console.log('Connected with public key: ' + response.publicKey.toString())  
          } else {
          }
        }
        else {
          setHasSolana(false)
        }
      } catch (e) {
        handleError(e);
      }
    };
 

  /*
   * Let's define this method so our code doesn't break.
   * We will write the logic for this next!
   */
  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };
  /*
   * We want to render this UI when the user hasn't connected
   * their wallet to our app yet.
   */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">NFT drop machine with fair mint</p>

          {/* Add the condition to show this only if we don't have a wallet address */}
          {!appLoading && !walletAddress && renderNotConnectedContainer()}
        </div>

        {
          !appLoading && hasSolana && ! walletAddress && 
          <p>
          Should have a way to open the phantom wallet programmetically.
          </p>
        }
        
        {
          !appLoading && !hasSolana && 
          <p>
          You need to install the Phantom wallet to have fun here. <a  rel='noreferrer' target='_blank' href='https://phantom.app/'>Download the Phantom wallet</a>
          </p>
        }
        

        {/* Check for walletAddress and then pass in walletAddress */}
        {walletAddress && <CandyMachine walletAddress={window.solana} />}

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;