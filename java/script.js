//$ -------------------------- Handle Side NavBar Toggles -----------------------------

const changedIcon = document.querySelector("i.changed-icon");
const sideNavbar = document.querySelector(".side-navbar");

function openSideBar() {
  changedIcon.classList.replace("open-close-icon", "fa-xmark");
  changedIcon.classList.toggle("fa-align-justify");
  $(sideNavbar).animate(
    {
      left: 0,
    },
    500
  );
  $(".ul-animate li").each(function (index) {
    $(this)
      .delay(index * 100)
      .animate(
        {
          top: 0,
          opacity: 1,
        },
        500
      );
  });
}
function closeSideBar() {
  changedIcon.classList.replace("fa-xmark", "open-close-icon");
  changedIcon.classList.toggle("fa-align-justify");
  $(".ul-animate li").each(function (index) {
    $(this)
      .delay(($(".ul-animate li").length - 1 - index) * 50)
      .animate(
        {
          top: 200,
          opacity: 0,
        },
        300
      );
  });
  setTimeout(() => {
    $(sideNavbar).animate(
      {
        left: "-15rem",
      },
      500
    );
  }, 150);
}
changedIcon.addEventListener("click", () => {
  if (changedIcon.classList.contains("open-close-icon")) {
    openSideBar();
  } else if (changedIcon.classList.contains("fa-xmark")) {
    closeSideBar();
  }
});

//$ -------------------------- loading-screen -----------------------------

const loadingScreen = document.querySelector(".loading-screen");
const innerLoadingScreen = document.querySelector(".inner-loading-screen");

// setTimeout(() => {
//   $(loadingScreen).fadeOut(500);
// }, 1500);

//$ -------------------------- Start Fetch API -----------------------------

let rowData = document.getElementById("rowData");
let searchContainer = document.getElementById("searchContainer");
let search = document.getElementById("search");
let categories = document.getElementById("categories");
let area = document.getElementById("area");
let ingredients = document.getElementById("ingredients");
let contact = document.getElementById("contact");

//# Firstly Call Search By Name

$(document).ready(() => {
  searchByName("").then(() => {
    $(loadingScreen).fadeOut(500);
  });
});

//? Search By Name

async function searchByName(name) {
  rowData.innerHTML = "";
  $(innerLoadingScreen).fadeIn(400);
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
  );
  let data = await res.json();
  data.meals ? displayData(data.meals) : displayData([]);
  $(innerLoadingScreen).fadeOut(300);
}

//? Search By First Letter

async function searchByFirstLetter(letter) {
  rowData.innerHTML = "";
  $(innerLoadingScreen).fadeIn(400);
  letter == "" ? (letter = "a") : "";
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  let data = await res.json();
  data.meals ? displayData(data.meals) : displayData([]);
  $(innerLoadingScreen).fadeOut(400);
}

//? Display Meals

function displayData(arr) {
  if (!arr || arr.length === 0) {
    rowData.innerHTML = `
      <div class="col-12">
      <div class="text-center py-5">
        <div class="empty-state">
          <i class="fa-solid fa-utensils fa-5x text-warning opacity-75 mb-4"></i>
          <h1 class="text-white mb-3">No Meals Found</h1>
          <p class="text-white-50 fs-6 mb-2">We couldn't find any meals matching your search.</p>
          <p class="text-white-50 fs-6">Try searching for something else!</p>
        </div>
      </div>
    </div>
    `;
    return;
  }

  let htmlMarkUp = "";

  for (let i = 0; i < arr.length; i++) {
    htmlMarkUp += `
      <div class="col-sm-6 col-md-3">
        <div class="meal position-relative overflow-hidden rounded-2 cursor-pointer" onclick="getDetails(${arr[i].idMeal})">
          <img class="w-100" src="${arr[i].strMealThumb}" alt="${arr[i].strMeal}">
          <div class="meal-layer position-absolute text-start text-white p-2 d-flex align-items-center">
            <h4 class="m-0">${arr[i].strMeal}</h4>
          </div>
        </div>
      </div>
    `;
  }

  rowData.innerHTML = htmlMarkUp;
}

//? Get Meal

async function getDetails(id) {
  rowData.innerHTML = "";
  $(innerLoadingScreen).fadeIn(400);
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  let data = await res.json();

  data.meals ? displayDetails(data.meals[0]) : displayDetails({});
  $(innerLoadingScreen).fadeOut(300);
}

//? Display Meal

