import express from "express";
import { connectDB } from "./config/db.config";
import { config } from "./utils/constants";
import morgan from "morgan"
import cors from "cors"
import { adminRouter } from "./routes/admin.routes";
import { driverRouter } from "./routes/driver.routes";
import { vendorRouter } from "./routes/vendor.routes";
import { inventoryRouter } from "./routes/inventory.routes"
import { orderRouter } from "./routes/order.routes";
import path from "path";

const app = express();
const PORT = config.PORT || 5000;

connectDB()

app.use(morgan('dev'))
app.use(express.json());

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: "GET,POST,PUT,DELETE,PATCH",
}));


app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(adminRouter)
app.use("/driver", driverRouter)
app.use("/vendor", vendorRouter)
app.use("/inventory", inventoryRouter)
app.use("/order", orderRouter)

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


