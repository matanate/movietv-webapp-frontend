const GetAvailableYears = async ({ api }) => {
  try {
    const response = await api.get(`/get-years/`);

    return response.data;
  } catch (error) {
    console.error("An error occurred during years fetching:", error);
    return [];
  }
};

export default GetAvailableYears;
