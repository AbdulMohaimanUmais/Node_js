const Signup = require('../models/register.js');
const bcrypt = require('bcrypt');

// ==== SIGNUP PAGE ====
const signup_page = async (req, reply) => {
  return reply.sendFile('register.html'); // public folder se serve karega
};

// ==== SIGNUP POST ====
const signupPost = async (req, reply) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await Signup.findOne({ email });
    if (existingUser) {
      return reply.status(400).send({ error: '❌ Email already exists!' });
    }

    // Hash password & save user
    const hashPass = await bcrypt.hash(password, 10);
    await Signup.create({ name, email, password: hashPass });

    return reply.send({ message: '✅ Signup successful! You can now login.' });
  } catch (error) {
    console.error('Signup Error:', error);
    return reply.status(500).send({ error: '❌ Signup failed, try again.' });
  }
};

// ==== LOGIN PAGE ====
const loginForm = async (req, reply) => {
  return reply.sendFile('login.html');
};

// ==== LOGIN POST ====
const loginFormGet = async (req, reply) => {
  try {
    const { email, password } = req.body;
    const credentials = await Signup.findOne({ email });

    if (!credentials) return reply.status(404).send({ error: '❌ Email not found.' });

    const isMatch = await bcrypt.compare(password, credentials.password);
    if (!isMatch) return reply.status(401).send({ error: '❌ Invalid password.' });

    return reply.redirect('/home.html');
  } catch (error) {
    console.error('Login Error:', error);
    return reply.status(500).send({ error: '❌ Login failed. Try again.' });
  }
};

// ==== HOME PAGE ====
const home = async (req, reply) => {
  return reply.sendFile('home.html');
};

module.exports = { signup_page, signupPost, loginForm, loginFormGet, home };