function displayDetails(meal) {
  searchContainer.innerHTML = "";

  let ingredients = ``;

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-1 p-1 small">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  let tags = meal.strTags ? [...meal.strTags.split(",")] : [];

  let tagsStr = "";
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `<li class="alert alert-danger m-1 p-1 small">${tags[i]}</li>`;
  }

  let htmlMarkUp = `
    <div class="col-md-4">
        <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
        <h2 class="mt-2">${meal.strMeal}</h2>
    </div>
    <div class="col-md-8">
        <h3 class="mb-2">Instructions</h3>
        <p class="small lh-sm">${meal.strInstructions}</p>
        
        <h5 class="mt-3"><span class="fw-bold">Area:</span> ${meal.strArea}</h5>
        <h5><span class="fw-bold">Category:</span> ${meal.strCategory}</h5>
        
        <h5 class="mt-3">Recipes:</h5>
        <ul class="list-unstyled d-flex flex-wrap gap-1 mb-3">
            ${ingredients}
        </ul>

        <h5 class="mt-3">Tags:</h5>
        <ul class="list-unstyled d-flex flex-wrap gap-1 mb-3">
            ${tagsStr}
        </ul>

        <a target="_blank" href="${meal.strSource}" class="btn btn-success btn-sm me-2">Source</a>
        <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger btn-sm">Youtube</a>
    </div>`;

  rowData.innerHTML = htmlMarkUp;
}

//? Show Search Inputs

function showSearchInputs() {
  closeSideBar();
  searchContainer.innerHTML = `
    <div class="row py-4 ">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFirstLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`;

  rowData.innerHTML = "";
}

//# Search side navbar is done
search.addEventListener("click", showSearchInputs);

//? Get Categories

async function getCategory() {
  rowData.innerHTML = "";
  $(innerLoadingScreen).fadeIn(400);
  searchContainer.innerHTML = "";

  let res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  let data = await res.json();
  data.categories ? showCategories(data.categories) : showCategories([]);

  $(innerLoadingScreen).fadeOut(300);
}

//? Show Categories

function showCategories(arr) {
  closeSideBar();

  let htmlMarkUp = "";

  for (let i = 0; i < arr.length; i++) {
    htmlMarkUp += `
        <div class="col-sm-6 col-md-3">
                <div onclick="getCategoryMeals('${
                  arr[i].strCategory
                }')" class="meal category position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class=" category-layer w-100" src="${
                      arr[i].strCategoryThumb
                    }" alt="" >
                    <div class="category-layer position-absolute text-center text-white p-1">
                        <h5>${arr[i].strCategory}</h5>
                        <p>${arr[i].strCategoryDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                    </div>
                </div>
        </div>
        `;
  }

  rowData.innerHTML = htmlMarkUp;
}

//? Get Meals By Categories

async function getCategoryMeals(category) {
  rowData.innerHTML = "";
  $(innerLoadingScreen).fadeIn(400);
  searchContainer.innerHTML = "";

  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  let data = await res.json();
  data.meals ? displayData(data.meals) : displayData([]);
  $(innerLoadingScreen).fadeOut(300);
}

//# Show categories is done

categories.addEventListener("click", getCategory);

//? Get Area

async function getArea() {
  rowData.innerHTML = "";
  $(innerLoadingScreen).fadeIn(400);
  searchContainer.innerHTML = "";

  let res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  let data = await res.json();
  data.meals ? showArea(data.meals) : showArea([]);
  $(innerLoadingScreen).fadeOut(300);
}

//? Show Area

function showArea(arr) {
  closeSideBar();

  let htmlMarkUp = "";

  for (let i = 0; i < arr.length; i++) {
    htmlMarkUp += `
        <div class="col-sm-6 col-md-3">
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer area-card">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                </div>
        </div>
        `;
  }

  rowData.innerHTML = htmlMarkUp;
}

//? Get Meals By Area

async function getAreaMeals(area) {
  rowData.innerHTML = "";
  $(innerLoadingScreen).fadeIn(400);
  searchContainer.innerHTML = "";

  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  let data = await res.json();
  data.meals ? displayData(data.meals) : displayData([]);
  $(innerLoadingScreen).fadeOut(300);
}

//# Show Area is done

area.addEventListener("click", getArea);

//? Get Ingredient

async function getIngredient() {
  rowData.innerHTML = "";
  $(innerLoadingScreen).fadeIn(400);
  searchContainer.innerHTML = "";

  let res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );
  let data = await res.json();
  data.meals ? showIngredient(data.meals) : showIngredient([]);
  $(innerLoadingScreen).fadeOut(300);
}

//? Show Ingredient

