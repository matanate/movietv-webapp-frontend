import { toast } from "react-toastify";

const CreateReview = async (e, user, api) => {
  e.preventDefault();
  const toastId = toast.loading("Creating review...");
  try {
    const response = await api.post("/create-review/", {
      title: e.target.titleId.value,
      author: user.user_id,
      rating: e.target.rating.value,
      comment: e.target.comment.value,
    });

    toast.update(toastId, {
      render: "Review created successfully!",
      type: "success",
      isLoading: false,
      autoClose: 5000,
      closeOnClick: true,
      closeButton: true,
    });
  } catch (error) {
    console.error("An error occurred during review creation:", error);
    toast.update(toastId, {
      render: "Failed to create review. Please try again.",
      type: "error",
      isLoading: false,
      autoClose: 5000,
      closeOnClick: true,
      closeButton: true,
    });
  }
};

export default CreateReview;
