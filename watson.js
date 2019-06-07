const AssistantV2 = require('ibm-watson/assistant/v2');

const service = new AssistantV2({
  iam_apikey: '{apikey}',
  version: '2019-02-28',
  url: '{url}'
});

service.message({
  assistant_id: '{assistant_id}',
  session_id: '{session_id}',
  input: {
    'message_type': 'text',
    'text': 'Hello'
    }
  })
  .then(res => {
    console.log(JSON.stringify(res, null, 2));
  })
  .catch(err => {
    console.log(err);
  });