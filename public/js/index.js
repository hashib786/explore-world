import "@babel/polyfill";
import { login, logout } from "./login";
import { displayMap } from "./mapbox";
import { changeImgSrc, updateData, updatePasswords } from "./updateSetting";

// DOM ELEMENTS
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logoutBtn = document.querySelector(".nav__el--logout");
const updateUserForm = document.querySelector(".form-user-data");
const passwordForm = document.querySelector(".form-user-password");
const photo = document.getElementById("photo");

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });

logoutBtn?.addEventListener("click", logout);
updateUserForm?.addEventListener("submit", updateData);
passwordForm?.addEventListener("submit", updatePasswords);
photo?.addEventListener("change", changeImgSrc);
