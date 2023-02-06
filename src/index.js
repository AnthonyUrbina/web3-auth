// import { SiweMessage } from 'siwe';
import { ethers } from 'ethers';

const $connectWalletBtn = document.querySelector('#connect-wallet-btn');
// const $siweBtn = document.querySelector('#siwe-btn');
// $connectWalletBtn.onClick = connectWallet;
// $siweBtn.onClick = signInWithEthereum;

$connectWalletBtn.addEventListener('click', connectWallet);
// $siweBtn.addEventListener('click', signInWithEthereum)

// const domain = window.location.host;
// const origin = window.location.origin;
const provider = new ethers.providers.Web3Provider(window.ethereum);
// const signer = provider.getSigner();

// function createSiweMessage(address, statement) {
//   const siweMessage = new SiweMessage({
//     domain,
//     address,
//     statement,
//     uri: origin,
//     version: '1',
//     chainId: '1'
//   });
//   return siweMessage.prepareMessage();
// }

function connectWallet() {
  provider.send('eth_requestAccounts', [])
    .catch(err => console.error(err));
}

// async function signInWithEthereum() {
//   const message = createSiweMessage(await signer.getAddress(),'Sign in with Ethereum to access App.');
//   console.log(await signer.signMessage(message))
// }

// console.log(createSiweMessage('0x07c233C36ac7103bDDD8fdebE9935fE871BF5474', 'Anthony wants you to sign in with your Ethereum account'));
