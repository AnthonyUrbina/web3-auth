const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('node:path');
const publicPath = path.join(__dirname, 'dist');
const staticMiddleware = express.static(publicPath);
// const siwe = require('siwe');
app.use(staticMiddleware);

// const domain = 'localhost';
// const origin = 'https://localhost:5500/login';

// function createSiweMessage(address, statement) {
//   const siweMessage = new siwe.SiweMessage({
//     domain,
//     address,
//     statement,
//     uri: origin,
//     version: '1',
//     chainId: '1'
//   });
//   return siweMessage.prepareMessage();
// }

// console.log(createSiweMessage('0x07c233C36ac7103bDDD8fdebE9935fE871BF5474', 'Anthony wants you to sign in with your Ethereum account'));

server.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('listening on port 3000');
});
