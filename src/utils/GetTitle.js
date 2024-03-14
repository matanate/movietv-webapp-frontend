import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8000/api/";

const GetTitle = async ({ title_id }) => {
  const toastId = toast.loading("Fetching title...");
  try {
    let response = await axios.get(`${API_URL}get-titles/${title_id}`);

    if (response.status === 200) {
      let data = response.data;
      toast.dismiss(toastId);
      return data;
    }
  } catch (error) {
    console.error("An error occurred during title fetching:", error);
    toast.update(toastId, {
      render: "Failed to fetch title.",
      type: "warning",
      isLoading: false,
      autoClose: 5000,
      closeOnClick: true,
      closeButton: true,
    });
  }
};

export default GetTitle;
