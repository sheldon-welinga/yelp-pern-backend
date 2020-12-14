const router = require("express").Router();
const { pool: db } = require("../db/db");

//get all reviews with the specified restaurant id
router.get("/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const reviews = await db.query(
      "SELECT * FROM reviews WHERE restaurant_id=$1",
      [restaurantId]
    );

    if (reviews.rows.length === 0) {
      res.status(404).json({
        error: "Oops!! No reviews yet",
      });
    } else {
      res.status(200).json(reviews.rows);
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

//create a new review
router.post("/new", async (req, res) => {
  try {
    // 1. destructure the values from req.body
    const { name, review, rating, restaurantId } = req.body;

    // 2. create a new review and add it to the database
    const newReview = await db.query(
      "INSERT INTO reviews (name, review, rating, restaurant_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, review, rating, restaurantId]
    );

    res.status(201).json({
      message: "Review submitted successfully!",
      data: newReview,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
