const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Binbuddy')));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

mongoose.connect('mongodb+srv://user100:Abhinav01@cluster0.epnrunh.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0')
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
    phone: { type: String, required: true },
    virtualCredits: { type: Number, default: 0 }
});

const messSchema = new mongoose.Schema({
    name: { type: String, required: true },
    hostel: { type: String, required: true },
    mess: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    upiId: { type: String, required: true },
    mealCost: { type: Number, required: true }
});

const ngoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    pinCode: { type: String, required: true },
    city: { type: String, required: true }
});

const menuSchema = new mongoose.Schema({
    messId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mess', required: true },
    days: {
        monday: { breakfast: String, lunch: String, dinner: String },
        tuesday: { breakfast: String, lunch: String, dinner: String },
        wednesday: { breakfast: String, lunch: String, dinner: String },
        thursday: { breakfast: String, lunch: String, dinner: String },
        friday: { breakfast: String, lunch: String, dinner: String },
        saturday: { breakfast: String, lunch: String, dinner: String },
        sunday: { breakfast: String, lunch: String, dinner: String }
    }
});

const timingSchema = new mongoose.Schema({
    messId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mess', required: true },
    days: {
        monday: {
            breakfastStart: { type: String, required: true },
            breakfastEnd: { type: String, required: true },
            lunchStart: { type: String, required: true },
            lunchEnd: { type: String, required: true },
            dinnerStart: { type: String, required: true },
            dinnerEnd: { type: String, required: true }
        },
        tuesday: {
            breakfastStart: { type: String, required: true },
            breakfastEnd: { type: String, required: true },
            lunchStart: { type: String, required: true },
            lunchEnd: { type: String, required: true },
            dinnerStart: { type: String, required: true },
            dinnerEnd: { type: String, required: true }
        },
        wednesday: {
            breakfastStart: { type: String, required: true },
            breakfastEnd: { type: String, required: true },
            lunchStart: { type: String, required: true },
            lunchEnd: { type: String, required: true },
            dinnerStart: { type: String, required: true },
            dinnerEnd: { type: String, required: true }
        },
        thursday: {
            breakfastStart: { type: String, required: true },
            breakfastEnd: { type: String, required: true },
            lunchStart: { type: String, required: true },
            lunchEnd: { type: String, required: true },
            dinnerStart: { type: String, required: true },
            dinnerEnd: { type: String, required: true }
        },
        friday: {
            breakfastStart: { type: String, required: true },
            breakfastEnd: { type: String, required: true },
            lunchStart: { type: String, required: true },
            lunchEnd: { type: String, required: true },
            dinnerStart: { type: String, required: true },
            dinnerEnd: { type: String, required: true }
        },
        saturday: {
            breakfastStart: { type: String, required: true },
            breakfastEnd: { type: String, required: true },
            lunchStart: { type: String, required: true },
            lunchEnd: { type: String, required: true },
            dinnerStart: { type: String, required: true },
            dinnerEnd: { type: String, required: true }
        },
        sunday: {
            breakfastStart: { type: String, required: true },
            breakfastEnd: { type: String, required: true },
            lunchStart: { type: String, required: true },
            lunchEnd: { type: String, required: true },
            dinnerStart: { type: String, required: true },
            dinnerEnd: { type: String, required: true }
        }
    }
});

const Student = mongoose.model('Student', studentSchema);
const Mess = mongoose.model('Mess', messSchema);
const Ngo = mongoose.model('Ngo', ngoSchema);
const Menu = mongoose.model('Menu', menuSchema);
const Timing = mongoose.model('Timing', timingSchema);

