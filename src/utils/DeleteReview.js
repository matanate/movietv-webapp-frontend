import { toast } from "react-toastify";

const API_URL = "http://localhost:8000/api/";

const DeleteReview = async (reviewId, authTokens, onReviewDeleted) => {
  const toastId = toast.loading("Deleting review...");
  try {
    let response = await axios.delete(`${API_URL}delete-review/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${authTokens.access}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 204) {
      let data = response.data;
      toast.update(toastId, {
        render: "Review deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      });
      onReviewDeleted();
      return data;
    }
  } catch (error) {
    console.error("An error occurred during review delete:", error);
    toast.update(toastId, {
      render: "Failed to delete review. Please try again.",
      type: "success",
      isLoading: false,
      autoClose: 5000,
      closeOnClick: true,
      closeButton: true,
    });
  }
};

export default DeleteReview;
