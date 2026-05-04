import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useMemo } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProtectedRoute, PublicRoute } from "./auth/protectedRoute";

// Lazy-loaded pages
const Dashboard = lazy(() => import("./pages/dashboard"));
const Registration = lazy(() => import("./pages/registration"));
const Login = lazy(() => import("./pages/login"));
const Layout = lazy(() => import("./pages/commonComponents/layout"));
const UserProfile = lazy(() => import("./pages/userProfile/UserProfile"));
const TransactionsPage = lazy(() => import("./pages/Transaction/TransactionsPage"));
const OtpVerification = lazy(() => import("./pages/otp"));
const AddCategory = lazy(() => import("./pages/addCategory"));
const Transaction = lazy(() => import("./pages/transaction"));
const Budget = lazy(() => import("./pages/budget/budget"));

function App() {
  const user = useMemo(() => localStorage.getItem("token"), []);

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>

          <Route
            path="/login"
            element={
              <PublicRoute user={user}>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute user={user}>
                <Registration />
              </PublicRoute>
            }
          />

          {/* Protected with Layout */}
          <Route
            element={
              <ProtectedRoute user={user}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/category" element={<AddCategory />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route path="/userProfile" element={<UserProfile />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/budget" element={<Budget />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Suspense>

      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;