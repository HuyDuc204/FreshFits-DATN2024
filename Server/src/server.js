import express from "express";
import viewEngine from "./config/viewEngine";
import initwebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import cors from "cors"; // Cài thư viện này để xử lý CORS

require("dotenv").config();
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

let app = express();

// Cài đặt CORS với thư viện cors
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

viewEngine(app);
initwebRoutes(app);
connectDB(app);

// Dùng app.listen để lắng nghe cổng
let port = process.env.PORT || 6969;

app.listen(port, () => {
    console.log("Backend Nodejs is running on the port: " + port);
});
