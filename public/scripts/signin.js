import {
  data,
  getUsers,
  getUserByUserName,
  showToast,
} from "../modules/utils.js";

const form = document.getElementById("signup");
const modal = document.querySelector(".modal");
const errorTitle = document.querySelector(".modal p");
const submitBtn = document.querySelector(".submit-btn");
const userNameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");

const getDate = () => {
  const date = new Date();
  date.setTime(date.getTime() + 2 * 24 * 60 * 60 * 1000);
  return date;
};

const logining = (id) => {
  const now = getDate();
  document.cookie = `userID=${id};path=/;expires=${now}`;
  localStorage.setItem("firstLogin", "true");
  location.replace("/");
};

const checkForLogin = (event) => {
  event.preventDefault();
  const userNameInputValue = userNameInput.value;
  const passwordInputValue = passwordInput.value;
  const user = getUserByUserName(userNameInputValue);
  if (userNameInputValue === "" || passwordInputValue === "") {
    showToast("لطفا مقادیر را معتبر وارد نمائید", "failed");
  } else if (user && user?.password !== passwordInputValue) {
    showToast("گذرواژه وارد شده اشتباه است", "failed");
  } else if (!user) {
    showToast("این نام کاربری وجود نداشته و اشتباه است", "failed");
  } else if (document.cookie.split("=")[1] === user.$id) {
    showToast(
      "شما هم اکنون از <a style='color: #0095ff;' href='/'>این حساب</a> استفاده میکنید",
      "failed",
    );
  } else if (document.cookie.includes("userID")) {
    showToast(
      "ابتدا از حساب فعلی خود <a style='color: #0095ff;' href='/'>خارج شوید</a>",
      "failed",
    );
  } else if (user && user?.password === passwordInputValue) {
    logining(user.$id);
  }
};

const startingOperation = () => {
  getUsers();
  if (localStorage.getItem("firstSignUp")) {
    const userName = localStorage.getItem("userName");
    const password = localStorage.getItem("password");
    localStorage.removeItem("firstSignUp");
    localStorage.removeItem("userName");
    localStorage.removeItem("password");
    showToast("حساب کاربری شما ایجاد شد", "success");
    userNameInput.value = userName;
    passwordInput.value = password;
  }
};

submitBtn.addEventListener("click", checkForLogin);
window.addEventListener("load", startingOperation);
