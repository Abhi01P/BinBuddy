const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Binbuddy')));

mongoose.connect('mongodb://localhost:27017/binbuddy')
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true }, // 'student', 'mess', or 'ngo'
    profile: { type: mongoose.Schema.Types.Mixed, required: true } // Store user-specific profile data
});

const User = mongoose.model('User', userSchema);

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: { type: String, required: true },
    course: { type: String, required: true },
    hostel: { type: String, required: true },
    mess: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
});

const messSchema = new mongoose.Schema({
    name: { type: String, required: true },
    hostel: { type: String, required: true },
    mess: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
});

const ngoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    pinCode: { type: String, required: true },
    city: { type: String, required: true }
});

const Student = mongoose.model('Student', studentSchema);
const Mess = mongoose.model('Mess', messSchema);
const Ngo = mongoose.model('Ngo', ngoSchema);

app.post('/submit', async (req, res) => {
    try {
        const { name, gender, course, hostel, mess, email, phone, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
            role: 'student',
            profile: { name, gender, course, hostel, mess, phone }
        });

        const newStudent = new Student({
            name,
            gender,
            course,
            hostel,
            mess,
            email,
            phone
        });

        await Promise.all([newUser.save(), newStudent.save()]);
        res.status(200).send('Form submitted successfully!');
    } catch (err) {
        console.error('Error saving form data:', err);
        res.status(400).send('Error submitting form: ' + err.message);
    }
});

app.post('/submit-mess', async (req, res) => {
    try {
        const { name, hostel, mess, email, phone, address, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
            role: 'mess',
            profile: { name, hostel, mess, phone, address }
        });

        const newMess = new Mess({
            name,
            hostel,
            mess,
            email,
            phone,
            address
        });

        await Promise.all([newUser.save(), newMess.save()]);
        res.status(200).send('Form submitted successfully!');
    } catch (err) {
        console.error('Error saving form data:', err);
        res.status(400).send('Error submitting form: ' + err.message);
    }
});

app.post('/submit-ngo', async (req, res) => {
    try {
        const { name, phone, email, address, pinCode, city, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email: email,
            password: hashedPassword,
            role: 'ngo',
            profile: { name, phone, address, pinCode, city }
        });

        const newNgo = new Ngo({
            name,
            phone,
            email, 
            address, 
            pinCode, 
            city
        });

        await Promise.all([newUser.save(), newNgo.save()]);
        res.status(200).send('Form submitted successfully!');
    } catch (err) {
        console.error('Error saving form data:', err);
        res.status(400).send('Error submitting form: ' + err.message);
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            res.json({ success: true, role: user.role });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/api/getFormData', async (req, res) => {
    try {
        const type = req.query.type; // 'student', 'mess', or 'ngo'

        if (!type || (type !== 'student' && type !== 'mess' && type !== 'ngo')) {
            return res.status(400).send('Invalid type parameter. Use "student", "mess", or "ngo".');
        }

        let data;
        if (type === 'student') {
            data = await Student.findOne().sort({ _id: -1 }).exec();
        } else if (type === 'mess') {
            data = await Mess.findOne().sort({ _id: -1 }).exec();
        } else if (type === 'ngo') {
            data = await NGO.findOne().sort({ _id: -1 }).exec();
        }

        if (!data) {
            return res.status(404).send(`No form data found for type ${type}`);
        }

        res.json(data);
    } catch (err) {
        console.error('Error retrieving form data:', err);
        res.status(500).send('Error retrieving form data: ' + err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// const express = require('express');
// const bodyParser = require('body-parser');
// const nodemailer = require('nodemailer');
// const twilio = require('twilio');

// const app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// const accountSid = 'your_twilio_account_sid';
// const authToken = 'your_twilio_auth_token';
// const client = twilio(accountSid, authToken);

// let otpStore = {};

// app.post('/submit', (req, res) => {
//     const { email, phone } = req.body;

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     otpStore[email] = otp;
//     otpStore[phone] = otp;

//     // Send OTP via email
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: 'your_email@gmail.com',
//             pass: 'your_email_password'
//         }
//     });

//     const mailOptions = {
//         from: 'your_email@gmail.com',
//         to: email,
//         subject: 'Your OTP Code',
//         text: `Your OTP code is ${otp}`
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return res.status(500).send(error.toString());
//         }
//     });

//     // Send OTP via SMS
//     client.messages
//         .create({
//             body: `Your OTP code is ${otp}`,
//             from: '+1234567890', // your Twilio number
//             to: phone
//         })
//         .then(message => console.log(message.sid))
//         .catch(error => console.log(error));

//     res.status(200).send('OTP sent');
// });

// app.post('/verify', (req, res) => {
//     const { email, phone, otp } = req.body;

//     if (otpStore[email] === otp && otpStore[phone] === otp) {
//         delete otpStore[email];
//         delete otpStore[phone];
//         res.status(200).send('OTP verified');
//     } else {
//         res.status(400).send('Invalid OTP');
//     }
// });

// app.listen(3000, () => {
//     console.log('Server running on port 3000');
// });

