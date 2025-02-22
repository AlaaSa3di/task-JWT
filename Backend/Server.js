const express = require('express');  //npm install express
const jwt = require('jsonwebtoken'); //npm install jsonwebtoken
const bcrypt = require('bcrypt'); //npm install bcrypt
const cors = require('cors'); //npm install cors
const cookieParser = require("cookie-parser"); //npm install cookie-parser

const app = express();
const PORT = 5000;

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
}));

app.use(express.json());
app.use(cookieParser());

const users = [];

const JWT_SECRET = 'alaaSadi';

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = { username, password: hashedPassword };
    users.push(user);

    res.status(201).json({ message: 'User created successfully' });
});

app.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true });
    res.json({ message: 'Logged in successfully' });
});

app.post('/logout', (req, res) => {
    res.clearCookie('token'); // حذف الكوكي
    res.json({ message: 'Logged out successfully' });
});

app.get('/profile', authenticateJWT, (req, res) => {
    res.json({ message: `Welcome ${req.user.username}` });
});

app.get('/home', (req, res) => {
    res.json({ message: 'Welcome to the home page' });
});
app.get("/user", (req, res) => {
    res.json(users);
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});