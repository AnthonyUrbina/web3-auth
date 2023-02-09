import { SiweMessage } from 'siwe';
import { ethers } from 'ethers';
import jwtDecode from 'jwt-decode';

const $connectWalletBtn = document.querySelector('#connect-wallet-btn');
const $siweBtn = document.querySelector('#siwe-btn');
const $verifyBtn = document.querySelector('#verify-btn');
const $area51Btn = document.querySelector('#area51-btn');

$connectWalletBtn.addEventListener('click', connectWallet);
$siweBtn.addEventListener('click', signInWithEthereum);
$verifyBtn.addEventListener('click', sendForVerification);
$area51Btn.addEventListener('click', enterArea51);

const domain = window.location.host;
const origin = window.location.origin;
const provider = new ethers.providers.Web3Provider(window.ethereum);

const signer = provider.getSigner();

async function createSiweMessage(address, statement) {

  const res = await fetch('/nonce');
  let token = await res.json();

  window.localStorage.setItem('auth-jwt', token);
  token = window.localStorage.getItem('auth-jwt');

  const { nonce } = jwtDecode(token);
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

  const _token = await res.json();
  window.localStorage.setItem('siwe-jwt', _token);
}

async function enterArea51() {
  const _token = window.localStorage.getItem('siwe-jwt');
  const headers = {
    'Content-Type': 'application/json',
    'X-Access-Token': _token
  };
  const res = await fetch('/area51', { headers });
  const message = await res.json();
  // eslint-disable-next-line no-console
  console.log(message);
}
