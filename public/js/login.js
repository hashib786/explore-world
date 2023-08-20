import axios from "axios";
import { showAlert } from "./showAlert";

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/users/login",
      data: {
        email: email,
        password: password,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully");
      setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};
