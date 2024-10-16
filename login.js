require("dotenv").config();

const kakaoLoginBtn = document.getElementById("kakao");
const naverLoginBtn = document.getElementById("naver");
const googleLoginBtn = document.getElementById("google");
const userImg = document.getElementById("user_img");
const userName = document.getElementById("user_name");
const logoutBtn = document.getElementById("logout_button");

const loginBtnContainer = document.getElementById("loginBtn_container");
const userInfoContainer = document.getElementById("userinfo_container");

const {
  KAKAO_CLIENT_ID,
  NAVER_CLIENT_ID,
  GOOGLE_CLIENT_ID,
  NAVER_STATE,
  REDIRECT_URI,
} = process.env;

let kakaoAccessToken = "";
let naverAccessToken = "";
let googleAccessToken = "";

kakaoLoginBtn.onclick = () => {
  localStorage.setItem("curOAuthServie", "kakao");
  location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${redirectURI}&response_type=code`;
};

naverLoginBtn.onclick = () => {
  localStorage.setItem("curOAuthServie", "naver");
  location.href = `https://nid.naver.com/oauth2.0/authorize?client_id=${naverClientId}&response_type=code&redirect_uri=${redirectURI}&state=${naverState}`;
};

googleLoginBtn.onclick = () => {
  localStorage.setItem("curOAuthServie", "google");
  location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectURI}&response_type=code&scope=profile%20email`;
};

logoutBtn.onclick = () => {
  localStorage.removeItem("accessToken");

  // 카카오 로그아웃
  if (localStorage.getItem("curOAuthServie") === "kakao") {
    axios
      .delete("http://localhost:3000/kakao/logout", {
        data: { kakaoAccessToken },
      })
      .then((res) => console.log(res.data));
  }
  // 네이버 로그아웃
  else if (localStorage.getItem("curOAuthServie") === "naver") {
    axios
      .delete("http://localhost:3000/naver/logout", {
        data: { naverAccessToken },
      })
      .then((res) => console.log(res.data));
  }
  // 구글 로그아웃
  else if (localStorage.getItem("curOAuthServie") === "google") {
    localStorage.removeItem("accessToken");
    location.href = "/";
  }
  localStorage.setItem("curOAuthServie", "");
  logoutDisplay();
};

const loginDisplay = (imgUrl, name) => {
  loginBtnContainer.style.display = "none";
  userInfoContainer.style.display = "grid";

  userImg.src = imgUrl;
  userName.textContent = name;
};

const logoutDisplay = () => {
  loginBtnContainer.style.display = "flex";
  userInfoContainer.style.display = "none";

  userImg.src = "";
  userName.textContent = "";
};

window.onload = () => {
  if (localStorage.getItem("curOAuthServie") === "") return;

  const url = new URL(location.href);
  const urlParams = url.searchParams;
  const authorizationCode = urlParams.get("code");

  // 카카오 로그인
  if (localStorage.getItem("curOAuthServie") === "kakao") {
    axios
      .post("http://localhost:3000/kakao/login", { authorizationCode })
      .then((res) => {
        kakaoAccessToken = res.data;
        axios
          .post("http://localhost:3000/kakao/userInfo", { kakaoAccessToken })
          .then((res) => {
            const userData = res.data;
            loginDisplay(userData.profile_image, userData.nickname);
          })
          .catch(() => {
            localStorage.setItem("curOAuthServie", "");
          });
      });
  }
  // 네이버 로그인
  else if (localStorage.getItem("curOAuthServie") === "naver") {
    axios
      .post("http://localhost:3000/naver/login", { authorizationCode })
      .then((res) => {
        naverAccessToken = res.data;
        axios
          .post("http://localhost:3000/naver/userInfo", {
            naverAccessToken,
          })
          .then((res) => {
            const userData = res.data;
            loginDisplay(userData.profile_image, userData.name);
          });
      });
  }
  // 구글 로그인
  else if (localStorage.getItem("curOAuthServie") === "google") {
    axios
      .post("http://localhost:3000/google/login", { authorizationCode })
      .then((res) => {
        googleAccessToken = res.data;
        axios
          .post("http://localhost:3000/google/userInfo", {
            googleAccessToken,
          })
          .then((res) => {
            const userData = res.data;
            loginDisplay(userData.picture, userData.name);
          });
      });
  }
};
