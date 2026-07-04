import {
  data,
  api,
  apiHeader,
  getUsers,
  getFoods,
  showToast,
  submitUser,
  getUserByUserName,
  getUserById,
  categoryToPersian,
} from "../modules/utils.js";

const toggleSidebarBtn = document.querySelector(".toggle-sidebar");
const sidebar = document.querySelector(".sidebar");
const themeBtn = document.querySelector(".theme-button");
const themeBtnIcon = document.querySelector(".theme-button i");
const rowsContainer = document.querySelector(".table-body");
const foodsDataCountElems = document.querySelectorAll(".products-data");
const latestUsers = document.querySelector(".latest-users");
const pagesContainer = document.querySelector(".pagination");
const usersData = document.querySelector(".users-data");
const adminsData = document.querySelector(".moderators-data");
const openCreateFoodInputsBtn = document.querySelector("#create-product");
const modalScreen = document.querySelector(".modal-screen");
const modalContainer = document.querySelector(".modal");
const createUserBtn = document.querySelector("#create-user");
const toast = document.querySelector(".toast");
const toastContent = document.querySelector(".toast-content");
const process = document.querySelector(".process");
const mainBox = document.querySelector(".main-box");
const loadingBox = document.querySelector(".loading-box");

let page = 1;
let showDatasInPage = 10;
let toastIsShow = false;
let isInHomePage = false;
let imageIsUpload = false;

window.getHomePageData = getHomePageData;
window.getFoodPageData = getFoodPageData;
window.getUserPageData = getUserPageData;
window.hideModal = hideModal;
window.submitFood = submitFood;
window.openEditUserInputs = openEditUserInputs;
window.openDeleteUserInputs = openDeleteUserInputs;
window.openEditFoodInputs = openEditFoodInputs;
window.openDeleteFoodInputs = openDeleteFoodInputs;
window.changePage = changePage;
window.copyLinkToClipBoard = copyLinkToClipBoard;

function goToLastPage() {
  const inTo = location.pathname.includes("users") ? "users" : "foods";
  const pages = document.querySelectorAll(".page");
  const page = pages[pages.length - 1];
  changePage(page, pages.length, inTo === "users" ? null : true);
}

