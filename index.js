const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('node:path');
const publicPath = path.join(__dirname, 'dist');
const staticMiddleware = express.static(publicPath);
const jwt = require('jsonwebtoken');
const siwe = require('siwe');
const secret = 'swag';
const authorizationMiddleware = require('./authorization-middleware');
const jsonMiddleware = express.json();
app.use(staticMiddleware);
app.use(jsonMiddleware);

app.get('/nonce', async (req, res) => {
  const nonce = siwe.generateNonce();
  const token = jwt.sign({ nonce }, secret);
  res.status(200).json(token);
});

const { SiweMessage } = siwe;

app.use(authorizationMiddleware);

app.post('/verify', async (req, res) => {
  const token = req.headers['x-access-token'];
  const payload = jwt.verify(token, secret);

  const { message, signature } = req.body;
  const siweMessage = new SiweMessage(message);
  try {
    const fields = await siweMessage.validate(signature);

    if (payload.nonce !== fields.nonce) {
      res.status(400).json('invalid nonce');
      return;
    }
    const _token = jwt.sign({ fields }, secret);
    res.status(200).json(_token);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

app.get('/area51', (req, res) => {
  res.status(200).json('user is authorized');
});

server.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('listening on port 3000');
});
