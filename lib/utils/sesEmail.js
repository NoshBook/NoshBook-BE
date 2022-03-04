const AWS = require('aws-sdk');

const sesEmail = (content, subject) => {
  const SESConfig = {
    apiVersion: '2010-12-01',
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
    region: process.env.AWS_SES_REGION,
  };

  const params = {
    Source: 'diyana.amp@gmail.com',
    Destination: {
      ToAddresses: ['diyana.amp@pm.me', 'floyd841@gmail.com'],
    },
    ReplyToAddresses: ['diyana.amp@gmail.com'],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: content,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
  };

  new AWS.SES(SESConfig)
    .sendEmail(params)
    .promise()
    .then((res) => {
      console.log(`Sent ${content} to the council. Yay! AWS response: ${res}`);
    });
};

module.exports = { sesEmail };
