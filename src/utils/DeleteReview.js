import { toast } from "react-toastify";

const DeleteReview = async (reviewId, api) => {
  const toastId = toast.loading("Deleting review...");
  try {
    const response = await api.delete(`/delete-review/${reviewId}`);
    toast.update(toastId, {
      render: "Review deleted successfully!",
      type: "success",
      isLoading: false,
      autoClose: 5000,
      closeOnClick: true,
      closeButton: true,
    });
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
