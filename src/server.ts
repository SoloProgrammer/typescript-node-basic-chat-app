import express, { Request, Response } from "express";

import dotenv from "dotenv";
import { connectToSocket } from "./services/socket.js";
import path from "path";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.static(path.resolve("src/public")));
app.use(express.static(path.resolve("dist/public")));

app.get("/", (req: Request, res: Response) => {
  res.sendFile("./public/index.html");
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});

connectToSocket(server);
