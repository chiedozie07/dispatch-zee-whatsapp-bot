const express = require('express');
const router = express.Router();

const serverless = require('serverless-http')
const app = express()

const token = process.env.TOKEN;

app.get('/', (req, res) => {
    res.send('Hello Dispatchz!')
});

app.get('/webhooks',  (req, res) => {
  if (req.query['hub.mode'] == 'subscribe' && req.query['hub.verify_token'] == token) {
      console.log('REQUEST LOG ===>', req);
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
 });
 
module.exports.handler = serverless(app);