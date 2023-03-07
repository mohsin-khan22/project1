const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const secretKey = "secretkey";

router.post("/signup", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      console.log(user);
      if (!user) {
        res.send("Registered Sucessfully");
        let hashedPassword = bcrypt.hashSync(req.body.password, 8);
        let user1 = new User();
        user1.name = req.body.name;
        user1.email = req.body.email;
        user1.password = hashedPassword;

        user1.save();
      } else {
        res.send("email already exists");
      }
    })
    .catch((err) => {
      console.log(err);
      res.send("Something went wrong");
    });
});
router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    console.log(user);
    if (!user) {
      res.send("User not registered");
    } else {
      const passwordMatch = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordMatch) {
        res.send("Invalid Password");
      } else {
        jwt.sign({ user }, secretKey, { expiresIn: "50000s" }, (err, token) => {
          res.json({
            message: "welcome to your account",
            token,
          });
        });
      }
    }
  });
});
router.post("/profile", verifyToken, (req, res) => {});
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    console.log(token);
    req.token = token;
    next();
    jwt.verify(req.token, secretKey, (err, authData) => {
      if (err) {
        res.send({
          result: "Invalid Token",
        });
      } else {
        res.json({
          message: "Profile Accessed",
          authData,
        });
      }
    });
  } else {
    res.send({
      result: "Token is not valid",
    });
  }
}
module.exports = router;
