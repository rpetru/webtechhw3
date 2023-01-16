const express = require("express");
const Sequelize = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "my.db",
});

let FoodItem = sequelize.define(
  "foodItem",
  {
    name: Sequelize.STRING,
    category: {
      type: Sequelize.STRING,
      validate: {
        len: [3, 10],
      },
      allowNull: false,
    },
    calories: Sequelize.INTEGER,
  },
  {
    timestamps: false,
  }
);

const app = express();
// TODO

app.get("/create", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    for (let i = 0; i < 10; i++) {
      let foodItem = new FoodItem({
        name: "name " + i,
        category: ["MEAT", "DAIRY", "VEGETABLE"][Math.floor(Math.random() * 3)],
        calories: 30 + i,
      });
      await foodItem.save();
    }
    res.status(201).json({ message: "created" });
  } catch (err) {
    console.warn(err.stack);
    res.status(500).json({ message: "server error" });
  }
});

app.get("/food-items", async (req, res) => {
  try {
    let foodItems = await FoodItem.findAll();
    res.status(200).json(foodItems);
  } catch (err) {
    console.warn(err.stack);
    res.status(500).json({ message: "server error" });
  }
});

// app.post("/food-items", async (req, res) => {
//   try {
//      if (!req.body) {
//        res.status(400).json({ message: "body is missing" });
//        return;
//      }
    

//     if (!req.body.name || !req.body.category || !req.body.calories) {
//       res.status(400).json({ message: "malformed request" });
//       return;
//     }

//     if (req.body.calories < 0) {
//       res.status(400).json({ message: "calories should be a positive number" });
//       return;
//     }

//     let foodItem = new FoodItem({
//       name: req.body.name,
//       category: req.body.category,
//       calories: req.body.calories,
//     });

//     if (!foodItem) {
//       return res.status(400).json({ message: "not a valid category" });
//     }

//     res.status(201).json({ message: "created" });
//   } catch (err) {
//     res.status(400).json({ message: "server error" });
//   }
// });

app.post('/food-items', async (req, res) => {

    try {
        if (Object.keys(req.body).length === 0) {
          return res.status(400).json({ message: 'body is missing' });
        }
    
        if (!req.body.name || !req.body.category || !req.body.calories) {
          return res.status(400).json({ message: 'malformed request' });
        }
    
        if (req.body.calories < 0) {
          return res.status(400).json({ message: 'calories should be a positive number' });
        }
    
        if (!['MEAT', 'DAIRY', 'VEGETABLE'].includes(req.body.category)) {
          return res.status(400).json({ message: 'not a valid category' });
        }
    
        let foodItem = new FoodItem({
          name: req.body.name,
          category: req.body.category,
          calories: req.body.calories
        });
        await foodItem.save();
    
        res.status(201).json({ message: 'created' });
      } catch (err) {
        console.warn(err.stack);
        res.status(500).json({ message: 'server error' });
      }
})

module.exports = app;
