

const express = require('express');
const body_parser = require("body-parser")
const axios = require("axios");
const app = express().use(body_parser.json());
const port = 5000;


app.get('/', (req, res) => {
    res.send('Welcome To Dispatch-Zee Global Ltd!');
});
process.env.TOKEN = '';

//get req
app.get('/webhooks', (req, res) => {
    try {
        if (req.query["hub.mode"] !== "subscribe") throw Error("Invalid Mode")
        if (!req.query["hub.challenge"]) throw Error("Challenge does not exist")
        if (req.query["hub.verify_token"] !== process.env.TOKEN) throw Error("Invalid token passed")
        res.status(200).send(req.query["hub.challenge"]);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});
// https://d8ce-102-67-16-7.ngrok.io
//post req
app.post('/webhooks', async (req, res) => {
    console.log('TOKEN ===>', process.env.ACCESS_TOKEN);
    try {
        // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
        if (req.body.object) {

          if (
            req.body.entry &&
            req.body.entry[0].changes &&
            req.body.entry[0].changes[0] &&
            req.body.entry[0].changes[0].value.messages &&
            req.body.entry[0].changes[0].value.messages[0]
          ) {
            let phone_number_id =
              req.body.entry[0].changes[0].value.metadata.phone_number_id;
            let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
            let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
            //response with the user's message content
            const response = await axios.post(" https://graph.facebook.com/v15.0/" + phone_number_id + "/messages?access_token=" + process.env.TOKEN,
              { messaging_product: "whatsapp", to: from, text: { body: "Ack: " + msg_body } },
              { headers: {  "Content-Type": "application/json" } }
              )
              console.log("response", response.data)
            console.log("MG: =>", req.body.entry[0].changes);
          }
          res.sendStatus(200);
        } else {
          // Return a '404 Not Found' if event is not from a WhatsApp API
          res.sendStatus(404);
        }
      } catch (error) {
        console.log("ERR =>", error.message);
        return res.status(500).json({
          message: error.message,
        });
      }
});


app.listen(port, () => console.log(`Dispatch-zee whatsapp-bot Server is runing on port http://localhost:${port}`));




