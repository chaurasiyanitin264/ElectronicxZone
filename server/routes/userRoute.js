const express = require("express");
const route = express.Router();
const UserController = require("../controllers/userController");

route.post("/usersave", UserController.customerSave);
route.get("/ViewOrders", UserController.ViewOrders); // ✅ Fix: Use GET instead of POST

module.exports = route;