import dotenv from "dotenv"; // env 파일 사용
import cors from "cors";
import express, { Request, Response } from "express";
import mongoose from "mongoose";

const fs = require("fs");

const path = require("path");
// const bodyParser = require("body-parser");

import router from "./routes";
import bodyParser from "body-parser";

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors()); // CORS 이슈 해결
app.use(bodyParser.json());


const { MONGODB_PASSWORD, PORT } = process.env;
mongoose.connect(
  `mongodb+srv://yushinpak:${MONGODB_PASSWORD}@markdown-diary-database.lshdqe0.mongodb.net/`
);
mongoose.connection.on("connected", () => {
  console.log("Successfully connected to MongoDB");
});

app.use(router);

app.get("/api", (req: Request, res: Response) => {
  // 서버 실행 테스트 코드 - 추후 삭제
  res.send("서버 실행 완료!");
});

let directoryPath = "/Users/using/Desktop/Sing/2. Area/Arrow"; // 일기가 담기는 곳 - 내가 현재 쓰는 것 - 임시로 채워넣음 추후  + 이거 /이거 슬래쉬 어디 넣을지 고민

// 전체 일기 목록 가져오기
app.get("/api/diary", async (req: Request, res: Response) => {
  try {
    const files = await fs.promises.readdir(directoryPath);
    const markdownFiles = files.filter(
      (file: string) => path.extname(file) === ".md"
    );

    const diaryList = await Promise.all(
      markdownFiles.map(async (file: string) => {
        const filePath = path.join(directoryPath, file);
        const stats = await fs.promises.stat(filePath);
        const createdAt = stats.birthtime;
        const data = await fs.promises.readFile(filePath, "utf8");

        return {
          title: file,
          content: data,
          createdAt: createdAt,
        };
      })
    );

    res.send(diaryList);
  } catch (err) {
    console.error("일기 목록을 불러오는 동안 오류가 발생했습니다", err);
    res.status(500).send("일기 목록을 불러오는 동안 오류가 발생했습니다");
  }
});

// 일기 하나 불러오기 -> 페이지용 파일 하나
app.get("/api/:encodedTitle", async (req: Request, res: Response) => {
  const encodedTitle = req.params.encodedTitle; //추후 .md 어떻게 되는지 지켜봐야해
  const title = decodeURIComponent(encodedTitle);
  const filePath = directoryPath + "/" + title + ".md";

  try {
    const stats = await fs.promises.stat(filePath);
    const createdAt = stats.birthtime;
    const data = await fs.promises.readFile(filePath, "utf8");

    const diary = {
      title: title,
      content: data,
      createdAt: createdAt,
    };
    res.send(diary);
  } catch (err) {
    console.error("일기를 불러오는데 오류가 발생했습니다", err);
    res.status(500).send("일기를 불러오는데 오류가 발생했습니다");
  }
});

// 일기 수정용(put) -> 테스트 필요
app.put("/api/:encodedTitle", async (req: Request, res: Response) => {
  const encodedTitle = req.params.encodedTitle;
  const decodedTitle = decodeURIComponent(encodedTitle);

  const { title, content } = req.body;

  const oldFilePath = directoryPath + decodedTitle + ".md";
  const newFilePath = directoryPath + title + ".md";

  fs.rename(oldFilePath, newFilePath, (err: Error) => {
    if (err) {
      console.error("일기 제목을 변경하는 도중에 오류가 발생했습니다", err);
      res.status(500).send("일기 제목을 변경하는 중에 오류가 발생했습니다.");
    }
    return;
  });

  fs.writeFile(newFilePath, `${content}`, (err: Error) => {
    if (err) {
      console.error("일기 내용을 수정하는 도중에 오류가 발생했습니다", err);
      res.status(500).send("일기 내용을 수정하는 도중에 오류가 발생했습니다.");
    }
    return
  })
});

// 일기 삭제용(delete) -> 테스트 필요
app.delete("/api/:encodedTitle", async (req: Request, res: Response) => {
  const encodedTitle = req.params.encodedTitle;
  const decodedTitle = decodeURIComponent(encodedTitle);
  const filePath = directoryPath + decodedTitle + ".md";

  fs.unlink(filePath, (err:Error) => {
    if (err) {
      console.error("서버에서 일기 파일 삭제를 실패했습니다.", err);
    }
  });
  res.status(200).send("성공적으로 파일을 삭제했습니다.");

});

// 일기 작성용
app.post("/api/write", async (req: Request, res: Response) => {

  const { title, content } = req.body;

  // 제목과 내용 존재 여부 확인
  if (!title || !content) {
    return res.status(400).send("제목과 내용을 모두 입력해주세요.");
  }

  // 파일과 이름 설정
  const fileName = `${title}.md`;
  const filePath = directoryPath + "/" + fileName //이거 슬래쉬 그어야할지 모르겠다!

  fs.writeFile(filePath, content, (err: Error) => {
    if (err) {
      console.error("일기 파일을 저장하는데 실패했습니다", err);
    } 
  })
  res.status(200).send("성공적으로 일기 파일을 저장했습니다.");
}) 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
