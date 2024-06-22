const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;


const user = {
  email: 'user@example.com',
  password: 'password123'
};


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

s
app.use(express.static('public'));


app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === user.email && password === user.password) {

    return res.redirect('/h-o-m-e.html');
  } else {
    return res.status(401).send('Invalid email or password');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
