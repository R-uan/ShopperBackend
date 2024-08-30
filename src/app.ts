import dotenv from "dotenv";
import express from "express";
import Controller from "./Core/Controller";
dotenv.config();

const app = express();

app.use(express.json());

app.route("/upload").post(Controller.Upload);
app.route("/confirm").patch(Controller.Confirm);
app.route("/:costumerId/list").get(Controller.CostumerList);

app.listen(3000, () => console.log("Running application on port: 3000"));
