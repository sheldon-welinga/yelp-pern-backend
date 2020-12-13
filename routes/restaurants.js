const router = require("express").Router();
const { pool: db } = require("../db/db");
const validate = require("uuid-validate");

// Get all restaurants
router.get("/", async (req, res) => {
  try {
    const restaurants = await db.query("SELECT * FROM restaurants");

    //check if no restaurants are currently available in the database and return an error else return all restaurants found
    if (restaurants.rows.length === 0) {
      res.status(404).json({
        error: "Oops!! No restaurants currently available!",
      });
    } else {
      res.status(200).json(restaurants.rows);
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// Get one restaurant
router.get("/:restaurantId", async (req, res) => {
  try {
    //1. destructure the restaurantId from the req.params
    const { restaurantId } = req.params;

    // 2. check if restaurantId provided is of valid type uuid, if not return an error
    if (validate(restaurantId)) {
      // 3. get a single restaurant with the specified id
      const restaurant = await db.query(
        "SELECT * FROM restaurants WHERE restaurant_id=$1",
        [restaurantId]
      );

      //4. Check if restaurant doesnt exist and return error else return the found restaurant details
      if (restaurant.rows.length === 0) {
        res.status(404).json({
          error: "Oops!! No such restaurant was found",
        });
      } else {
        res.status(200).json(restaurant.rows[0]);
      }
    } else {
      res.status(406).json({
        error: "Error!! The restaurant id provided is invalid!",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// Create a new restaurant
router.post("/new", async (req, res) => {
  try {
    // 1. destructure the details from req.body
    const { name, location, price_range } = req.body;

    // 2. create a new restaurant and save its details in the database
    const newRestaurant = await db.query(
      "INSERT INTO restaurants (name, location, price_range) values($1, $2, $3) RETURNING *",
      [name, location, price_range]
    );

    res.status(201).json({
      message: "New restaurant created successfully!",
      data: newRestaurant.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// Edit restaurant details
router.patch("/edit/:restaurantId", async (req, res) => {
  try {
    //1. get the restaurant id from the req.params and other details  to be updated from req.body
    const { restaurantId } = req.params;
    const { name, location, price_range } = req.body;

    //2. validate if the restaurant id is of type uuid and if not return an error
    if (validate(restaurantId)) {
      // 3. get a single restaurant with specified id from database
      const restaurant = await db.query(
        "SELECT * FROM restaurants WHERE restaurant_id = $1",
        [restaurantId]
      );

      // 4. Check if the restaurant doesnt exist and return an error else update restaurant details in database
      if (restaurant.rows.length === 0) {
        res.status(404).json({
          error: "Oops!! No such restaurant found!",
        });
      } else {
        const updatedRestaurant = await db.query(
          "UPDATE restaurants SET name=$2, location=$3, price_range=$4 WHERE restaurant_id=$1 RETURNING *",
          [restaurantId, name, location, price_range]
        );

        res.status(200).json({
          message: "Restaurant details updated successfully",
          data: updatedRestaurant.rows[0],
        });
      }
    } else {
      res.status(406).json({
        error: "Error!! The restaurant id provided is invalid!",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// Delete a single restaurant
router.delete("/delete/:restaurantId", async (req, res) => {
  try {
    // 1. destructure the restaurantId from req.params
    const { restaurantId } = req.params;

    //2. check if the restaurant id is of valid type uuid, if not return an error
    if (validate(restaurantId)) {
      //3. get a single restaurant with specified id to delete
      const deleteRestaurant = await db.query(
        "SELECT * FROM restaurants WHERE restaurant_id=$1",
        [restaurantId]
      );

      //4. check if the restaurant doesnt exit and return an error else delete the restaurant and return success
      if (deleteRestaurant.rows.length === 0) {
        res.status(404).json({
          error: "Oops!! No such restaurant found!",
        });
      } else {
        await db.query("DELETE FROM restaurants WHERE restaurant_id=$1", [
          restaurantId,
        ]);

        res.status(200).json({
          message: "Restaurant deleted successfully!",
        });
      }
    } else {
      res.status(406).json({
        error: "Error!! The restaurant id provided is invalid!",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
