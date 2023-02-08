/* eslint-disable no-console */
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('node:path');
const publicPath = path.join(__dirname, 'dist');
const staticMiddleware = express.static(publicPath);
const jwt = require('jsonwebtoken');
const siwe = require('siwe');
app.use(staticMiddleware);
app.use(express.json());

const secret = 'swag';

app.get('/nonce', async (req, res) => {
  const nonce = siwe.generateNonce();
  console.log('nonce:', nonce);
  const token = jwt.sign({ nonce }, secret);
  console.log('token', token);
  res.status(200).json(token);
});

const { SiweMessage } = siwe;

app.post('/verify', async (req, res) => {
  const { message, signature } = req.body;
  console.log('message', message);
  const siweMessage = new SiweMessage(message);
  try {
    const fields = await siweMessage.validate(signature);
    console.log('fields', fields);
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
