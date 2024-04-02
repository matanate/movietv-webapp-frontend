const GetGenres = async ({ api }) => {
  try {
    const response = await api.get(`/get-genres/`);

    return response.data;
  } catch (error) {
    console.error("An error occurred during genres fetching:", error);
    return [];
  }
};

export default GetGenres;
