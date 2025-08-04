const fastify = require('fastify')({ logger: true });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const Signup = require('./models/register');

// ==== CONFIG VARIABLES ====
const PORT = 5000;
const MONGO_URI = 'mongodb://127.0.0.1:27017/emailVerifyDB';

// ==== FASTIFY PLUGINS ====
fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
});
fastify.register(require('@fastify/formbody'));

// ==== MONGO CONNECT ====
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ Mongo Error:', err));

// =================== ROUTES ===================

// Signup Page
fastify.get('/signup', async (req, reply) => {
    return reply.sendFile('register.html');
});

// Login Page
fastify.get('/login', async (req, reply) => {
    return reply.sendFile('login.html');
});

// Home Page
fastify.get('/home', async (req, reply) => {
    return reply.sendFile('home.html');
});

// Signup Handler
fastify.post('/signup', async (req, reply) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await Signup.findOne({ email });
        if (existingUser) return reply.status(400).send('❌ Email already exists. Please login.');

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Signup({ name, email, password: hashedPassword });
        await newUser.save();

        return reply.send('✅ Signup successful! You can now login.');
    } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send('❌ Internal server error. Please try again.');
    }
});

// Login Handler
fastify.post('/loginForm', async (req, reply) => {
    const { email, password } = req.body;
    const user = await Signup.findOne({ email });

    if (!user) return reply.status(400).send('❌ Invalid email or password.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return reply.status(400).send('❌ Invalid email or password.');

    return reply.redirect('/home');
});

// 404 Handler
fastify.setNotFoundHandler((req, reply) => {
    reply.status(404).send('❌ Page not found. <a href="/login">Go to Login</a>');
});

// Start Server
fastify.listen({ port: PORT }, (err) => {
    if (err) throw err;
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
