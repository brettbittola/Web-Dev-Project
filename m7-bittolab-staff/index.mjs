'use strict';

import 'dotenv/config';
import express from 'express';
import {products} from './products.js';
import pkg from 'nodemailer'; 

const {nodemailer} = pkg;
const PORT = process.env.PORT
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let htmlTop = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex,noarchive, nofollow" />
    <title>Brett Bittola</title>
    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <link rel='stylesheet' type='text/css' media='screen' href='main.css'>
    <script src='main.js'></script>
</head>
<body>
    <header><img src="android-chrome-192x192.png" alt="Brett Bittola" /><h1>Brett Bittola</h1></header> 
    <nav><a href="index.html">Home</a>
        <a href="contact.html">Contact</a>
        <a href="gallery.html">Gallery</a>
        <a href="order.html">Order</a>
        <a href="staff.html">Staff</a>
        </nav>
    <main>`;

let htmlBottom = `
</main>
<footer><p>&copy; 2024 Brett Bittola</p></footer>
</body>
</html>`;

app.post("/review", (req, res) => {
  const name = req.body.firstLast;
  const email = req.body.email;
  const checkbox = req.body.getInTouch;
  const radio = req.body.hiring;
  const select = req.body.dates;
  const textarea = req.body.companyDescription;

  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error('Failed to create a testing account. ' + err.message);
      return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass
      }
    });

    // Message object
    let message = {
      from: `${name} <${email}>`,
      to: 'Brett <brettbittola@gmail.com>',
      subject: 'bittolab Form Answers',
      text: `Hello, ${name}. We can respond to you at ${email}. You are hiring  ${radio}, and I can start ${select}. You also said ${checkbox}. 
      Your thoughts on your company are ${textarea}.`,
      html: `<body>
      <h3>Hello, <strong>${name}</strong></h3>.
      <h4>We can respond to you at <strong>${email}</strong>.</h4>
      <p>You are hiring <strong>${radio}</strong>, and I can start <strong>${select}</strong>. You also said <strong>${checkbox}</strong>. 
      Your thoughts on your company are <strong>${textarea}</strong>. </p>
      </body>`
    };

    res.send(`
${htmlTop}
<section><article>
  <h3>Hello, <strong>${name}</strong></h3>
  <h4>We can respond to you at <strong>${email}</strong>.</h4>
  <p><strong>${radio}</strong> you are hiring, and I can start <strong>${select}</strong>. You also said you <strong>${checkbox}</strong>. 
  Your thoughts on your company are <strong>${textarea}</strong>.</p>
  </article></section>
${htmlBottom}
`);

    console.log('Credentials obtained, sending message...');

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log('Error occurred. ' + err.message);
        return process.exit(1);
      }

      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  });
});

function chosenProduct(userPickedItem) {
  for (const productName of products) {
      if (productName.product === userPickedItem) {
          return productName;
      }
  }
}

app.post("/order", (req, res) => {
  const name = req.body.firstLast;
  const email = req.body.email;
  const mailing = req.body.address;
  const instructions = req.body.delivery;
  const product = chosenProduct(req.body.product);
  const quantity = req.body.quantity;
  const totalPrice = quantity * product.price;
  const totalPriceString = totalPrice.toLocaleString('en-US',{style: 'currency',currency: 'USD', minimumFractionDigits: 2})


  res.send(`
${htmlTop}
<section><article>
  <h3>Hello, <strong>${name}</strong>.</h3>
  <h4>Thank you for your order!</h4>
  <p>Your total was <strong>${totalPriceString}</strong>. A confirmation email has been sent to <strong>${email}</strong>. 
  Your order of <strong>${quantity} ${product.product}</strong> from <strong>${product.company}</strong> will arrive at <strong>${mailing}</strong> 
  in 3-5 business days. We will be sure to <strong>${instructions}</strong>.</p>
  </article></section>
${htmlBottom}
`);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
