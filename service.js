//const watson = require('watson-developer-cloud');
const AssistantV1 = require('ibm-watson/assistant/v1');


const assistant = new AssistantV1({
  username: process.env.WATSON_USERNAME,
  password: process.env.WATSON_PASSWORD,
  url:      process.env.WATSON_URL,
  version:  process.env.WATSON_VERSION
});

exports.getMessage = (body) =>
  new Promise((resolve, reject) => {
    console.log("message by user ",body.input)
    assistant.message(
      {
        workspace_id: process.env.WATSON_WORKSPACE_ID,
        input: { text: body.input }
      },
      function(err, response) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(response);
          console.log("response by Bot: ",response.output.text)
        }
      }
    );
  });