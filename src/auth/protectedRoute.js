import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ element }) => {
//   const user = localStorage.getItem("token"); // Check if the user is logged in
//   return user ? element : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;




export const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" replace />;
};

export const PublicRoute = ({ user, children }) => {
  return !user ? children : <Navigate to="/" replace />;
};