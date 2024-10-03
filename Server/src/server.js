import express from "express";
import viewEngine from "./config/viewEngine";
import initwebRoutes from "./route/web";
import connectDB from "./config/connectDB";

require("dotenv").config();
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

let app = express();

// Cài đặt CORS với thư viện cors

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type,Authorization"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware
    next();
});

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
