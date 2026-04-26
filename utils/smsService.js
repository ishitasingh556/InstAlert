const twilio = require('twilio');

const sendSMSAlert = async (contacts, message) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    // Check if twilio is configured
    if (!accountSid || !authToken || accountSid === 'your_twilio_sid') {
      console.log('Twilio is not configured. Mocking SMS send:');
      contacts.forEach(contact => {
        console.log(`To: ${contact.phoneNumber} - Message: ${message}`);
      });
      return { success: true, message: "Mock SMS sent" };
    }

    const client = twilio(accountSid, authToken);
    let errors = [];

    for (let contact of contacts) {
      try {
        await client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: contact.phoneNumber
        });
        console.log(`Sent alert to ${contact.phoneNumber}`);
      } catch (err) {
        console.error(`Error sending SMS to ${contact.phoneNumber}: ${err.message}`);
        errors.push(err.message);
      }
    }
    if (errors.length > 0) {
      return { success: false, message: errors.join('; ') };
    }
    return { success: true };
  } catch (error) {
    console.error(`Error sending SMS: ${error.message}`);
    return { success: false, message: error.message };
  }
};

module.exports = { sendSMSAlert };
