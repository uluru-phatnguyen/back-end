import express from "express";
import { json, urlencoded } from "body-parser";
import RootRoute from "./routes/root";
import model from "./models";

const app: express.Express = express();

app.use(json());
app.use(urlencoded({extended: true}));

model.set();

RootRoute.set(app);

export default app;
