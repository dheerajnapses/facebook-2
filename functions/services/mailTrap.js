const { MailtrapClient } = require("mailtrap");
 

const sendEmail = async (to, subject, text) => {
  const client = new MailtrapClient({ token: '48d18e4ab2e75ee9f0fae65f0bae2aea' ,timeout: 20000  });

  const sender = {
    email: "dheeraj700agrahari@gmail.com",
    name: "Facebook",
  };

  try {
    await client.send({
      from: sender,
      to: [{ email: to }],
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};

module.exports = sendEmail;
