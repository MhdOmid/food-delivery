import { data, getFoods, showToast } from "../modules/utils.js";

const userBasketBtn = document.querySelector(".user-basket");
const basketScreenDropAll = document.querySelector(".basket-screen-dropall");
const basketScreenDrop = document.querySelector(".basket-screen-drop");
const basketScreen = document.querySelector(".basket-screen");
const closeBasketBtn = document.querySelector(".close-basket-btn");
const basketWrapper = document.querySelector(".basket");
const basketText = document.querySelector(".basket p");
const finalPrice = document.querySelector(".final-price");
const trashBasket = document.querySelector(".trash-basket");
const buyBasketBtn = document.querySelector(".buy-basket-btn");
const miniBasket = document.querySelector(".mini-basket");
const menu = document.querySelector(".menu");

window.addToBasket = addToBasket;
window.plusFood = plusFood;
window.minusFood = minusFood;
window.openBasket = openBasket;
window.transferId = transferId;
window.hideTrash = hideTrash;
window.preventOver = preventOver;
window.hoverDrop = hoverDrop;
window.unHoverDrop = unHoverDrop;
window.getFoodId = getFoodId;
window.deleteFood = deleteFood;
window.openProFoodBasket = openProFoodBasket;

let userBasket = [];
let showingMiniBasket;
let secondCounter = 0;
let opened = false;

function matchingFoodBasket() {
  return userBasket.find((food) => {
    return food.$id === data.foods.documents[0].$id;
  });
}

function getBasketInLocalStorage() {
  const localBasket = JSON.parse(localStorage.getItem("basket"));
  if (localBasket) {
    if (localBasket.length) {
      userBasket = localBasket;
      insertFood();
      calcPrice();
    } else {
      basketWrapper.innerHTML = `<p style="color: white;">سبد خرید شما خالی است.</p>`;
    }
  }
}

function checkHeightBasket() {
  if (userBasket.length >= 4) {
    basketWrapper.style.height = "318px";
    basketWrapper.style.overflowY = "scroll";
  } else {
    basketWrapper.style.height = "auto";
    basketWrapper.style.overflow = "hidden";
  }
}
checkHeightBasket();

function saveInToLocalStorage(basket) {
  localStorage.setItem("basket", JSON.stringify(basket));
}

function addToBasket(event) {
  if (document.cookie.includes("userID")) {
    const id = event.target.closest("#button").dataset.id;

    const findedFoodInBasket = userBasket.some(function (food) {
      return food.$id == id;
    });

    if (findedFoodInBasket) {
      plusFood(id);
    } else {
      const food = data.foods.documents.find(function (food) {
        return food.$id == id;
      });
      food.count = 1;
      userBasket.push(food);
      calcPrice();
      insertFood();
      checkHeightBasket();
      data.foods.documents[0].$id === food.$id ? changeProFoodInfo(food) : "";
    }
    whileBasketShow(id);
    saveInToLocalStorage(userBasket);
  } else {
    showToast("ابتدا وارد حساب خود شوید", "failed");
  }
}

function showMiniBasket(foodId) {
  const food = userBasket.find(function (food) {
    return food.$id == foodId;
  });
  const price = +food.price;
  const calcedPrice = price * food.count;
  miniBasket.style.display = "block";
  miniBasket.innerHTML = "";
  miniBasket.insertAdjacentHTML(
    "beforeend",
    `
      <article>
          <div class="basket-info">
            <img src="${food.imageLink}" class="basket-img">
            <h5 class="basket-title">${food.title}</h5>
          </div>
          <div class="basket-details">
              <div class="basket-btns">
                  <button class="add-btn" onclick="plusFood('${foodId}')">
                      <i class="bx bx-plus"></i>
                  </button>
                  <span class="basket-count">${food.count}</span>
                  <button style="display:none;" class="delete-btn" onclick="deleteFood('${foodId}')">
                      <i class="bx bx-trash"></i>
                  </button>
                  <button style="display:block;" class="remove-btn" onclick="minusFood('${foodId}')">
                      <i class="bx bx-minus"> </i>
                  </button>
              </div>
              <span class="price-basket">${calcedPrice.toLocaleString()}</span>
          </div>
      </article>
    `,
  );
}

function whileBasketShow(id) {
  clearInterval(showingMiniBasket);
  secondCounter = 0;
  showMiniBasket(id);
  showingMiniBasket = setInterval(hideMiniBasket, 1000);
}

function hideMiniBasket() {
  secondCounter++;
  if (secondCounter === 2) {
    miniBasket.style.display = "none";
    secondCounter = 0;
    clearInterval(showingMiniBasket);
  }
}

function calcPrice() {
  let priceAll = 0;
  userBasket.forEach(function (food) {
    priceAll += +food.price * +food.count;
  });
  finalPrice.innerHTML = priceAll.toLocaleString();
}

function detectBuy(event) {
  if (finalPrice.innerHTML === "0$" || finalPrice.innerHTML === "0.0$") {
    event.preventDefault();
  }
}

function plusFood(id) {
  userBasket.map(function (food) {
    if (food.$id == id) {
      food.count <= 20 ? food.count++ : "";
    }
  });
  calcPrice();
  insertFood();
  whileBasketShow(id);
  saveInToLocalStorage(userBasket);

  if (data.foods.documents[0].$id === id) {
    changeProFoodInfo(matchingFoodBasket());
  }
}

