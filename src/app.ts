import dotenv from "dotenv"; // env 파일 사용
// import cors from "cors";
import express, { Request, Response } from "express";
import mongoose from "mongoose";

import router from "./routes";

const app = express();

dotenv.config();

app.use(express.json());

// app.use(cors()); // CORS 이슈 해결

const { MONGODB_PASSWORD, PORT } = process.env;
mongoose.connect(
  `mongodb+srv://yushinpak:${MONGODB_PASSWORD}@markdown-diary-database.lshdqe0.mongodb.net/`
);
mongoose.connection.on("connected", () => {
  console.log("Successfully connected to MongoDB");
});

app.use(router); 

app.get("/", (req: Request, res: Response) => {
  res.send("서버 실행 완료!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
