export const getUser = () => {
  try {
    const token = localStorage.getItem("token");
    return token ? JSON.parse(token) : null;
  } catch (error) {
    return null;
  }
};