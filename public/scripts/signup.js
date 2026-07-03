import { showToast, getUsers, getUserByUserName,submitUser } from "../modules/utils.js";

const form = document.querySelector("form");
const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal p");
const tickIcon = document.querySelector(".tick-icon");
const closeIcon = document.querySelector(".close-menu");
const realNameInput = document.getElementById("realname");
const userNameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const emailInput = document.getElementById("email");
const submitBtn = document.querySelector(".submit-btn");

let acceptLogin = false;

function registrationConditions(event) {
  event.preventDefault()
  let userNameWordsIsAllow = false;
  let passwordWordsIsAllow = false;
  let notValid = false
  acceptLogin = false;
  const allowedCharacters = "abcdefghijklmnopqrstuvwxyz1234567890._"
  const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gi;

  const realName = realNameInput.value.trim();
  const userName = userNameInput.value.trim();
  const password = passwordInput.value.trim();
  const email = emailInput.value.trim();
  
  realNameInput.value = realName;
  userNameInput.value = userName;
  passwordInput.value = password;
  emailInput.value = email;


  for (let i = 0; i < password.length; i++) {
    passwordWordsIsAllow = allowedCharacters.split("").some(function (words) {
      return words === password[i].toLowerCase();
    });
    if (!passwordWordsIsAllow) {
      notValid = true;
    }
  }

  for (let i = 0; i < userName.length; i++) {
    userNameWordsIsAllow = allowedCharacters.split("").some(function (words) {
      return words === userName[i].toLowerCase();
    });
    if (!userNameWordsIsAllow) {
      notValid = true;
    }
  }

  if (realName.length < 10 || realName.length > 20) {
    showToast("نام کامل باید بین 10 تا 20 نویسه باشد", "failed");
  } else if (realName.split(" ").length !== 2) {
    showToast("نام کامل باید شامل نام و نام خانوادگی باشد", "failed");
  } else if (userName.length < 4 || userName.length > 13) {
    showToast("نام کاربری باید بین 4 تا 13 کاراکتر باشد", "failed");
  } else if (getUserByUserName(userName)) {
    showToast("این نام کاربری قبلا انتخاب شده است","failed")
  } else if (password.length < 6 || password.length > 12) {
    showToast("گذرواژه باید بین 6 تا 12 کاراکتر باشد", "failed");
  } else if (!emailRegex.test(email)) {
    showToast("لطفا ایمیل صحیح وارد کنید", "failed");
  } else if (notValid) {
    showToast(
      "حروف انگلیسی ، اعداد ، ( . ) و ( _ ) نویسه های مجاز هستند",
      "failed",
    );
  } else {
    submitUser(realName, userName, password, email);
  }
}

submitBtn.addEventListener("click", registrationConditions);
window.addEventListener("load",getUsers)