const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require ('./user');
const routes = require('./routes');
var cookieSession = require('cookie-session');

const app = express();


app.set('trust proxy', 1); // trust first proxy
app.use(cookieSession({
  name: 'session',
  keys: ['key1'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/autenticar', { useNewUrlParser: true });
mongoose.connection.on("error", function(e){ console.error(e); });


app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/', routes);

app.listen(3000, () => console.log("Listening on port 3000 ..."));


