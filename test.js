const _ = require("lodash");
const axios = require("axios").default

exports.listen = async (req, res, next) => {
  try {
    // Parse the request body from the POST
    let body = req.body;

    // Check the Incoming webhook message
    console.log(JSON.stringify(req.body, null, 2));

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
        const response = await axios.post("https://graph.facebook.com/v15.0/" + phone_number_id + "/messages?access_token=" + process.env.WA_VERIF_TOKEN,
          { messaging_product: "whatsapp", to: from, text: { body: "Ack: " + msg_body } },
          { headers: {  "Content-Type": "application/json" } })
          console.log("response", response.data)
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
};

exports.subscribe = (req, res, next) => {
  try {
    if (req.query["hub.mode"] !== "subscribe") throw Error("Invalid Mode")
    if (!req.query["hub.challenge"]) throw Error("Challenge does not exist")
    if (req.query["hub.verify_token"] !== process.env.WA_VERIF_TOKEN) throw Error("Invalid token passed")
    res.status(200).send(req.query["hub.challenge"]);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
