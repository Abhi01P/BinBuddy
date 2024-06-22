const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static('public'));


app.post('/submit', (req, res) => {
  const { receiverName, contactName, mobileNumber, emailId, address, pinCode, city } = req.body;


  const mobilePattern = /^[6-9]\d{9}$/;
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;


  if (!mobilePattern.test(mobileNumber)) {
    return res.status(400).send('Invalid mobile number');
  }

  if (!emailPattern.test(emailId)) {
    return res.status(400).send('Invalid email address');
  }

  if (!receiverName || !mobileNumber || !emailId || !address || !pinCode || !city) {
    return res.status(400).send('All required fields must be filled out');
  }




  res.send('Form submitted successfully!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