function newDateFormat(date) {
  const dateFormat = new Intl.DateTimeFormat("fa", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
  return dateFormat;
}

function checkLogin() {
  const cookie = document.cookie;
  if (!cookie.includes("userID")) {
    location.replace("/");
  } else {
    const userID = cookie.split("=")[1];
    const thisUser = data.users.documents.find((user) => user.$id === userID);
    if (thisUser.isAdmin) {
      loadingBox.remove();
      mainBox.style.display = "block";
    } else {
      location.replace("/");
    }
  }
}

function copyLinkToClipBoard(event, link) {
  checkLogin();
  if (!event.target.className.includes("copied")) {
    event.target.classList.add("copied");
    navigator.clipboard.writeText(link);
    const title = event.target.closest(".copy-box").firstElementChild;
    const icon = title.nextElementSibling;
    title.innerHTML = "کپی شد";
    icon.className = "fas fa-check";
    setTimeout(() => {
      title.innerHTML = "کپی کردن لینک";
      icon.className = "fas fa-copy";
      event.target.classList.remove("copied");
    }, 1500);
  }
}

function insertFoods(foods) {
  rowsContainer.innerHTML = "";
  if (foods.length) {
    foods.forEach(function (food) {
      const price = +food.price;
      const date = new Date(food.$createdAt);
      const foodCategory = categoryToPersian(food);
      rowsContainer.insertAdjacentHTML(
        "beforeend",
        `
          <div class="tableRow">
            <p class="product-title">${food.title}</p>
            <p class="product-description">${food.description}</p>
            <p class="product-price">${price.toLocaleString()}</p>
            <p class="product-shortName">${foodCategory}</p>
            <p class="product-createdAt">${newDateFormat(date)}</p>
            <div class="product-img">
            <img src="${food.imageLink}">
            <div class="copy-box" dir="ltr" onclick="copyLinkToClipBoard(event,'${food.imageLink}')">
              <p>کپی کردن لینک</p>
              <i class="fas fa-copy"></i>
            </div>
            </div>
            <div class="product-manage">
              <button class="edit-btn" onclick="openEditFoodInputs('${food.$id}');">
                <!-- Edit icon -->
                <i class="fas fa-edit"></i>
              </button>
              <button class="remove-btn" onclick="openDeleteFoodInputs('${food.$id}');">
                <!-- Delete fas icon -->
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        `,
      );
    });
  } else {
    rowsContainer.innerHTML = `
      <div class="not-found-message">
        <i class="fas fa-close"></i>
        <p>در حال حاضر محصولی وجود ندارد</p>
      </div>
    `;
  }
}

function insertLastetFoods(foods) {
  rowsContainer.innerHTML = "";
  if (foods.length) {
    foods.forEach(function (food) {
      const price = +food.price;
      const foodCategory = categoryToPersian(food);
      rowsContainer.insertAdjacentHTML(
        "beforeend",
        `
          <div class="tableRow no-image">
            <p class="product-title">${food.title}</p>
            <p class="product-price">${price.toLocaleString()}</p>
            <p class="product-shortName">${foodCategory}</p>
            <div class="product-manage">
              <button class="edit-btn" onclick="openEditFoodInputs('${food.$id}');">
                <!-- Edit icon -->
                <i class="fas fa-edit"></i>
              </button>
              <button class="remove-btn" onclick="openDeleteFoodInputs('${food.$id}');">
                <!-- Delete fas icon -->
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        `,
      );
    });
  } else {
    rowsContainer.innerHTML = `
      <div class="not-found-message">
        <i class="fas fa-close"></i>
        <p>در حال حاضر محصولی وجود ندارد</p>
      </div>
    `;
  }
}

function foodsCounter() {
  foodsDataCountElems.forEach(function (foodDataCountElem) {
    foodDataCountElem.innerHTML = data.foods.documents.length;
  });
}

function getTheme() {
  document.documentElement.className = "red";
  themeBtnIcon.className = "fa fa-sun";
  const uiTheme = localStorage.getItem("theme");
  if (uiTheme === "dark") {
    document.documentElement.className = "dark";
    themeBtnIcon.className = "fa fa-home";
  } else if (uiTheme === "red") {
    document.documentElement.className = "red";
    themeBtnIcon.className = "fa fa-sun";
  } else if (uiTheme === "light") {
    document.documentElement.className = "light";
    themeBtnIcon.className = "fa fa-moon";
  }
}

async function getHomePageData() {
  getTheme();
  await getUsers();
  checkLogin();
  await getFoods();
  foodsCounter();
  const foods = data.foods.documents;
  const foodsSliced = foods.slice(foods.length - 4, foods.length);
  insertLastetFoods(foodsSliced.length > 1 ? foodsSliced : foods);
  usersCounter();
  adminsCounter();
  insertLastetUsers();
}

function insertLastetUsers() {
  latestUsers.innerHTML = `
    <i class="ui-border top indigo"></i>
    <div class="section-header">
        <p class="section-title">جدیدترین کاربران</p>
        <!-- Redirect to /dashboard/users page -->
      <a href="./dashboard/users/" class="section-link">
        بیشتر
        <!-- Arrow(Chervon Left) -->
        <i class="fa-solid fa-chevron-left"></i>
      </a>
    </div>
  `;
  const dataSliced = data.users.documents.slice(
    data.users.documents.length - 4,
    data.users.documents.length,
  );
  const users = dataSliced.length > 1 ? dataSliced : data.users.documents;
  if (users.length) {
    users.forEach(function (user) {
      latestUsers.insertAdjacentHTML(
        "beforeend",
        `
          <article>
            <!-- user icon -->
            <span class="icon-card">
              <i class="fa-solid fa-user"></i>
            </span>
            <!-- user data -->
            <div>
              <p class="user-name">${user.realName}</p>
              <p class="user-email">${user.email}</p>
            </div>
          </article>
        `,
      );
    });
  } else {
    latestUsers.innerHTML = `
      <div class="not-found-message">
        <i class="fas fa-close"></i>
        <p>در حال حاضر کاربری وجود ندارد</p>
      </div>
    `;
  }
}

function disableSubmitBtn() {
  const submit = document.querySelector(".submit");
  submit.classList.add("disabled");
  submit.setAttribute("disabled", "");
  submit.innerHTML += "<div class='loader in-submit-btn'></div>";
}

function openModal() {
  modalScreen.classList.remove("hidden");

  modalContainer.innerHTML = "";
  modalContainer.insertAdjacentHTML(
    "beforeend",
    `
        <header class="modal-header">
          <h3>ایجاد محصول</h3>
          <button type="button" class="close-modal" onclick="hideModal(event);">
            <i class="fas fa-times"></i>
          </button>
        </header>
        <main class="modal-content">
        <input type="text" class="modal-input" placeholder="عنوان محصول را وارد نمائید ..." id="product-title"
          name="product-title" />
        <input type="text" class="modal-input" placeholder="توضیحات محصول را وارد نمائید ..." id="product-description"
          name="product-description" />
        <input type="text" class="modal-input" placeholder="قیمت محصول را وارد نمائید ..." id="product-price"
          name="product-price" />
        <select id="product-shortName" name="product-shortName">
          <option value="none">--دسته بندی--</option>
          <option value="sandwich">ساندویچ</option>
          <option value="drink">نوشیدنی</option>
          <option value="dessert">دسر</option>
          <option value="toast">سوخاری</option>
        </select>
        <div class="choose-file">
          <label class="file-label" for="product-img">انتخاب تصویر
          <input type="file" class="modal-input" id="product-img" name="product-img"/>
          </label>
          <img src="../../../public/images/${document.documentElement.className === "dark" ? "image_light.png" : "image_dark.png"}" />
        </div>
      </main>
        <footer class="modal-footer">
        <button type="button" class="cancel" onclick="hideModal(event);">انصراف</button>
        <button type="submit" class="submit">تایید</button>
        </footer>
    `,
  );
  document
    .querySelector("#product-img")
    .addEventListener("click", (event) => event.stopPropagation());
  setTimeout(() => {
    document.querySelector("#product-title")?.focus();
  }, 100);
}

function showImage(event, chooseFileBox, submit) {
  const file = event.target.files[0];
  if (file && file.type.includes("image")) {
    const url = URL.createObjectURL(file);
    const image = chooseFileBox.querySelector("img");
    image.setAttribute("src", url);
    imageIsUpload = true;
    submit.focus();
  } else if (file && !file.type.includes("image")) {
    showToast("از تصویری با فرمت مجاز استفاده کنید", "failed");
    imageIsUpload = false;
  }
}

function openEditFoodInputs(foodId) {
  checkLogin();
  const selectedFood = data.foods.documents.find((food) => food.$id === foodId);
  openModal();
  const submit = document.querySelector(".submit");
  const chooseFileBox = document.querySelector(".choose-file");
  chooseFileBox.addEventListener("change", (event) =>
    showImage(event, chooseFileBox, submit),
  );
  const imageBox = chooseFileBox.querySelector("img");
  const title = document.querySelector("h3");
  title.innerHTML = "ویرایش محصول";
  const foodTitle = document.querySelector("#product-title");
  const description = document.querySelector("#product-description");
  const price = document.querySelector("#product-price");
  const category = document.querySelector("#product-shortName");
  const image = document.querySelector("#product-img");
  imageBox.setAttribute("src", selectedFood.imageLink);
  foodTitle.value = selectedFood.title;
  description.value = selectedFood.description;
  price.value = selectedFood.price;
  category.value = selectedFood.category;
  foodTitle.value.trim();
  description.value.trim();
  price.value.trim();

  submit.addEventListener(
    "click",
    () =>
      editFood(
        foodTitle.value,
        description.value,
        price.value,
        category.value,
        image,
        selectedFood,
      ),
    { once: true },
  );
}

function openDeleteFoodInputs(foodId) {
  checkLogin();
  openModal();
  const title = document.querySelector("h3");
  const modalContent = document.querySelector(".modal-content");
  const submit = document.querySelector(".submit");
  title.innerHTML = "حذف محصول";
  modalContent.innerHTML = `<p class="remove-text">آیا از حذف محصولی با شناسه <br /> ${foodId} اطمینان دارید؟</p>`;
  submit.focus();
  submit.addEventListener("click", () => deleteFood(foodId), { once: true });
}

async function removeImage(imageId) {
  const resonse = await fetch(
    `https://fra.cloud.appwrite.io/v1/storage/buckets/6a213ec2001378c0c011/files/${imageId}`,
    {
      method: "DELETE",
      headers: {
        "X-Appwrite-Project": "6a1eb72e0017c3590cbd",
      },
    },
  );
}

async function uploadImage(image) {
  let imgId = null;
  const file = image.files[0];
  const formData = new FormData();
  formData.append("fileId", "unique()");
  formData.append("file", file);
  const response = await fetch(
    "https://fra.cloud.appwrite.io/v1/storage/buckets/6a213ec2001378c0c011/files",
    {
      method: "POST",
      headers: {
        "X-Appwrite-Project": "6a1eb72e0017c3590cbd",
      },
      body: formData,
    },
  );
  const result = await response.json();
  imgId = result.$id;
  const imageInfo = {
    id: imgId,
    link: `https://fra.cloud.appwrite.io/v1/storage/buckets/6a213ec2001378c0c011/files/${imgId}/view?project=6a1eb72e0017c3590cbd&mode=admin`,
  };
  return imageInfo;
}

function foodInfoIsValid(
  foodTitle,
  foodDescription,
  foodPrice,
  foodShortName,
  foodImg,
) {
  const imageBox = document.querySelector(".choose-file img");

  let validation = false;
  if (
    foodTitle.length > 4 &&
    foodTitle.length < 35 &&
    foodDescription.length > 6 &&
    foodDescription.length < 50 &&
    !isNaN(+foodPrice) &&
    +foodPrice >= 30000 &&
    +foodPrice <= 10000000 &&
    foodShortName !== "none" &&
    !imageBox.getAttribute("src").includes("public")
  ) {
    validation = true;
  }

  return validation;
}

async function addFood(
  foodTitle,
  foodDescription,
  foodPrice,
  foodShortName,
  imageLink,
  imageId,
) {
  const newFood = {
    documentId: "unique()",
    data: {
      title: foodTitle,
      description: foodDescription,
      price: foodPrice,
      imageLink: imageLink,
      imageId: imageId,
      category: foodShortName,
    },
  };

  const apiKey = `${api}foods/documents/`;
  const response = await fetch(apiKey, {
    method: "POST",
    headers: apiHeader,
    body: JSON.stringify(newFood),
  });

  if (response.ok) {
    await getFoodPageData();
    showToast("غذای جدید با موفقیت ایجاد شد", "success");
    goToLastPage();
    imageIsUpload = false;
  }
}

async function submitFood(event) {
  event?.preventDefault();
  const foodTitle = document.querySelector("#product-title").value.trim();
  const foodDescription = document
    .querySelector("#product-description")
    .value.trim();
  const foodPrice = document.querySelector("#product-price").value.trim();
  const foodShortName = document.querySelector("#product-shortName").value;
  const foodImg = document.querySelector("#product-img");
  if (
    foodInfoIsValid(
      foodTitle,
      foodDescription,
      foodPrice,
      foodShortName,
      foodImg,
    )
  ) {
    disableSubmitBtn();
    const imgInfo = await uploadImage(foodImg);

    if (imgInfo) {
      await addFood(
        foodTitle,
        foodDescription,
        foodPrice,
        foodShortName,
        imgInfo.link,
        imgInfo.id,
      );
    }
  } else {
    showToast("تمامی موارد باید به درستی وارد شوند", "failed");
  }
  hideModal(event);
}

async function editFood(
  newTitle,
  newDescription,
  newPrice,
  newCategory,
  newImage,
  selectedFood,
) {
  const { $id, title, description, price, imageLink, imageId, category } =
    selectedFood;

  if (
    newTitle === title &&
    newDescription === description &&
    newPrice === price &&
    newCategory === category &&
    !imageIsUpload
  ) {
    showToast("تغییری در اطلاعات ایجاد نشد", "failed");
  } else if (
    foodInfoIsValid(newTitle, newDescription, newPrice, newCategory, newImage)
  ) {
    disableSubmitBtn();
    let imgInfo = null;
    if (imageIsUpload) {
      removeImage(imageId);
      imgInfo = await uploadImage(newImage);
      imageIsUpload = false;
    } else {
      imgInfo = { link: imageLink, id: imageId };
    }
    const apiKey = `${api}foods/documents/${$id}`;
    const food = {
      documentId: $id,
      data: {
        title: newTitle,
        description: newDescription,
        price: newPrice,
        imageLink: imgInfo.link,
        imageId: imgInfo.id,
        category: newCategory,
      },
    };
    if (imgInfo) {
      const response = await fetch(apiKey, {
        method: "PUT",
        headers: apiHeader,
        body: JSON.stringify(food),
      });
      if (response.ok) {
        imageIsUpload = false;
        location.pathname.includes("dashboard")
          ? await getFoodPageData()
          : await getHomePageData();
        showToast("محصول با موفقیت ویرایش شد", "success");
      } else {
        showToast("لطفا مجددا تلاش کنید", "failed");
      }
    }
  } else {
    showToast("تمامی موارد باید به درستی وارد شوند", "failed");
  }
  hideModal();
}

async function deleteFood(foodId) {
  disableSubmitBtn();
  const pages = document.querySelectorAll(".page");
  const imgId = data.foods.documents.find(
    (food) => food.$id === foodId,
  ).imageId;
  const apiKey = `${api}foods/documents/${foodId}`;
  const response = await fetch(apiKey, {
    method: "DELETE",
    headers: apiHeader,
  });
  if (response.ok) {
    removeImage(imgId);
    if (location.pathname.includes("dashboard")) {
      await getFoodPageData();
      document.querySelectorAll(".page").length < pages.length
        ? goToLastPage()
        : "";
    } else {
      await getHomePageData();
    }
    showToast("محصول با موفقیت حذف شد", "success");
  } else {
    showToast("مشکلی وجود دارد. لطفا مجددا تلاش کنید", "failed");
  }
  hideModal();
}

function hideModal(event) {
  event?.preventDefault();
  modalScreen.classList.add("hidden");
  document.querySelector(".loader")?.remove();
}

function openCreateFoodInputs() {
  checkLogin();
  openModal();
  const title = document.querySelector("h3");
  const submit = document.querySelector(".submit");
  title.innerHTML = "ایجاد محصول";
  const chooseFileBox = document.querySelector(".choose-file");
  chooseFileBox.addEventListener("change", (event) =>
    showImage(event, chooseFileBox, submit),
  );
  submit.addEventListener("click", submitFood, { once: true });
}

async function getFoodPageData() {
  getTheme();
  await getUsers();
  checkLogin();
  await getFoods();
  const foods = data.foods.documents;
  foodsCounter();
  pagination(foods);
  insertFoods(calcPage(foods));
  openCreateFoodInputsBtn.addEventListener("click", openCreateFoodInputs);
}

function openUserModal() {
  modalScreen.classList.remove("hidden");

  modalContainer.innerHTML = "";
  modalContainer.insertAdjacentHTML(
    "beforeend",
    `
      <header class="modal-header">
        <h3>ایجاد کاربر جدید</h3>
        <button type="button" class="close-modal" onclick="hideModal(event);">
          <i class="fas fa-times"></i>
        </button>
      </header>
      <main class="modal-content">
        <input
          type="text"
          class="modal-input"
          placeholder="نام و نام خانوادگی را وارد نمائید ..."
          id="user-fullName"
          name="user-fullName"
        />
        <input
          type="text"
          class="modal-input"
          id="user-username"
          name="user-username"
          placeholder="نام کاربری را وارد نمائید ..."
        />
        <input
          type="text"
          class="modal-input"
          id="user-email"
          name="user-email"
          placeholder="ایمیل را وارد نمائید ..."
        />
        <input
        type="text"
        class="modal-input"
        id="user-password"
        name="user-password"
        placeholder="رمز عبور را وارد نمائید ..."
      />
      </main>
      <footer class="modal-footer">
        <button type="button" class="cancel" onclick="hideModal(event);">انصراف</button>
        <button type="submit" class="submit">تائید</button>
      </footer>
    `,
  );
  setTimeout(() => {
    document.querySelector("#user-fullName")?.focus();
  }, 100);
}

function isValid(
  realName,
  userName,
  password,
  email,
  submit,
  ownerThisUserName,
) {
  let isValid = false;
  const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gi;
  let allowedCharacters = "abcdefghijklmnopqrstuvwxyz._0123456789";
  let notValid = false;
  let userNameWordsIsAllow = false;
  for (let i = 0; i < userName.length; i++) {
    userNameWordsIsAllow = allowedCharacters.split("").some(function (words) {
      return words === userName[i].toLowerCase();
    });
    if (!userNameWordsIsAllow) {
      notValid = true;
    }
  }
  if (
    realName.length < 3 ||
    userName.length < 3 ||
    password.length < 3 ||
    email.length < 3 ||
    realName.length > 40 ||
    userName.length > 35 ||
    password.length > 35 ||
    email.length > 30
  ) {
    showToast("لطفا مقادیر معتبر وارد کنید", "failed");
  } else if (getUserByUserName(userName) && !ownerThisUserName) {
    showToast("این نام کاربری از قبل وجود دارد", "failed");
  } else if (notValid) {
    showToast(
      "نام کاربری فقط می‌تواند شامل حروف انگلیسی و اعداد باشد",
      "failed",
    );
  } else if (!emailRegex.test(email)) {
    showToast("لطفا ایمیل معتبر وارد کنید", "failed");
  } else {
    isValid = true;
  }
  return isValid;
}

async function editUser(realName, userName, password, email, userId) {
  const apiKey = `${api}users/documents/${userId}`;
  const user = {
    documentId: userId,
    data: {
      realName,
      userName,
      password,
      email,
    },
  };

  const response = await fetch(apiKey, {
    method: "PUT",
    headers: apiHeader,
    body: JSON.stringify(user),
  });

  if (response.ok) {
    await getUserPageData();
    showToast("کاربر با موفقیت ویرایش شد", "success");
  }
}

async function deleteUser(userId) {
  const pages = document.querySelectorAll(".page");
  const apiKey = `${api}users/documents/${userId}`;
  const response = await fetch(apiKey, {
    method: "DELETE",
    headers: apiHeader,
  });
  if (response.ok) {
    await getUserPageData();
    showToast("کاربر با موفقیت حذف شد.", "success");
    document.querySelectorAll(".page").length < pages.length
      ? goToLastPage()
      : "";
  }
}

async function getUserPageData() {
  getTheme();
  await getUsers();
  checkLogin();
  await usersCounter();
  await pagination(data.users.documents);
  await pagination(data.users.documents);
  await insertUsers(calcPage(data.users.documents));
  createUserBtn.addEventListener("click", openCreateUserInputs);
}

async function createUserOperation(event) {
  event.preventDefault();
  const submit = document.querySelector(".submit");
  const realName = document.querySelector("#user-fullName").value.trim();
  const userName = document.querySelector("#user-username").value.trim();
  const password = document.querySelector("#user-password").value.trim();
  const email = document.querySelector("#user-email").value.trim();
  if (isValid(realName, userName, password, email, submit)) {
    disableSubmitBtn();
    await submitUser(realName, userName, password, email, true);
    await getUserPageData();
    goToLastPage();
  }
  hideModal();
}

async function openCreateUserInputs() {
  checkLogin();
  openUserModal();
  const title = document.querySelector(".modal-header h3");
  const submit = document.querySelector(".submit");
  title.innerHTML = "ایجاد کاربر جدید";
  submit.addEventListener("click", createUserOperation, { once: true });
}

async function openEditUserInputs(passedUserName, userAdmin) {
  checkLogin();
  openUserModal();
  const targetUser = getUserByUserName(passedUserName);
  const thisUserId = document.cookie.split("=")[1];
  const title = document.querySelector(".modal-header h3");
  const submit = document.querySelector(".submit");
  title.innerHTML = "ویرایش کاربر";
  const realNameInput = document.querySelector("#user-fullName");
  const userNameInput = document.querySelector("#user-username");
  const passwordInput = document.querySelector("#user-password");
  const emailInput = document.querySelector("#user-email");
  realNameInput.value = targetUser.realName;
  userNameInput.value = targetUser.userName;
  passwordInput.value = targetUser.password;
  emailInput.value = targetUser.email;
  async function editUserOperation(event) {
    event?.preventDefault();
    const realName = realNameInput.value.trim();
    const userName = userNameInput.value.trim();
    const password = passwordInput.value.trim();
    const email = emailInput.value.trim();
    const ownerThisUserName = userName === targetUser.userName;
    if (
      realName === targetUser.realName &&
      ownerThisUserName &&
      password === targetUser.password &&
      email === targetUser.email
    ) {
      showToast("تغییری در اطلاعات ایجاد نشد", "failed");
    } else if (thisUserId !== targetUser.$id && userAdmin) {
      showToast("شما نمیتوانید اطلاعات ادمین را ویرایش کنید", "failed");
    } else if (
      thisUserId === targetUser.$id &&
      userAdmin &&
      isValid(realName, userName, password, email, submit, ownerThisUserName)
    ) {
      disableSubmitBtn();
      await editUser(realName, userName, password, email, targetUser.$id);
    } else if (
      isValid(realName, userName, password, email, submit, ownerThisUserName)
    ) {
      disableSubmitBtn();
      await editUser(realName, userName, password, email, targetUser.$id);
    }
    hideModal();
  }
  submit.addEventListener("click", editUserOperation, { once: true });
}

function openDeleteUserInputs(userName, userAdmin) {
  checkLogin();
  openUserModal();
  const title = document.querySelector(".modal-header h3");
  const modalContent = document.querySelector(".modal-content");
  const submitBtn = document.querySelector(".submit");
  title.innerHTML = "حذف کاربر";
  modalContent.innerHTML = `<p class="remove-text">آیا از اخراج(بن) کردن کاربر با نام کاربری ${userName} اطمینان دارید؟</p>`;
  const user = getUserByUserName(userName);
  async function operation() {
    if (userAdmin) {
      showToast("شما نمیتوانید ادمین را بن کنید", "failed");
    } else {
      disableSubmitBtn();
      await deleteUser(user.$id);
    }
    hideModal();
  }
  submitBtn.focus();
  submitBtn.addEventListener("click", operation, { once: true });
}

function insertUsers(users) {
  rowsContainer.innerHTML = "";
  if (users.length) {
    users.forEach(function (user) {
      const date = new Date(user.$createdAt);
      rowsContainer.insertAdjacentHTML(
        "beforeend",
        `
          <div class="tableRow no-image">
            <p class="user-fullName">${user.realName}</p>
            <p class="user-username">${user.userName}</p>
            <p class="user-email">${user.email}</p>
            <p class="user-password">${user.password}</p>
            <p class="user-createdAt">${newDateFormat(date)}</p>
            <p class="user-admin">${user.isAdmin ? "مدیر" : "کاربر"}</p>
            <div class="product-manage">
              <button class="edit-btn" onclick="openEditUserInputs('${user.userName}',${user.isAdmin})">
                <!-- Edit icon -->
                <i class="fas fa-edit"></i>
              </button>
              <button class="remove-btn" onclick="openDeleteUserInputs('${user.userName}',${user.isAdmin})">
                <!-- Ban icon -->
                <i class="fas fa-ban"></i>
              </button>
            </div>
          </div>
        `,
      );
    });
  } else {
    rowsContainer.innerHTML = `
      <div class="not-found-message">
        <i class="fas fa-close"></i>
        <p>در حال حاضر کاربری وجود ندارد</p>
      </div>
    `;
  }
}

function usersCounter() {
  usersData.innerHTML = data.users.documents.length;
}

function adminsCounter() {
  const admins = data.users.documents.filter(function (user) {
    return user.isAdmin === "true";
  });
  adminsData.innerHTML = admins.length;
}

function calcPage(data) {
  const startIndex = (page - 1) * showDatasInPage;
  const lastIndex = startIndex + showDatasInPage;
  return data.slice(startIndex, lastIndex);
}

function toggleSidebar() {
  sidebar.classList.toggle("open");
}

function changeTheme() {
  const image = document.querySelector(".choose-file img");
  if (document.documentElement.className === "red") {
    document.documentElement.className = "light";
    themeBtnIcon.className = "fa fa-moon";
  } else if (document.documentElement.className === "light") {
    document.documentElement.className = "dark";
    themeBtnIcon.className = "fa fa-home";
  } else if (document.documentElement.className === "dark") {
    document.documentElement.className = "red";
    themeBtnIcon.className = "fa fa-sun";
  }
  image?.setAttribute(
    "src",
    `../../../public/images/${document.documentElement.className === "dark" ? "image_light.png" : "image_dark.png"}`,
  );
  saveInLocalStorage();
}

function saveInLocalStorage() {
  if (document.documentElement.className === "dark") {
    localStorage.setItem("theme", "dark");
  } else if (document.documentElement.className === "red") {
    localStorage.setItem("theme", "red");
  } else {
    localStorage.setItem("theme", "light");
  }
}

function activePage(target) {
  const beforeActivePage = document.querySelector(".page.active");
  beforeActivePage?.classList.remove("active");
  target?.classList.add("active");
}

function changePage(target, newPage, insert) {
  page = newPage;
  activePage(target);

  if (insert === undefined || insert === null) {
    insertUsers(calcPage(data.users.documents));
  } else {
    insertFoods(calcPage(data.foods.documents));
  }
}

function pagination(data) {
  const countPage = data.length / showDatasInPage;

  pagesContainer.innerHTML = "";

  for (let i = 0; i < countPage; i++) {
    pagesContainer.insertAdjacentHTML(
      "beforeend",
      `
        <span class="page ${i === page - 1 ? "active" : ""}" id="page-${i}">${i + 1}</span>
    `,
    );
    document.getElementById(`page-${i}`).addEventListener("click", (event) => {
      changePage(event.target, i + 1, data[0].price);
    });
  }
}

toggleSidebarBtn.addEventListener("click", toggleSidebar);
themeBtn.addEventListener("click", changeTheme);
window.addEventListener("visibilitychange", checkLogin);
modalContainer.addEventListener("submit", (e) => e.preventDefault());
setInterval(checkLogin, 300000);
window.addEventListener("keydown", (e) => e.key === "Escape" && hideModal());
