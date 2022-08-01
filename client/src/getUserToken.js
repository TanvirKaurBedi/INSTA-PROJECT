export const userDetail = () => {
  const user = localStorage.getItem("user");
  return user;
};
