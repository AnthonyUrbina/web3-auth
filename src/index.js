/* eslint-disable no-console */
import { SiweMessage } from 'siwe';
import { ethers } from 'ethers';
import jwtDecode from 'jwt-decode';

const $connectWalletBtn = document.querySelector('#connect-wallet-btn');
const $siweBtn = document.querySelector('#siwe-btn');
const $verifyBtn = document.querySelector('#verify-btn');

$connectWalletBtn.addEventListener('click', connectWallet);
$siweBtn.addEventListener('click', signInWithEthereum);
$verifyBtn.addEventListener('click', sendForVerification);

const domain = window.location.host;
const origin = window.location.origin;
const provider = new ethers.providers.Web3Provider(window.ethereum);

const signer = provider.getSigner();

async function createSiweMessage(address, statement) {
  // fetch('/nonce')
  //   .then(res => res.json())
  //   .then(token => {

  //   })
  //   .catch(err => console.error(err.message));

  const res = await fetch('/nonce');
  let token = await res.json();

  console.log('res:', token);

  window.localStorage.setItem('auth-jwt', token);
  token = window.localStorage.getItem('auth-jwt');
  console.log('token', token);

  const { nonce } = jwtDecode(token);
  console.log('nonce', nonce);
  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: '1',
    chainId: '1',
    nonce
  });
  return message.prepareMessage();
  // window.localStorage.setItem('auth-jwt', token);

}

function connectWallet() {
  provider.send('eth_requestAccounts', [])
    // eslint-disable-next-line no-console
    .then(address => console.log(address))
    .catch(err => console.error('err swagg', err));
}

let signature;
let message;

async function signInWithEthereum() {
  try {
    const address = await signer.getAddress();
    message = await createSiweMessage(address, 'Sign in with Ethereum to access App.');
    signature = await signer.signMessage(message);

  } catch (err) {
    console.error(err);
  }
}

async function sendForVerification() {
  const token = window.localStorage.getItem('auth-jwt');

  const headers = {
    'Content-Type': 'application/json',
    'X-Access-Token': token
  };

  const res = await fetch('/verify', {
    method: 'POST',
    headers,
    body: JSON.stringify({ message, signature })
  });
  // eslint-disable-next-line no-console
  const _token = await res.json();
  console.log('_token', _token);
}

// console.log(createSiweMessage('0x07c233C36ac7103bDDD8fdebE9935fE871BF5474', 'Anthony wants you to sign in with your Ethereum account'));
