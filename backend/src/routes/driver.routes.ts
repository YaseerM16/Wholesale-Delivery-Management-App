import { Router } from "express";
import { driverAuthController } from "../controllers/driver/Driver.Auth.Controller";
import { driverController } from "../controllers/driver/Driver.Controller";

const router = Router()

router
    .post("/register", driverAuthController.driverRegister.bind(driverAuthController))
    .post('/login', driverAuthController.driverLogin.bind(driverAuthController))
    .get("/get-drivers", driverController.getDrivers.bind(driverController))
    .put("/edit-driver/:driverId", driverController.editDriver.bind(driverController))
    .delete("/delete-driver/:driverId", driverController.deleteDriver.bind(driverController))

export const driverRouter = router