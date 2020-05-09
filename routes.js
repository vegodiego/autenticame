const mongoose = require("mongoose");
const User = require("./user");
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');


const requireUser = async (req, res, next) => {
  const userId = req.session.userId;
  if (userId) {
    const user = await User.findOne({ _id: userId });
    res.locals.user = user;
    next();
  } else {
    return res.redirect('/login');
  }
}

router.get('/', requireUser, async (req, res) => {
  const users = await User.find();
  res.render('index', { users: users });
})

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  try {
    const user = await User.create(req.body);
    console.log(user)
  } catch (e) {
    console.error(e);
  }
  res.redirect('/');
});

router.get('/login', (req, res) => res.render('login'));

router.post('/login', async (req, res) => {
  try {
    const user = await User.authenticate(req.body.email, req.body.password);
    console.log('usuario: ' + user)
    if(user){
      req.session.userId = user._id // acá guardamos el id en la sesión
      return res.redirect('/')
    }else {
      res.render('login', { error: "Wrong email or password. Try again!" });
    }
  } catch (e) {
    console.log('error: ' + e)
    return next(e)
  }
});

router.get('/logout', async (req, res) => {
  req.session.userId = null
  console.log(req.session)
  res.redirect('/login');
})

module.exports = router;