app.post('/submit', async (req, res) => {
    try {
        const { name, gender, course, hostel, mess, email, phone, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

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
        req.session.userEmail = email;
        res.status(200).send('Form submitted successfully!');
    } catch (err) {
        console.error('Error saving form data:', err);
        res.status(400).send('Error submitting form: ' + err.message);
    }
});

app.post('/submit-mess', async (req, res) => {
    try {
        const { name, hostel, mess, email, phone, upiId, password, mealCost } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
            role: 'mess',
            profile: { name, hostel, mess, phone, upiId, mealCost }
        });

        const newMess = new Mess({
            name,
            hostel,
            mess,
            email,
            phone,
            upiId,
            mealCost
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

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        
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

app.post('/submit-menu', async (req, res) => {
    try {
        const { days } = req.body;
        const mess = await Mess.findOne({ email: req.session.userEmail });
        if (!mess) {
            return res.status(401).send('Unauthorized');
        }

        const newMenu = new Menu({
            messId: mess._id,
            days
        });

        await newMenu.save();
        res.status(200).send('Menu submitted successfully!');
    } catch (err) {
        console.error('Error saving menu data:', err);
        res.status(400).send('Error submitting menu: ' + err.message);
    }
});

app.post('/submit-timing', async (req, res) => {
    try {
        const { days } = req.body;
        const mess = await Mess.findOne({ email: req.session.userEmail})
        if(!mess){
            return res.status(401).send('Unauthorized');
        }

        const newTiming = new Timing({
            messId: mess._id,
            days
        });

        await newTiming.save();
        res.status(200).send('timing submitted successfully!');
    }catch (err) {
        console.error('Error saving timing data:', err);
        res.status(400).send('Error submitting timing: ' + err.message);
    }
});
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userEmail = email; // Store email in session
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
        if (!req.session.userEmail) {
            return res.status(401).send('Unauthorized');
        }

        const type = req.query.type; // 'student', 'mess', or 'ngo'

        if (!type || (type !== 'student' && type !== 'mess' && type !== 'ngo')) {
            return res.status(400).send('Invalid type parameter. Use "student", "mess", or "ngo".');
        }

        let data;
        if (type === 'student') {
            data = await Student.findOne({ email: req.session.userEmail });
        } else if (type === 'mess') {
            data = await Mess.findOne({ email: req.session.userEmail });
        } else if (type === 'ngo') {
            data = await Ngo.findOne({ email: req.session.userEmail });
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

app.get('/api/student-profile', async (req, res) => {
    try {
        if (!req.session.userEmail) {
            return res.status(401).send('Unauthorized');
        }

        const student = await Student.findOne({ email: req.session.userEmail });
        if (!student) {
            return res.status(404).send('Student not found');
        }

        res.json(student);
    } catch (err) {
        console.error('Error retrieving student profile:', err);
        res.status(500).send('Error retrieving student profile: ' + err.message);
    }
});

const getDayOfWeek = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
};

app.get('/api/today-menu', async (req, res) => {
    try {
        if (!req.session.userEmail) {
            return res.status(401).send('Unauthorized');
        }

        const student = await Student.findOne({ email: req.session.userEmail });
        if (!student) {
            return res.status(401).send('Unauthorized');
        }

        const mess = await Mess.findOne({ hostel: student.hostel, mess: student.mess });
        if (!mess) {
            return res.status(404).send('Mess not found');
        }

        const menu = await Menu.findOne({ messId: mess._id });
        if (!menu) {
            return res.status(404).send('Menu not found');
        }

        const today = getDayOfWeek();
        res.json(menu.days[today]);
    } catch (err) {
        console.error('Error retrieving menu data:', err);
        res.status(500).send('Error retrieving menu data: ' + err.message);
    }
});

app.get('/api/today-timing', async (req, res) => {
    try {
        if (!req.session.userEmail) {
            return res.status(401).send('Unauthorized');
        }

        const student = await Student.findOne({ email: req.session.userEmail });
        if (!student) {
            return res.status(401).send('Unauthorized');
        }

        const mess = await Mess.findOne({ hostel: student.hostel, mess: student.mess });
        if (!mess) {
            return res.status(404).send('Mess not found');
        }

        const timing = await Timing.findOne({ messId: mess._id });
        if (!timing) {
            return res.status(404).send('Timing not found');
        }

        const today = getDayOfWeek();
        res.json(timing.days[today]);
    } catch (err) {
        console.error('Error retrieving timing data:', err);
        res.status(500).send('Error retrieving timing data: ' + err.message);
    }
});

app.get('/api/full-menu', async (req, res) => {
    try {
        if (!req.session.userEmail) {
            return res.status(401).send('Unauthorized');
        }

        const student = await Student.findOne({ email: req.session.userEmail });
        if (!student) {
            return res.status(401).send('Unauthorized');
        }

        const mess = await Mess.findOne({ hostel: student.hostel, mess: student.mess });
        if (!mess) {
            return res.status(404).send('Mess not found');
        }

        const menu = await Menu.findOne({ messId: mess._id });
        if (!menu) {
            return res.status(404).send('Menu not found');
        }

        res.json(menu.days);
    } catch (err) {
        console.error('Error retrieving menu data:', err);
        res.status(500).send('Error retrieving menu data: ' + err.message);
    }
});

app.get('/api/getMessUpiId', async (req, res) => {
    try {
        if (!req.session.userEmail) {
            return res.status(401).send({ success: false, message: 'Unauthorized' });
        }

        const student = await Student.findOne({ email: req.session.userEmail });
        if (!student) {
            return res.status(404).send({ success: false, message: 'Student not found' });
        }

        const mess = await Mess.findOne({ hostel: student.hostel, mess: student.mess });
        if (!mess) {
            return res.status(404).send({ success: false, message: 'Mess not found' });
        }

        res.send({ success: true, upiId: mess.upiId });
    } catch (err) {
        console.error('Error retrieving mess UPI ID:', err);
        res.status(500).send({ success: false, message: 'Error retrieving mess UPI ID' });
    }
});

app.post('/api/updateProfile', async (req, res) => {
    try {
        if (!req.session.userEmail) {
            return res.status(401).send('Unauthorized');
        }

        const { email, phone, hostel, mess } = req.body;
        await Student.findOneAndUpdate(
            { email: req.session.userEmail },
            { email, phone, hostel, mess }
        );

        res.status(200).send('Profile updated successfully!');
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).send('Error updating profile: ' + err.message);
    }
});

// Add this endpoint to your server code
app.post('/api/addVirtualCredits', async (req, res) => {
    try {
        if (!req.session.userEmail) {
            return res.status(401).send('Unauthorized');
        }

        const { amount } = req.body;
        const email = req.session.userEmail;

        // Find the student by email and update their virtual credits
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).send('Student not found');
        }

        student.virtualCredits = (student.virtualCredits || 0) + parseFloat(amount);
        await student.save();

        res.json({ success: true, message: 'Virtual credits added successfully' });
    } catch (err) {
        console.error('Error adding virtual credits:', err);
        res.status(500).send('Error adding virtual credits: ' + err.message);
    }
});

app.post('/api/scanQrCode', async (req, res) => {
    try {
        const { email, messId, hostel } = req.body;
        const Email = req.session.userEmail;
        const MESS = await Mess.findOne({email: Email});

        if(!MESS){
            console.error('mess not found for email', Email);
            return res.status(404).send('Mess not found');
        }

        // Logging the request data
        console.log('Request received:', req.body);

        // Find the student by email
        const student = await Student.findOne({ email });
        if (!student) {
            console.error('Student not found for email:', email);
            return res.status(404).send('Student not found');
        }

        if( MESS.mess != student.mess, MESS.hostel != student.hostel ){
            console.error('Unauthorised Attemt/ Undesignated mess')
            return res.status(404).send('not the designated mess')
        }

        // Proceed to deduct credits
        const mealCost = MESS.mealCost;
        console.log('Meal cost:', mealCost);

        if (student.virtualCredits < mealCost) {
            console.error('Insufficient credits:', student.virtualCredits);
            return res.status(400).send('Insufficient credits');
        }

        student.virtualCredits -= mealCost;
        await student.save();

        console.log('Credits deducted successfully. Remaining credits:', student.virtualCredits);
        res.json({ success: true, message: 'Credits deducted successfully', remainingCredits: student.virtualCredits });
    } catch (err) {
        console.error('Error processing QR code scan:', err);
        res.status(500).send('Error processing QR code scan: ' + err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
