const {signup_page, signupPost, loginForm, loginFormGet, home} = require('../controller/register.js');

const routes = async(app, options)=>{
    app.get('/signup', signup_page);
    app.post('/signup', signupPost);
    app.get('/loginForm', loginForm);
    app.post('/loginForm', loginFormGet);
    app.get('/home', home)
}

module.exports = routes;