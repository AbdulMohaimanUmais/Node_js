const fastify = require('fastify');
const app = fastify();

const formBody = require('@fastify/formbody');
app.register(formBody);

const path = require('path');
const static = require('@fastify/static');

app.register(static,{
    root: path.join(__dirname, 'public'),
    prefix: '/'
});

const routes = require('./routes/routs.js');
app.register(routes);

const connectDB = require('./config/db.js');
connectDB();


const start = ()=>{
   try {
    app.listen({ port:3000 });
    console.log('http://localhost:3000 is working.');
   } catch (error) {
    console.error('Server is crashed.');
    process.exit(1);
   }
}

start();