import React, { Suspense, lazy } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { Box } from "@mui/material";
import { Wallet } from "@mui/icons-material";
import Login from "./components/Login";
import CallbackPage from "./components/CallbackPage";
import Home from "./components/Home";
import { useAuth } from "react-oidc-context";


/*
const Home = lazy(() => import("./components/Home/Home"));
const Login = lazy(() => import("./components/Login/Login"));
const Header = lazy(() => import("./components/Header/Header"));
const LeftSideNav = lazy(() => import("./components/Navigation/LeftSideNav"));
const BottomNav = lazy(() => import("./components/Navigation/BottomNav"));
*/
const App: React.FC = () => {
  const auth = useAuth();
  /*
  const { isLoading, error, isAuthenticated } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <div>Authenticating...</div>;
  }
  */
  if (auth.isLoading) {
    return <div>Authenticating...</div>;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
          <Routes>
            {/* Default route 
            <Route
              path="/"
              element={
                auth.isAuthenticated ? <Home /> : <Navigate to="/login" />
              }
            />*/}
            <Route path="/callback" element={<CallbackPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
          </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
