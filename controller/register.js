const path = require('path');
const Signup = require('../models/register.js');
const bcrypt = require('bcrypt');

const signup_page = async (req, reply) => {
  return reply.sendFile('/register.html');
};


const signupPost = async (req, reply) => {
  try {
    const { name, email, password } = req.body;

    const hashPass = await bcrypt.hash(password, 10);


    const credentials = await Signup.create({ name, email, password: hashPass });

    return reply.redirect('/home.html');
  } catch (error) {
    console.error('Signup Error:', error);
    return reply.status(500).send({ error: 'Signup failed, try again.' });
  }
};

const loginForm = async (req, reply) => {
  return reply.sendFile('/login.html');
};

const loginFormGet = async (req, reply) => {
  try {
    const { email, password } = req.body;

    const credentials = await Signup.findOne({ email });

    if (!credentials) {
      console.log('Email not found.');
      return reply.status(404).send({ error: 'Email not found.' });
    }

    const hashPassGet = await bcrypt.compare(password, credentials.password);

    if (!hashPassGet) {
      console.log('Invalid credentials.');
      return reply.status(401).send({ error: 'Invalid password.' });
    }

    return reply.redirect('/home.html');
  } catch (error) {
    console.error('Login Error:', error);
    return reply.status(500).send({ error: 'Login failed. Try again.' });
  }
};


const home = async (req, reply) => {
  return reply.sendFile('/home.html');
};

module.exports = { signup_page, signupPost, loginForm, loginFormGet, home };
