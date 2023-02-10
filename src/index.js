import { SiweMessage } from 'siwe';
import { ethers } from 'ethers';
import jwtDecode from 'jwt-decode';

const $connectWalletBtn = document.querySelector('#connect-wallet-btn');
const $area51Btn = document.querySelector('#area51-btn');
const $header = document.querySelector('#header');
const $siweBtn = document.createElement('button');
const $area51Txt = document.createElement('p');
const $area51Img = document.createElement('img');

const $area51Container = document.querySelector('.area51-container');

$siweBtn.addEventListener('click', signInWithEthereum);
$connectWalletBtn.addEventListener('click', connectWallet);
$area51Btn.addEventListener('click', enterArea51);

$siweBtn.textContent = 'Sign In';
$siweBtn.id = 'siwe-btn';
$area51Img.id = 'area51-img';

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

function changeButton(event, address) {
  if (event.target.id === 'connect-wallet-btn') {
    $connectWalletBtn.remove();
    $header.appendChild($siweBtn);
  }

  if (event.target.id === 'siwe-btn') {
    $siweBtn.remove();
    const $signOut = document.createElement('button');
    $signOut.textContent = address;
    $signOut.id = 'siwe-btn';
    $header.appendChild($signOut);
  }
}

function connectWallet(event) {
  provider.send('eth_requestAccounts', [])
    .then(address => {
      if (!address.error) {
        changeButton(event);
      }
    })
    .catch(err => console.error('err swagg', err));
}

let signature;
let message;

async function signInWithEthereum(event) {
  try {
    const address = await signer.getAddress();
    message = await createSiweMessage(address, 'Sign in with Ethereum to access App.');
    signature = await signer.signMessage(message);
    changeButton(event, address);
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
  try {
    await sendForVerification();
    const _token = window.localStorage.getItem('siwe-jwt');
    const headers = {
      'Content-Type': 'application/json',
      'X-Access-Token': _token
    };
    const res = await fetch('/area51', { headers });
    await res.json();

    $area51Img.src = 'alien.gif';
    $area51Container.appendChild($area51Img);
    $area51Txt.textContent = 'Access Granted!';
    $area51Txt.style.color = 'green';
    $area51Container.appendChild($area51Txt);
    $area51Img.src = 'alien.gif';
    $header.appendChild($area51Img);
  } catch (err) {
    console.error(err);
    $area51Txt.textContent = 'Access Denied!';
    $area51Txt.className = 'red';
    $area51Container.appendChild($area51Txt);
  }
}
