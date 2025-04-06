import { Router } from "express";
import multer from "multer"
import { inventoryController } from "../controllers/inventory/Inventory.Controller";

const upload = multer({
    storage: multer.diskStorage({
        destination: "./uploads/",
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
    }),
});

const router = Router()

router
    .post("/add-item", upload.array("images", 3), inventoryController.addToInventory.bind(inventoryController))
    .get("/get-inventory", inventoryController.getInventory.bind(inventoryController))
    .put("/edit-item/:itemId", upload.array("images", 3), inventoryController.editFromInventory.bind(inventoryController))
    .delete("/delete-item/:itemId", inventoryController.deleteItem.bind(inventoryController))



export const inventoryRouter = router