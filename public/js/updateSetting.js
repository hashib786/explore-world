import axios from "axios";
import { showAlert } from "./showAlert";

export const updateData = async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  try {
    const res = await axios({
      method: "PATCH",
      url: "http://localhost:3000/api/v1/users/updateme",
      data: {
        name,
        email,
      },
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
