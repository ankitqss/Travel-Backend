const client = require("../db");
const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwt_secret_key = process.env.JWT_SECRETKEY;

router.get("/getall", async (req, res) => {
  const result = await pool.query(`SELECT * FROM users`);
  console.log(result.rows);
  res.json(result.rows);
});

router.post("/register", async (req, res) => {
  const { name, email, phone, password, dob, interests } = req.body;

  console.log(req.body);
  const emailCheckQuery = `SELECT COUNT(*) FROM users WHERE email = $1`;
  const phoneCheckQuery = `SELECT COUNT(*) FROM users WHERE phone = $1`;

  //hashing password

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    // Check if email already exists
    const emailCheckResult = await pool.query(emailCheckQuery, [email]);
    const countEmail = parseInt(emailCheckResult.rows[0].count);

    if (countEmail > 0) {
      return res.status(400).send({ error: "Email already exists" });
    }

    // Check if phone already exists
    const phoneCheckResult = await pool.query(phoneCheckQuery, [phone]);
    const countPhone = parseInt(phoneCheckResult.rows[0].count);

    if (countPhone > 0) {
      return res.status(400).send({ error: "Phone number already exists" });
    }

    // Insert user if email and phone are not already in use
    const insertQuery = `INSERT INTO users (name, email, phone, password, dob, interests, createdat) VALUES ($1, $2, $3, $4, $5, $6, NOW() AT TIME ZONE 'utc')`;
    const insertResult = await pool.query(insertQuery, [
      name,
      email,
      phone,
      hashedPassword,
      dob,
      interests,
    ]);

    const token = jwt.sign({ email: email, phone: phone }, jwt_secret_key, {
      expiresIn: 60 * 5,
    });

    console.log(
      `User ${name} with email ${email} and phone ${phone} inserted successfully`
    );
    console.log("Token is", token);
    res
      .status(200)
      .json({ message: "success", user: insertResult, token: token });
    // .send(insertResult)
  } catch (err) {
    console.error(
      `Error inserting user ${name} with email ${email} and phone ${phone}: ${err.message}`
    );
    res.status(500).send({ error: "Internal server error" });
  }
});

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const query = `SELECT * FROM users WHERE email = $1 AND password = $2`;
//   try {
//     const result = await pool.query(query, [email, password]);

//     if (result.rowCount === 0) {
//       return res.status(401).send({ error: "Invalid email or password" });
//     }

//     const user = result.rows[0];

//     console.log(`User ${user.name} with email ${user.email} logged in`);
//     res.send(user).status(200);
//   } catch (err) {
//     console.error(`Error logging in user with email ${email}: ${err.message}`);
//     res.status(500).send({ error: "Internal server error" });
//   }
// });

router.post("/login", async (req, res) => {
  // 1. req body se pass and email nikalenge

  const { email, password } = req.body;
  // 2. uss email se database se user ko nikalenge

  if (!email || !password) {
    return res.status(422).json({ message: "field can't be null !" });
  }
  try {
    const checkResult = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    // 3. agar kuch nahi hua toh invalid email and password response kar denge
    if (checkResult.rowCount === 0) {
      return res.status(401).send({ error: "Invalid email or password !" });
    }

    const user = checkResult.rows[0];

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(401).send({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, jwt_secret_key, {
      expiresIn: 60 * 5,
    });

    console.log(`User ${user.name} with email ${user.email} logged in`);
    res.status(200).send({ user, token });
  } catch (err) {
    console.error(`Error login : ${err.message}`);
    res.status(500).send({ error: "Internal server error" });
  }

  // 4. kuch mil jaayea toh return ke password ko bcryp compare krenge
  // 5. agar bcryp.compare 0 hua toh "not valid" warna "login ho jayega"
});

module.exports = router;