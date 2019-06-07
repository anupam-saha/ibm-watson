require('dotenv').config();
const express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var myObject = {};
var response;
const bodyParser = require('body-parser'),
    DEFAULT_BODY_SIZE_LIMIT = 1024 * 1024 * 10,
    DEFAULT_PARAMETER_LIMIT = 10000;

const bodyParserJsonConfig = () => ({
    parameterLimit: DEFAULT_PARAMETER_LIMIT,
    limit: DEFAULT_BODY_SIZE_LIMIT
});

//const app = express();
const controller = require('./controller');

const AssistantV1 = require('ibm-watson/assistant/v1');

const assistant = new AssistantV1({
    username: process.env.WATSON_USERNAME,
    password: process.env.WATSON_PASSWORD,
    url: process.env.WATSON_URL,
    version: process.env.WATSON_VERSION
});


app.use(bodyParser.json(bodyParserJsonConfig()));

var output
var texts
let context = {}

// io.on('connection', function(socket) {
//     socket.on('chat message', async function(msg) {
//     io.emit('chat message', msg);

//         myObject = { "input": msg }
//         response = await controller.ask(myObject)
//         console.log("response::", response.output.text)
//         io.emit('send message', response.output.text) 


//     });
// });

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});



app.post('/watson', async function(req, res) {

    const input = req.body.request.intent ? req.body.request.intent.slots.EveryThingSlot.value : 'Start';

    console.log('Intent', req.body.request.intent, '\n')
    console.log('Input', input, '\n')
    console.log('Context', context, '\n')
    
    var response = await assistant.message({
        workspace_id: process.env.WATSON_WORKSPACE_ID,
        input: { text: input },
        context: context
    })

    texts = response.output.text
    output = texts.join(' ')
    console.log("response by Bot: ", output)
    context = response.context
    var responseToAlexa = {
        "version": "1.0",
        "response": {
            "outputSpeech": {
                "type": "SSML",
                "ssml": `<speak>${output}</speak>`
            },
            "shouldEndSession": false,
            "type": "_DEFAULT_RESPONSE"
        },
        "sessionAttributes": {
            "locale": "en-GB"
        },
        "userAgent": "ask-node/2.0.7 Node/v8.10.0"
    }

    console.log('Response to Alexa', responseToAlexa,'\n\n\n')
    res.send(responseToAlexa)
});





http.listen(3000, function() {
    console.log('listening on *:3000');
});