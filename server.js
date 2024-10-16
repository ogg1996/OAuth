require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

const {
  KAKAO_CLIENT_ID,
  NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET,
  NAVER_STATE,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI,
} = process.env;

app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["OPTIONS", "POST", "DELETE"],
  })
);

app.use(express.json());

// kakao
app.post("/kakao/login", (req, res) => {
  const authorizationCode = req.body.authorizationCode;
  axios
    .post(
      "https://kauth.kakao.com/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: KAKAO_CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        code: authorizationCode,
      },
      {
        headers: {
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    )
    .then((response) => res.send(response.data.access_token));
});

app.post("/kakao/userInfo", (req, res) => {
  const { kakaoAccessToken } = req.body;
  axios
    .get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    })
    .then((response) => res.json(response.data.properties));
});

app.delete("/kakao/logout", (req, res) => {
  const { kakaoAccessToken } = req.body;
  axios
    .get("https://kapi.kakao.com/v1/user/logout", {
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
      },
    })
    .then(() => res.send("카카오 로그아웃"));
});

// naver
app.post("/naver/login", (req, res) => {
  const authorizationCode = req.body.authorizationCode;
  axios
    .post(
      `https://nid.naver.com/oauth2.0/token?client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&grant_type=authorization_code&state=${NAVER_STATE}&code=${authorizationCode}`
    )
    .then((response) => res.send(response.data.access_token));
});

app.post("/naver/userInfo", (req, res) => {
  const { naverAccessToken } = req.body;
  axios
    .get("https://openapi.naver.com/v1/nid/me", {
      headers: {
        Authorization: `Bearer ${naverAccessToken}`,
      },
    })
    .then((response) => res.json(response.data.response));
});

app.delete("/naver/logout", (req, res) => {
  const { naverAccessToken } = req.body;
  axios
    .get(
      `https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=${naverClientId}&client_secret=${naverClientSecret}&access_token=${naverAccessToken}&service_provider=NAVER`
    )
    .then(() => res.send("네이버 로그아웃"));
});

// google
app.post("/google/login", (req, res) => {
  const authorizationCode = req.body.authorizationCode;
  axios
    .post(
      "https://oauth2.googleapis.com/token",
      {
        grant_type: "authorization_code",
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code: authorizationCode,
      },
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    )
    .then((response) => res.send(response.data.access_token));
});

app.post("/google/userInfo", (req, res) => {
  const { googleAccessToken } = req.body;
  axios
    .get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${googleAccessToken}`,
      },
    })
    .then((response) => res.json(response.data));
});

app.listen(3000, () => {
  console.log("서버 열림");
});