function showIngredient(arr) {
  closeSideBar();

  let htmlMarkUp = "";

  for (let i = 0; i < arr.length; i++) {
    htmlMarkUp += `
      <div class="col-sm-6 col-md-3">
                <div onclick="getIngredientMeals('${
                  arr[i].strIngredient
                }')" class="rounded-2 text-center cursor-pointer ingredient-card">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p class="p-0 m-0">${
                          arr[i].strDescription
                            ?.split(" ")
                            .slice(0, 20)
                            .join(" ") || ""
                        }</p>
                </div>
        </div>
        `;
  }

  rowData.innerHTML = htmlMarkUp;
}

//? Get Meals By Ingredient

async function getIngredientMeals(ingredient) {
  rowData.innerHTML = "";
  $(innerLoadingScreen).fadeIn(400);
  searchContainer.innerHTML = "";

  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );
  let data = await res.json();
  data.meals ? displayData(data.meals) : displayData([]);
  $(innerLoadingScreen).fadeOut(300);
}

//# Show Ingredient is done

ingredients.addEventListener("click", getIngredient);

//? Show Contact Form & Handle The Validation Of The Inputs

let nameInputFocused = false;
let emailInputFocused = false;
let phoneInputFocused = false;
let ageInputFocused = false;
let passwordInputFocused = false;
let rePasswordInputFocused = false;

function showContactForm() {
  closeSideBar();
  rowData.innerHTML = "";
  $(innerLoadingScreen).fadeIn(400);
  searchContainer.innerHTML = "";

  rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="rePasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="RePassword">
                <div id="rePasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid rePassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `;

  $(innerLoadingScreen).fadeOut(300);
  document.getElementById("submitBtn").addEventListener("click", () => {
    Swal.fire({
      title: "Success!",
      icon: "success",
      text: "Your message has been sent successfully!",
      confirmButtonText: "OK",
      timer: 3000,
    }).then(() => {
      document.getElementById("nameInput").value = "";
      document.getElementById("emailInput").value = "";
      document.getElementById("phoneInput").value = "";
      document.getElementById("ageInput").value = "";
      document.getElementById("passwordInput").value = "";
      document.getElementById("rePasswordInput").value = "";
      nameInputFocused = false;
      emailInputFocused = false;
      phoneInputFocused = false;
      ageInputFocused = false;
      passwordInputFocused = false;
      rePasswordInputFocused = false;
      submitBtn.setAttribute("disabled", true);
    });
  });

  document.getElementById("nameInput").addEventListener("focus", () => {
    nameInputFocused = true;
  });

  document.getElementById("emailInput").addEventListener("focus", () => {
    emailInputFocused = true;
  });

  document.getElementById("phoneInput").addEventListener("focus", () => {
    phoneInputFocused = true;
  });

  document.getElementById("ageInput").addEventListener("focus", () => {
    ageInputFocused = true;
  });

  document.getElementById("passwordInput").addEventListener("focus", () => {
    passwordInputFocused = true;
  });

  document.getElementById("rePasswordInput").addEventListener("focus", () => {
    rePasswordInputFocused = true;
  });
}

function inputsValidation() {
  if (nameInputFocused) {
    if (nameValidation()) {
      document
        .getElementById("nameAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("nameAlert")
        .classList.replace("d-none", "d-block");
    }
  }
  if (emailInputFocused) {
    if (emailValidation()) {
      document
        .getElementById("emailAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("emailAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (phoneInputFocused) {
    if (phoneValidation()) {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (ageInputFocused) {
    if (ageValidation()) {
      document
        .getElementById("ageAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("ageAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (passwordInputFocused) {
    if (passwordValidation()) {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-none", "d-block");
    }
  }
  if (rePasswordInputFocused) {
    if (repasswordValidation()) {
      document
        .getElementById("rePasswordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("rePasswordAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (
    nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    repasswordValidation()
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}

function nameValidation() {
  return /^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value);
}

function emailValidation() {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
    document.getElementById("emailInput").value
  );
}

function phoneValidation() {
  return /^01(0|1|2|5)[0-9]{8}$/.test(
    document.getElementById("phoneInput").value
  );
}

function ageValidation() {
  return /^[1-9]\d?$/.test(document.getElementById("ageInput").value);
}

function passwordValidation() {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(
    document.getElementById("passwordInput").value
  );
}

function repasswordValidation() {
  return (
    document.getElementById("rePasswordInput").value ==
    document.getElementById("passwordInput").value
  );
}

//# Show Contact Form

contact.addEventListener("click", showContactForm);
