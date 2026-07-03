import {
  data,
  getUsers,
  getUserById,
  getFoods,
  showToast,
  categoryToPersian,
} from "../modules/utils.js";

let menuIcon = document.querySelector(".menu-icon");
let closeIcon = document.querySelector(".close-menu");
let menu = document.querySelector(".menu");
const categoryBtns = document.querySelectorAll(".button-category");
const menuProducts = document.querySelector(".menu-products");
let alertSite = document.querySelector(".alert");
let cross = document.querySelector(".cross");
const menuItemLinks = document.querySelectorAll(".menu-item_link");
const numberButtonLeft = document.querySelector(".content-left_price");
const buttonRightOrder = document.querySelector(".button-right_order");
const buttonLeftOrder = document.querySelector(".button-left");
const buttonWrappPlusAndMinus = document.querySelectorAll(".button-wrapp_plus");
const progressBar = document.querySelector(".progress");
const contentLinksMenu = document.querySelectorAll(".content-links_menu li a");
const buttonWrapper = document.querySelector(".button-wrapper");
const saleOffMain = document.querySelector(".sale-off_main");
const saleOffProducts = document.querySelector(".sale-off_products");
const headerContent = document.querySelector(".header-content");
const buttonSearch = document.querySelector(".button-search");
const cookie = document.cookie;
const id = cookie.split("=")[1];
let user = null;
let go = true;

const checkingSignOut = () => {
  if (localStorage.getItem("signOut")) {
    localStorage.removeItem("signOut");
    showToast("شما از حساب خود خارج شدید", "success");
  }
};

