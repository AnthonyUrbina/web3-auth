const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('node:path');
const publicPath = path.join(__dirname, 'dist');
const staticMiddleware = express.static(publicPath);
const siwe = require('siwe');
app.use(staticMiddleware);
app.use(express.json());
app.get('/nonce', function (req, res) {
  const nonce = siwe.generateNonce();
  res.setHeader('Content-Type', 'text/plain');
  res.send(nonce);
});
const { SiweMessage } = siwe;
app.post('/verify', async function (req, res) {
  const { message, signature } = req.body;
  const siweMessage = new SiweMessage(message);
  try {
    await siweMessage.validate(signature);
    res.send(true);
  } catch (err) {
    console.error(err);
    res.send(false);
  }
});

server.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('listening on port 3000');
});
