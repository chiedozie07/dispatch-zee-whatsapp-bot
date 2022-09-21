

const express = require('express');
const body_parser = require("body-parser")
const axios = require("axios");
const app  = express().use(body_parser.json());
const port = 5000;


app.get('/', (req, res) => {
    res.send('Hello Dispatchz!');
});
const token = process.env.TOKEN;

//get req
app.get('/webhooks',  (req, res) => {
   const verify_Token =  process.env.TOKEN
   let mode = req.query["hub.mode"]
   let token = req.query["hub.verif_Token"]
   let challenge = req.query["hub.challenge"]
   if(mode && token){
    if(mode === "subscribe" && token === verify_Token){
        console.log("success");
        res.status(200).send(challenge)
    }
    res.sendStatus(403)
   }
   else{res.sendStatus(403)}
   });

//post req
app.post('/webhooks',  (req, res) => {
    const body = req.body;
   
    if(req.body.object) {
        axios({
            method: "POST",
            url: "https://graph.facebook.com/v14.0/109807498550130/messages", token
        })
    }
    else{
        console.log(body);
        res.sendStatus(403)
    }
 });


app.listen(port, () => console.log(`Dispatch-zee whatsapp-bot Server is runing on port http://localhost:${port}`));