const signOutUser = () => {
  const now = new Date();
  now.setTime(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  document.cookie = `userID=;path=/;expires=${now}`;
  localStorage.removeItem("basket");
  localStorage.setItem("signOut", "true");
  location.reload();
};

window.signOutUser = signOutUser;
const checkFirstLogin = () => {
  if (localStorage.getItem("firstLogin")) {
    localStorage.removeItem("firstLogin");
    showToast("ورود موفقیت آمیز", "success");
  }
};

const checkingUserIsLogin = () => {
  if (cookie.includes("userID")) {
    buttonWrapper.innerHTML = `
       <div class="user-box">

          <div class="welcome-box">
              <svg fill="#FFC300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M256 112c-48.6 0-88 39.4-88 88C168 248.6 207.4 288 256 288s88-39.4 88-88C344 151.4 304.6 112 256 112zM256 240c-22.06 0-40-17.95-40-40C216 177.9 233.9 160 256 160s40 17.94 40 40C296 222.1 278.1 240 256 240zM256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-46.73 0-89.76-15.68-124.5-41.79C148.8 389 182.4 368 220.2 368h71.69c37.75 0 71.31 21.01 88.68 54.21C345.8 448.3 302.7 464 256 464zM416.2 388.5C389.2 346.3 343.2 320 291.8 320H220.2c-51.36 0-97.35 26.25-124.4 68.48C65.96 352.5 48 306.3 48 256c0-114.7 93.31-208 208-208s208 93.31 208 208C464 306.3 446 352.5 416.2 388.5z" />
              </svg>

              <h1>
                  ${user.userName}
              </h1>
          </div>

          <a class="log-out_link" onclick="signOutUser()">
              <div class="log-out_items">

                  <svg fill="#FFC300"
                       xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 256 256">

                      <g fill="#fff6a3"
                         transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">

                          <path d="M86.356 46.27c0.031-0.065 0.059-0.131 0.085-0.199c0.042-0.11 0.076-0.222 0.104-0.336c0.016-0.062 0.034-0.123 0.046-0.186c0.034-0.181 0.055-0.364 0.055-0.548s-0.022-0.367-0.055-0.548c-0.012-0.064-0.03-0.124-0.046-0.186c-0.029-0.114-0.062-0.226-0.104-0.336c-0.026-0.068-0.055-0.134-0.086-0.199c-0.046-0.099-0.099-0.194-0.156-0.288c-0.039-0.063-0.077-0.126-0.12-0.186c-0.02-0.027-0.033-0.057-0.054-0.084L74.316 27.93c-1.009-1.313-2.894-1.561-4.207-0.551c-1.313 1.009-1.561 2.893-0.551 4.207L77.56 42H30.903c-1.657 0-3 1.343-3 3s1.343 3 3 3h46.656l-8.001 10.414c-1.01 1.314-0.763 3.197 0.551 4.207c0.545 0.419 1.188 0.621 1.826 0.621c0.9 0 1.79-0.403 2.381-1.172l11.71-15.242c0.021-0.027 0.035-0.057 0.055-0.085c0.043-0.06 0.08-0.122 0.119-0.184C86.257 46.464 86.31 46.369 86.356 46.27z"/>

                          <path d="M60.442 90H9.353c-1.657 0-3-1.343-3-3V3c0-1.657 1.343-3 3-3h51.089c1.657 0 3 1.343 3 3v30.054c0 1.657-1.343 3-3 3s-3-1.343-3-3V6H12.353v78h45.089V55.61c0-1.657 1.343-3 3-3s3 1.343 3 3V87c0 1.657-1.342 3-3 3z"/>
                      </g>

                  </svg>

                  <p>خروج</p>

              </div>
          </a>

      </div> 
    `;
    menu.insertAdjacentHTML(
      "beforeend",
      `
          <button class="user-basket" onclick="openBasket(event)">
              <i class="bx bx-basket"></i>
          </button>
        `,
    );
    document.querySelector("title").innerHTML =
      `مک دونالد - حساب ${user.userName}`;
  }
};

const checkingUserIsAdmin = () => {
  if (user?.isAdmin === "true") {
    menu.insertAdjacentHTML(
      "beforeend",
      `
        <li class="menu-item">
            <a data-value="contact" class="menu-item_link" href="./../admin/" target="_blank">پنل ادمین</a>
        </li>
      `,
    );
  }
};

const startingOperation = async () => {
  await getUsers();
  await getFoods();
  checkFirstLogin();
  checkingSignOut();
  user = getUserById(id);
  await checkingUserIsAdmin();
  checkingUserIsLogin();

  const foods = data.foods.documents;
  buttonWrappPlusAndMinus.forEach((buttonWrappPlusOrMinus) => {
    buttonWrappPlusOrMinus.setAttribute("data-id", foods[0].$id);
  });
  let lastetFoods = null;
  if (foods.length > 3) {
    lastetFoods = foods.slice(foods.length - 3, foods.length);
  } else if (foods.length <= 3 && foods.length > 0) {
    lastetFoods = foods;
  }
  showFoods(foods);
  showLastetFoods(lastetFoods);
};

const mainMenu = document.querySelector(".main-menu");
const mobileAppMain = document.querySelector(".mobile-app_main");
const searchLocationMain = document.querySelector(".search-location_main");

document.addEventListener("scroll", function () {
  let event;

  if (
    document.documentElement.scrollTop >= mainMenu.offsetTop &&
    document.documentElement.scrollTop <= saleOffMain.offsetTop
  ) {
    event = document.querySelector("[data-value='menu']");
  } else if (
    document.documentElement.scrollTop >= saleOffMain.offsetTop &&
    document.documentElement.scrollTop <= mobileAppMain.offsetTop
  ) {
    event = document.querySelector("[data-value='sale']");
  } else if (
    document.documentElement.scrollTop >= mobileAppMain.offsetTop &&
    document.documentElement.scrollTop <= searchLocationMain.offsetTop
  ) {
    event = document.querySelector("[data-value='news']");
  } else if (
    document.documentElement.scrollTop >= searchLocationMain.offsetTop
  ) {
    event = document.querySelector("[data-value='contact']");
  } else if (document.documentElement.scrollTop >= 0) {
    event = document.querySelector("[data-value='main']");
  }
  if (go) {
    changeSelectedMenu(event);
  } else {
    go = true;
  }

  progressBar.style.width = `${(document.documentElement.scrollTop / (document.documentElement.offsetHeight - document.documentElement.clientHeight)) * 100}%`;
});

function changeSelectedMenu(event) {
  const beforeSelected = document.querySelector(".menu-item_link.red-color");
  beforeSelected ? beforeSelected.classList.remove("red-color") : "";

  event ? event.classList.add("red-color") : "";
}

function scrollTo(event) {
  if (event.target.closest("a").innerHTML !== "پنل ادمین") {
    event.preventDefault();
  }
  if (event.target.closest("a").innerHTML.trim() === "منو") {
    document.documentElement.scrollTo(0, mainMenu.offsetTop);
  } else if (event.target.closest("a").innerHTML.trim() === "فروش") {
    document.documentElement.scrollTo(0, saleOffMain.offsetTop);
  } else if (event.target.closest("a").innerHTML.trim() === "اخبار") {
    document.documentElement.scrollTo(0, mobileAppMain.offsetTop);
  } else if (event.target.closest("a").innerHTML.trim() === "تماس") {
    document.documentElement.scrollTo(0, searchLocationMain.offsetTop);
  } else if (event.target.closest("a").innerHTML.trim() === "صفحه اصلی") {
    document.documentElement.scrollTo(0, 0);
  }
}

function changeLocationPage(event) {
  changeSelectedMenu(event.target.closest("a"));
  go = false;

  scrollTo(event);
}

menuItemLinks.forEach(function (menuItemLink) {
  menuItemLink.addEventListener("click", changeLocationPage);
});

try {
  cross.addEventListener("click", function () {
    alertSite.style.top = "-800px";
  });
} catch {
  ("");
}

menuIcon.addEventListener("click", function () {
  menu.style.right = "0px";
  menuIcon.style.display = "none";
  closeIcon.style.display = "block";
});
closeIcon.addEventListener("click", function () {
  menu.style.right = "-250px";
  menuIcon.style.display = "block";
  closeIcon.style.display = "none";
});

const showFoods = (foods) => {
  menuProducts.innerHTML = "";
  if (foods.length) {
    foods.forEach((food) => {
      const price = +food.price;
      menuProducts.insertAdjacentHTML(
        "beforeend",
        `<div class="menu-product_item">
  
              <div class="menu-product_image">
                  <img src="${food.imageLink}">
                  <div class="product-rectangle"></div>
              </div>
  
              <div class="menu-product_info">
                  <h5 class="product-info_title">
                                      ${food.title}
                  </h5>
                  <p class="product-info_text">
                                      ${food.description}
                  </p>
                  <div class="product-info_stars">
                      <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.04894 0.927052C9.3483 0.00574112 10.6517 0.00573993 10.9511 0.927051L12.4697 5.60081C12.6035 6.01284 12.9875 6.2918 13.4207 6.2918H18.335C19.3037 6.2918 19.7065 7.53141 18.9228 8.10081L14.947 10.9894C14.5966 11.244 14.4499 11.6954 14.5838 12.1074L16.1024 16.7812C16.4017 17.7025 15.3472 18.4686 14.5635 17.8992L10.5878 15.0106C10.2373 14.756 9.7627 14.756 9.41221 15.0106L5.43648 17.8992C4.65276 18.4686 3.59828 17.7025 3.89763 16.7812L5.41623 12.1074C5.55011 11.6954 5.40345 11.244 5.05296 10.9894L1.07722 8.10081C0.293507 7.53141 0.696283 6.2918 1.66501 6.2918H6.57929C7.01252 6.2918 7.39647 6.01284 7.53035 5.60081L9.04894 0.927052Z" fill="#FFC300"></path>
                      </svg>
                      <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.04894 0.927052C9.3483 0.00574112 10.6517 0.00573993 10.9511 0.927051L12.4697 5.60081C12.6035 6.01284 12.9875 6.2918 13.4207 6.2918H18.335C19.3037 6.2918 19.7065 7.53141 18.9228 8.10081L14.947 10.9894C14.5966 11.244 14.4499 11.6954 14.5838 12.1074L16.1024 16.7812C16.4017 17.7025 15.3472 18.4686 14.5635 17.8992L10.5878 15.0106C10.2373 14.756 9.7627 14.756 9.41221 15.0106L5.43648 17.8992C4.65276 18.4686 3.59828 17.7025 3.89763 16.7812L5.41623 12.1074C5.55011 11.6954 5.40345 11.244 5.05296 10.9894L1.07722 8.10081C0.293507 7.53141 0.696283 6.2918 1.66501 6.2918H6.57929C7.01252 6.2918 7.39647 6.01284 7.53035 5.60081L9.04894 0.927052Z" fill="#FFC300"></path>
                      </svg>
                      <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.04894 0.927052C9.3483 0.00574112 10.6517 0.00573993 10.9511 0.927051L12.4697 5.60081C12.6035 6.01284 12.9875 6.2918 13.4207 6.2918H18.335C19.3037 6.2918 19.7065 7.53141 18.9228 8.10081L14.947 10.9894C14.5966 11.244 14.4499 11.6954 14.5838 12.1074L16.1024 16.7812C16.4017 17.7025 15.3472 18.4686 14.5635 17.8992L10.5878 15.0106C10.2373 14.756 9.7627 14.756 9.41221 15.0106L5.43648 17.8992C4.65276 18.4686 3.59828 17.7025 3.89763 16.7812L5.41623 12.1074C5.55011 11.6954 5.40345 11.244 5.05296 10.9894L1.07722 8.10081C0.293507 7.53141 0.696283 6.2918 1.66501 6.2918H6.57929C7.01252 6.2918 7.39647 6.01284 7.53035 5.60081L9.04894 0.927052Z" fill="#FFC300"></path>
                      </svg><svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.04894 0.927052C9.3483 0.00574112 10.6517 0.00573993 10.9511 0.927051L12.4697 5.60081C12.6035 6.01284 12.9875 6.2918 13.4207 6.2918H18.335C19.3037 6.2918 19.7065 7.53141 18.9228 8.10081L14.947 10.9894C14.5966 11.244 14.4499 11.6954 14.5838 12.1074L16.1024 16.7812C16.4017 17.7025 15.3472 18.4686 14.5635 17.8992L10.5878 15.0106C10.2373 14.756 9.7627 14.756 9.41221 15.0106L5.43648 17.8992C4.65276 18.4686 3.59828 17.7025 3.89763 16.7812L5.41623 12.1074C5.55011 11.6954 5.40345 11.244 5.05296 10.9894L1.07722 8.10081C0.293507 7.53141 0.696283 6.2918 1.66501 6.2918H6.57929C7.01252 6.2918 7.39647 6.01284 7.53035 5.60081L9.04894 0.927052Z" fill="#FFC300"></path>
                      </svg><svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.04894 0.927052C9.3483 0.00574112 10.6517 0.00573993 10.9511 0.927051L12.4697 5.60081C12.6035 6.01284 12.9875 6.2918 13.4207 6.2918H18.335C19.3037 6.2918 19.7065 7.53141 18.9228 8.10081L14.947 10.9894C14.5966 11.244 14.4499 11.6954 14.5838 12.1074L16.1024 16.7812C16.4017 17.7025 15.3472 18.4686 14.5635 17.8992L10.5878 15.0106C10.2373 14.756 9.7627 14.756 9.41221 15.0106L5.43648 17.8992C4.65276 18.4686 3.59828 17.7025 3.89763 16.7812L5.41623 12.1074C5.55011 11.6954 5.40345 11.244 5.05296 10.9894L1.07722 8.10081C0.293507 7.53141 0.696283 6.2918 1.66501 6.2918H6.57929C7.01252 6.2918 7.39647 6.01284 7.53035 5.60081L9.04894 0.927052Z" fill="#FFC300"></path>
                      </svg>
                      <span class="product-info_number">
                          (5)
                      </span>
  
                  </div>
                  <div class="product-info_sale">
  
                      <span class="info-sale_money">
                                          ${price.toLocaleString()}
                      </span>
  
                      <button data-id="${food.$id}" class="info-sale_button" id="button" onclick="addToBasket(event)">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M5.9963 12C5.344 12 4.86633 12.6144 5.02717 13.2466L6.42488 18.7398C6.76319 20.0693 7.96032 21 9.33225 21H14.6652C16.0383 21 17.2362 20.0678 17.5734 18.7367L18.9644 13.2456C19.1245 12.6137 18.6469 12 17.9951 12H5.9963ZM9 16C9 15.4477 9.44771 15 10 15C10.5523 15 11 15.4477 11 16V17C11 17.5523 10.5523 18 10 18C9.44771 18 9 17.5523 9 17V16ZM13 16C13 15.4477 13.4477 15 14 15C14.5523 15 15 15.4477 15 16V17C15 17.5523 14.5523 18 14 18C13.4477 18 13 17.5523 13 17V16Z" fill="#fff"></path>
                              <path d="M3 9C3 8.44772 3.44772 8 4 8H20C20.5523 8 21 8.44772 21 9C21 9.55228 20.5523 10 20 10H4C3.44772 10 3 9.55228 3 9Z" fill="#fff"></path>
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.7071 4.70711C11.0976 4.31658 11.0976 3.68342 10.7071 3.29289C10.3166 2.90237 9.68342 2.90237 9.29289 3.29289L8.29289 4.29289C7.90237 4.68342 7.90237 5.31658 8.29289 5.70711C8.68342 6.09763 9.31658 6.09763 9.70711 5.70711L10.7071 4.70711ZM13.2929 4.70711C12.9024 4.31658 12.9024 3.68342 13.2929 3.29289C13.6834 2.90237 14.3166 2.90237 14.7071 3.29289L15.7071 4.29289C16.0976 4.68342 16.0976 5.31658 15.7071 5.70711C15.3166 6.09763 14.6834 6.09763 14.2929 5.70711L13.2929 4.70711Z" fill="#fff"></path>
                          </svg>
                      </button>
                  </div>
              </div>
           </div>`,
      );
    });
  } else {
    menuProducts.innerHTML = `<div class="message-box">
                                <div class="icon">
                                  <i class="fas fa-close"></i>
                                </div>
                                <p>در حال حاضر موردی موجود نمی‌باشد.</p>
                              </div>`;
  }
};

function showLastetFoods(lastetFoods) {
  saleOffProducts.innerHTML = "";
  if (lastetFoods) {
    lastetFoods.forEach((food) => {
      const foodPrice = +food.price;
      const foodCategory = categoryToPersian(food);
      saleOffProducts.insertAdjacentHTML(
        "beforeend",
        `
          <div class="sale-off_item" id="button" data-id="${food.$id}" onclick="addToBasket(event);">
            <div class="off-item_title">
              <span class="off-title_text"> ${foodCategory} </span>
              <span class="off-title_border"></span>
            </div>
  
            <div class="content-sale_item">
              <div class="content-sale_left">
                <div class="content-sale_info">
                  <h1 class="sale-info_title">${food.title}</h1>
                  <p class="sale-info_text">${food.description}</p>
                  <div class="sale-info_prices">
                    <span class="price-main_info"> ${foodPrice.toLocaleString()} </span>
                  </div>
                </div>
                <button class="content-sale_button">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.9963 12C5.344 12 4.86633 12.6144 5.02717 13.2466L6.42488 18.7398C6.76319 20.0693 7.96032 21 9.33225 21H14.6652C16.0383 21 17.2362 20.0678 17.5734 18.7367L18.9644 13.2456C19.1245 12.6137 18.6469 12 17.9951 12H5.9963ZM9 16C9 15.4477 9.44771 15 10 15C10.5523 15 11 15.4477 11 16V17C11 17.5523 10.5523 18 10 18C9.44771 18 9 17.5523 9 17V16ZM13 16C13 15.4477 13.4477 15 14 15C14.5523 15 15 15.4477 15 16V17C15 17.5523 14.5523 18 14 18C13.4477 18 13 17.5523 13 17V16Z" fill="#F1F1F1"></path>
                    <path d="M3 9C3 8.44772 3.44772 8 4 8H20C20.5523 8 21 8.44772 21 9C21 9.55228 20.5523 10 20 10H4C3.44772 10 3 9.55228 3 9Z" fill="#F1F1F1"></path>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.7071 4.70711C11.0976 4.31658 11.0976 3.68342 10.7071 3.29289C10.3166 2.90237 9.68342 2.90237 9.29289 3.29289L8.29289 4.29289C7.90237 4.68342 7.90237 5.31658 8.29289 5.70711C8.68342 6.09763 9.31658 6.09763 9.70711 5.70711L10.7071 4.70711ZM13.2929 4.70711C12.9024 4.31658 12.9024 3.68342 13.2929 3.29289C13.6834 2.90237 14.3166 2.90237 14.7071 3.29289L15.7071 4.29289C16.0976 4.68342 16.0976 5.31658 15.7071 5.70711C15.3166 6.09763 14.6834 6.09763 14.2929 5.70711L13.2929 4.70711Z" fill="#F1F1F1"></path>
                  </svg>
                  <span class="sale-button_title"> اکنون بخرید </span>
                </button>
              </div>
              <div class="content-sale_right">
                <img class="content-sale_image" src="${food.imageLink}">
              </div>
            </div>
            </div>
        `,
      );
    });
  } else {
    saleOffMain.remove();
  }
}

function setCategory(event) {
  const beforeBtnSelected = document.querySelector(".button-category.selected");
  beforeBtnSelected.classList.remove("selected");

  event.target.closest("button").classList.add("selected");
  const category = event.target.closest("button").dataset.category;
  if (category === "all") {
    showFoods(data.foods.documents);
  } else {
    const searchedFoods = data.foods.documents.filter(
      (food) => food.category === category,
    );
    showFoods(searchedFoods);
  }
}

categoryBtns.forEach(function (categoryBtn) {
  categoryBtn.addEventListener("click", setCategory);
});

contentLinksMenu.forEach(function (contentLinkMenu) {
  contentLinkMenu.addEventListener("click", scrollTo);
});

window.addEventListener("load", startingOperation);
buttonSearch.addEventListener("click", (event) => {
  event.preventDefault();
  showToast("این قابلیت هنوز در دسترس نیست", "failed");
});