function minusFood(event) {
  const id = event.target ? event.target.closest("button").dataset.id : event;
  let count = 0;
  userBasket.map(function (food) {
    if (food.$id == id) {
      food.count > 0 ? food.count-- : "";
      count = food.count;
    }
  });
  if (data.foods.documents[0].$id === id) {
    changeProFoodInfo(matchingFoodBasket());
  }
  if (count < 1) {
    deleteFood(id);
  } else {
    calcPrice();
    insertFood();
    whileBasketShow(id);
    saveInToLocalStorage(userBasket);
  }
}

function getFoodId(event) {
  const foods = document.querySelectorAll(".basket article");
  unHoverDrop();
  hideTrash();
  const id = event.dataTransfer.getData("id");
  deleteFood(id);
  foods.forEach(function (food) {
    food.removeAttribute("style");
  });
}

function preventOver(event) {
  event.preventDefault();
}

function transferId(event) {
  showTrash();
  event.target.closest("article").style.animation =
    "rotate 0.4s linear infinite";
  event.target.closest("article").style.backgroundColor = "#850000";
  event.dataTransfer.setData("id", event.target.closest("article").dataset.id);
}

function deleteFood(id) {
  miniBasket.style.display = "none";

  const foodIndex = userBasket.findIndex(function (food) {
    return food.$id === id;
  });

  userBasket.splice(foodIndex, 1);

  calcPrice();
  saveInToLocalStorage(userBasket);
  if (userBasket.length < 1) {
    basketWrapper.innerHTML = `<p style="color: white;">سبد خرید شما خالی است.</p>`;
  } else {
    insertFood();
  }
  checkHeightBasket();
  if (data.foods.documents[0].$id === id) {
    changeProFoodInfo(matchingFoodBasket());
  }
}

function insertFood() {
  basketWrapper.innerHTML = "";
  userBasket.forEach(function (food) {
    const price = +food.price;
    basketWrapper.insertAdjacentHTML(
      "beforeend",
      `
        <article data-id="${food.$id}" draggable="true" ondragstart="transferId(event);" ondragend="hideTrash();">
          <div class="basket-info">
          <img src="${food.imageLink}" class="basket-img">
          <h5 class="basket-title">${food.title}</h5>
          </div>
          <div class="basket-details">
              <div class="basket-btns">
                  <button class="add-btn" onclick="plusFood('${food.$id}')">
                      <i class="bx bx-plus"></i>
                  </button>
                  <span class="basket-count">${food.count}</span>
                  <button style=${food.count < 2 ? "display:block;" : "display:none;"} class="delete-btn" onclick="deleteFood('${food.$id}')">
                      <i class="bx bx-trash"></i>
                  </button>
                  <button style=${food.count > 1 ? "display:block;" : "display:none;"} class="remove-btn" onclick="minusFood('${food.$id}')">
                      <i class="bx bx-minus"> </i>
                  </button>
              </div>
              <span class="price-basket">${price.toLocaleString()}</span>
          </div>
        </article>
      `,
    );
  });
}

function changeProFoodInfo(food) {
  const numberButtonLefts = document.querySelectorAll(".number-button_left");
  const contentLeftPrices = document.querySelectorAll(".content-left_price");
  numberButtonLefts.forEach((numberButtonLeft) => {
    numberButtonLeft.innerHTML = food?.count ? food.count : 0;
  });
  contentLeftPrices.forEach((contentLeftPrice) => {
    contentLeftPrice.innerHTML = food?.count
      ? (food.price * food.count).toLocaleString()
      : 0;
  });
}

function hoverDrop(event) {
  event.target.closest("div").style.backgroundColor = "#720000";
}

function unHoverDrop() {
  trashBasket.style.backgroundColor = "#C90000";
}

function showTrash() {
  trashBasket.style.display = "flex";
}

function hideTrash() {
  const foods = document.querySelectorAll(".basket article");
  trashBasket.style.display = "none";
  foods.forEach(function (food) {
    food.removeAttribute("style");
  });
}

function openBasket(event) {
  event.stopPropagation();
  basketScreenDropAll.style.display = "block";
  basketScreenDrop.style.zIndex = "55";
  basketScreen.style.zIndex = "56";
  opened = true;
}

function openProFoodBasket(event) {
  const findedFood = matchingFoodBasket();
  if (findedFood) {
    openBasket(event);
  } else {
    showToast("حداقل باید یک عدد اضافه کنید", "failed");
  }
}

function closeBasket() {
  basketScreenDropAll.style.display = "none";
  basketScreenDrop.style.zIndex = "0";
  basketScreen.style.zIndex = "0";
  opened = false;
}

async function startingOperation() {
  await getFoods();
  await getBasketInLocalStorage();
  // if (document.cookie.includes("userID")) {
  //   setTimeout(() => {
  //     menu.insertAdjacentHTML(
  //       "beforeend",
  //       `
  //         <button class="user-basket" onclick="openBasket(event)">
  //             <i class="bx bx-basket"></i>
  //         </button>
  //       `,
  //     );
  //   }, 500);
  // }
  changeProFoodInfo(matchingFoodBasket());
}

closeBasketBtn.addEventListener("click", closeBasket);
window.addEventListener("load", startingOperation);
basketScreen.addEventListener("click", function (event) {
  event.stopPropagation();
});
document.body.addEventListener("click", function (event) {
  if (opened) {
    closeBasket();
  }
});
