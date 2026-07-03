const data = { users: undefined, foods: undefined };
const api = `https://fra.cloud.appwrite.io/v1/databases/6a1eb75f00344c477b0a/collections/`;
const apiHeader = {
  "content-type": "application/json",
  "X-Appwrite-Project": "6a1eb72e0017c3590cbd",
};
let inKickPage = false;

const getUsers = async () => {
  const apiKey = `${api}users/documents/`;
  const response = await fetch(apiKey, { headers: apiHeader });
  
  if (response.ok) {
    data.users = await response.json();
  }
};

const getUserById = (id) => {
  const user = data.users.documents.find((info) => info.$id === id);
  return user;
};

const getUserByUserName = (userName) => {
  const user = data.users.documents.find((info) => info.userName === userName);
  return user;
};

const getFoods = async () => {
  const apiKey = `${api}foods/documents/`;
  const response = await fetch(apiKey, { headers: apiHeader });
  if (response.ok) {
    data.foods = await response.json();
  }
};

function closeToast(timer, toast) {
  clearInterval(timer);
  toast.classList.remove("show");
  toast.classList.add("hidden");

  setTimeout(() => {
    toast.remove();
    inKickPage ? location.assign("http://kick") : "";
  }, 520);
}

function kick() {
  document.body.innerHTML = "<div class='toast-wrapper'></div>";
  inKickPage = true;
  showToast("شما به دلیل اسپم از سایت کیک شدید", "failed");
}

function showToast(action, type) {
  if (document.querySelectorAll(".toast").length < 5 || inKickPage) {
    document.querySelector(`audio.${type}`)?.play();
    const toastWrapper = document.querySelector(".toast-wrapper");
    const randomId = Math.floor(Math.random() * 83591);
    toastWrapper.insertAdjacentHTML(
      "beforeend",
      `
      <div id="toast-${randomId}" class="toast ${type}">
        <i class="ui-border top-0"></i>
        <span class="icon-card">
          <span class="icon"></span>
        </span>
        <span class="toast-content">${action}</span>
  
        <div class="process-bar">
          <div class="process"></div>
        </div>
      </div>
    `,
    );
    const thisToast = document.getElementById(`toast-${randomId}`);
    const process = thisToast.querySelector(".process");

    setTimeout(() => {
      thisToast.classList.add("show");
    }, 1);
    let step = 99;
    const timer = setInterval(() => {
      process.style.width = `${step}%`;
      step--;
      if (step < 0) {
        closeToast(timer, thisToast);
      }
    }, 30);
    thisToast.addEventListener("click", () => closeToast(timer, thisToast));
  } else {
    kick();
  }
}

async function submitUser(realName, userName, password, email, admin) {
  const apiKey = `${api}users/documents`;
  const user = {
    documentId: "unique()",
    data: {
      realName,
      userName,
      password,
      email,
    },
  };
  const response = await fetch(apiKey, {
    method: "POST",
    headers: apiHeader,
    body: JSON.stringify(user),
  });
  if (response.ok && admin) {
    showToast("کاربر جدید با موفقیت ایجاد شد", "success");
  } else if (response.ok && !admin) {
    localStorage.setItem("firstSignUp", "true");
    localStorage.setItem("userName", userName);
    localStorage.setItem("password", password);
    location.replace("../signin");
  }
}

function categoryToPersian(food) {
  const value =
    food.category === "sandwich"
      ? "ساندویچ"
      : food.category === "drink"
        ? "نوشیدنی"
        : food.category === "dessert"
          ? "دسر"
          : food.category === "toast"
            ? "سوخاری"
            : "";
  return value;
}

export {
  data,
  api,
  apiHeader,
  getUsers,
  getUserById,
  getUserByUserName,
  getFoods,
  showToast,
  submitUser,
  categoryToPersian,
};
