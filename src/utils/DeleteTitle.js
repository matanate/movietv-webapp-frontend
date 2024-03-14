import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8000/api/";

const DeleteTitle = async (titleId, authTokens, onTitleDelete) => {
  const toastId = toast.loading("Deleting title...");
  try {
    let response = await axios.delete(`${API_URL}delete-title/${titleId}`, {
      headers: {
        Authorization: `Bearer ${authTokens.access}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 204) {
      let data = response.data;
      toast.update(toastId, {
        render: "Title deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      });
      onTitleDelete();
      return data;
    }
  } catch (error) {
    console.error("An error occurred during title delete:", error);
    toast.update(toastId, {
      render: "Failed to delete title. Please try again.",
      type: "success",
      isLoading: false,
      autoClose: 5000,
      closeOnClick: true,
      closeButton: true,
    });
  }
};

export default DeleteTitle;
