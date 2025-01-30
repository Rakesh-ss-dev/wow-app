const VONAGE_APPLICATION_ID = 'JOi1wx4bFTiBq17l';
const VONAGE_PRIVATE_KEY = 'ISQipRExh3kEp1eLwJRhH1rKhj8OwJcXAwOK23T0tADSd5kWdo';

const TO_NUMBER = '919000114555';
const WHATSAPP_NUMBER = '917337244686';

const { Vonage } = require('@vonage/server-sdk');
const { WhatsAppText } = require('@vonage/messages');

const vonage = new Vonage({
  applicationId: VONAGE_APPLICATION_ID,
  privateKey: VONAGE_PRIVATE_KEY,
});

vonage.messages.send(
  new WhatsAppText({
    text: 'This is a WhatsApp Message text message sent using the Messages API',
    to: TO_NUMBER,
    from: WHATSAPP_NUMBER,
  }),
)
  .then((resp) => console.log(resp.messageUUID))
  .catch((error) => console.error(error));