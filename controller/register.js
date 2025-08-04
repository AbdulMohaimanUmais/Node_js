// const signup_page = async(req, reply)=>{
//     return reply.sendFile('/register.html')
// };


// const signupPost = async(req, reply)=>{
//     try {
//         const { name, email, password } = req.body;
//         const hashPass = await bcrypt.hash(password, 10);
//         const credentials = await Signup.create({name, email, password: hashPass});
//         return reply.send(credentials);
//     } catch (error) {
//         console.error('internal server error.')
//     }
// };


// const loginForm = async(req, reply)=>{
//     return reply.sendFile('/login.html')
// };



// const loginFormGet = async(req, reply)=>{
//     try {
//         const {email, password} = req.body;
//         const credentials = await Signup.findOne({email});

//         if(!credentials){
//             console.log('email is not found.');
//             return reply.status(404).send({error: 'Email not found.'})
//         }

//         const hashPassGet = bcrypt.compare(password, credentials.password);
//         if(!hashPassGet){
//             console.log('invalid credentials.');
//             return reply.status(500).send({error: 'Invalid password.'})
//         }

//         return reply.redirect('/home.html');
//     } catch (error) {
//         console.log('internal server error.')
//         return reply.status(500).send({error: 'Internal server error.'})
//     }
// };


// const home = async(req, reply)=>{
//     return reply.sendFile('/home.html')
// }


// module.exports = { signup_page, signupPost, loginForm, loginFormGet, home };




const path = require('path');
const Signup = require('../models/register.js');
const bcrypt = require('bcrypt');

// Show signup form (GET /signup)
const signup_page = async (req, reply) => {
  return reply.sendFile('/register.html');
};

// Handle signup form submit (POST /signup)
const signupPost = async (req, reply) => {
  try {
    const { name, email, password } = req.body;

    // Hash password
    const hashPass = await bcrypt.hash(password, 10);

    // Save to DB
    const credentials = await Signup.create({ name, email, password: hashPass });

    // Redirect to home page on success
    return reply.redirect('/home.html');
  } catch (error) {
    console.error('Signup Error:', error);
    return reply.status(500).send({ error: 'Signup failed, try again.' });
  }
};

// Show login form (GET /loginForm)
const loginForm = async (req, reply) => {
  return reply.sendFile('/login.html');
};

// Handle login form submit (POST /loginFormGet)
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

// Serve home page
const home = async (req, reply) => {
  return reply.sendFile('/home.html');
};

module.exports = { signup_page, signupPost, loginForm, loginFormGet, home };
