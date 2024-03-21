import { toast } from "react-toastify";

const UpdateReview = async (e, reviewId, userId, api) => {
  e.preventDefault();
  const toastId = toast.loading("Updating review...");
  try {
    const response = await api.post(`/edit-review/`, {
      id: reviewId,
      author: userId,
      rating: e.target.rating.value,
      comment: e.target.comment.value,
    });
    toast.update(toastId, {
      render: "Review updated successfully!",
      type: "success",
      isLoading: false,
      autoClose: 5000,
      closeOnClick: true,
      closeButton: true,
    });
    return response.data;
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
