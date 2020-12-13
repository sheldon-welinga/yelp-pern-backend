const router = require("express").Router();
const { pool: db } = require("../db/db");

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

module.exports = router;
