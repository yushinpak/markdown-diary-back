// const express = require("express");
// const fs = require("fs");
// const cors = require("cors");
// const path = require("path");
// const bodyParser = require("body-parser");

// const app = express();

// // let directoryPath = ""; // 일기가 담기는 곳
// let directoryPath = "/Users/using/Desktop/Sing/2. Area/Arrow"; // 일기가 담기는 곳 - 내가 현재 쓰는 것 - 임시로 채워넣음 추후

// app.use(cors());
// app.use(bodyParser.json());

// // 전체 일기 목록 가져오기
// app.get("/diary", (req: Request, res: Response) => {
//   fs.readdir(directoryPath, (err: NodeJS.ErrnoException, files: string[]) => {
//     if (err) {
//       console.error(
//         "로컬 폴더에서 일기 목록을 불러오는 동안 오류가 발생했습니다.",
//         err
//       );
//       res.status(500).send("로컬 폴더에서 일기 목록을 불러오는 동안 오류가 발생했습니다.");

//       return;
//     }

//     // 파일 목록을 클라이언트에게 응답으로 보냅니다.
//     res.send(files);
//   });
// });
