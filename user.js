const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Userschema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});


Userschema.pre("save", function (next) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    next();
  });
});

Userschema.statics.authenticate = async (email, password) => {
  const user = await mongoose.model("User").findOne({ email: email });
  console.log('user: ' + user)
  if (user) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) reject(err);
        resolve(result === true ? user : null);
      });
    });
    return user;
  }
  return null;
};

module.exports = mongoose.model("User", Userschema);