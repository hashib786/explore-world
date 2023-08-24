import axios from "axios";
import { showAlert } from "./showAlert";

export const bookTour = async (e) => {
  // in html data-tour-id --> tourId
  const { tourId } = e.target.dataset;
  e.target.textContent = "Processing...";

  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    location.assign(session.data.session.url);
  } catch (error) {
    // console.log(error);
    showAlert("error", error.response.data.message);
  }
};
