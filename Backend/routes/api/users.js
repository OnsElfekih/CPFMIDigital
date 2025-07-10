const router = require("express").Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// @route POST api/users
// @desc Register new user
// @access Public
router.post("/register", (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send({ status: "notok", msg: "Please enter all required data" });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.status(400).send({ status: "notokmail", msg: "Email already exists" });
      }

      const newUser = new User({
        username,
        email,
        password,
        role
      });

      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          return res.status(500).send({ status: "error", msg: "Internal server error" });
        }

        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            return res.status(500).send({ status: "error", msg: "Internal server error" });
          }

          newUser.password = hash;

          newUser.save()
            .then((user) => {
              // Generate JWT token
              jwt.sign(
                { id: user.id },
                config.get("jwtSecret"),
                { expiresIn: config.get("tokenExpire") },
                (err, token) => {
                  if (err) {
                    return res.status(500).send({ status: "error", msg: "Internal server error" });
                  }

                  // Send response with token and user details
                  res.status(200).send({
                    status: "ok",
                    msg: "Successfully registered",
                    token,
                    user
                  });
                }
              );
            })
            .catch(err => {
              return res.status(500).send({ status: "error", msg: "Internal server error" });
            });
        });
      });
    })
    .catch(err => {
      return res.status(500).send({ status: "error", msg: "Internal server error" });
    });
});

module.exports = router;
