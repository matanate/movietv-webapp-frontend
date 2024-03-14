import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8000/api/";

const UpdateReview = async (
  e,
  reviewId,
  authTokens,
  userId,
  onReviewDeleted
) => {
  e.preventDefault();
  const toastId = toast.loading("Updating review...");
  try {
    let response = await axios.post(
      `${API_URL}edit-review/`,
      {
        id: reviewId,
        author: userId,
        rating: e.target.rating.value,
        comment: e.target.comment.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
      }
    );

    if (response.status === 202) {
      let data = response.data;
      onReviewDeleted(); // Trigger the re-fetch here
      toast.update(toastId, {
        render: "Review updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      });
      return data;
    }
  } catch (error) {
    console.error("An error occurred during review update:", error);
    toast.update(toastId, {
      render: "Failed to update review. Please try again.",
      type: "error",
      isLoading: false,
      autoClose: 5000,
      closeOnClick: true,
      closeButton: true,
    });
  }
};

export default UpdateReview;
