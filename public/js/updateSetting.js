import axios from "axios";
import { showAlert } from "./showAlert";

const selectDataReturnVal = (id) => document.getElementById(id).value;

const sendData = async (url, data, photo) => {
  try {
    const res = await axios({
      method: "PATCH",
      url,
      data,
    });
    if (res.data.status === "success") {
      showAlert("success", "Update User Data Successfully");
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
    setTimeout(() => {
      location.reload(true);
    }, 5000);
  }
};

export const updateData = (e) => {
  e.preventDefault();

  const photo = document.getElementById("photo");

  const formVal = new FormData();
  formVal.append("name", selectDataReturnVal("name"));
  formVal.append("email", selectDataReturnVal("email"));
  formVal.append("photo", photo.files[0]);

  sendData("/api/v1/users/updateme", formVal);
};

export const updatePasswords = async (e) => {
  e.preventDefault();

  const oldPassword = selectDataReturnVal("password-current");
  const password = selectDataReturnVal("password");
  const confirmPassword = selectDataReturnVal("password-confirm");

  const savingButton = document.querySelector(".btn--save-password");
  savingButton.textContent = "Updating ...";

  await sendData("/api/v1/users/updatemypassword", {
    oldPassword,
    password,
    confirmPassword,
  });

  document.getElementById("password-current").textContent = "";
  document.getElementById("password").textContent = "";
  document.getElementById("password-confirm").textContent = "";

  savingButton.textContent = "Save password";
};

export const changeImgSrc = (e) => {
  const photoData = e.target.files[0];
  if (!photoData) return;

  const imgSrc = URL.createObjectURL(photoData);
  document.querySelector(".form__user-photo").src = imgSrc;
};
