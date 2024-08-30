import dotenv from "dotenv";
import express from "express";
import Controller from "./Core/Controller";
import path from "path";
dotenv.config();

const app = express();

app.use(express.json());
app.use("/images", express.static(path.resolve(__dirname, "../images")));

app.route("/upload").post(Controller.Upload);
app.route("/confirm").patch(Controller.Confirm);
app.route("/:costumerId/list").get(Controller.CostumerList);

app.listen(3000, () => console.log("Running application on port: 3000"));
