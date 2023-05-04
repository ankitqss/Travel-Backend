const express = require("express");
const router = express.Router();
const pool = require("../db");
require("dotenv").config();

router.post("/add", async (req, res) => {
  const { title, price, startDate, rating, img } = req.body;

  try {
    const query = `insert into favourite (title, price, startdate, rating, img) values ($1,  $2, $3, $4, $5)`;

    const result = await pool.query(query, [title, price, startDate, rating, img]);
    return res
      .status(200)
      .send({ message: "Event marked as favourites successfully !" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error!" });
  }
});

router.get("/get", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM favourite`);
    console.log(result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error !" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const query = `delete from favourite where id=$1`;
  try {
    const result = await pool.query(query, [id]);
    return res.status(200).send({ message: "deleted successfully !" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: `Internal Server Error: ${err}` });
  }
});

module.exports = router;
