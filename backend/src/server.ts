import express from "express";
import { connectDB } from "./config/db.config";
import { config } from "./utils/constants";
import morgan from "morgan"
import cors from "cors"
import { adminRouter } from "./routes/admin.routes";

const app = express();
const PORT = config.PORT || 5000;

connectDB()

app.use(morgan('dev'))
app.use(express.json());

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
}));

app.use(adminRouter)

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


