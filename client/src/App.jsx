import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./containers/Home/Home.jsx";
import Auth from "./containers/Auth/Auth.jsx";
import Contacts from "./containers/Contacts/Contacts.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Chat from "./containers/Chat/Chat.jsx";
import { useApi } from "./hooks/useApi.js";
import { BASE_URL } from "./constants.js";

const App = () => {
  const [user, setUser] = useState(null);
  const { get, data } = useApi();
  const navigate = useNavigate();
  const location = useLocation();

  const publicRoutes = ["/login"];

  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem("isUserLoggedIn");
    if (isUserLoggedIn) {
      get(`${BASE_URL}/auth/authenticate`);
    }
  }, []);

  useEffect(() => {
    if (data?.user) {
      setUser(data?.user);
      if (publicRoutes.includes(location.pathname)) {
        navigate("/");
      }
    }
  }, [data]);

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home setUser={setUser} user={user} />
            </ProtectedRoute>
          }
        >
          <Route path="/contacts/:id" element={<Chat user={user} />} />
        </Route>
        <Route path="/login" element={<Auth setUser={setUser} />} />
        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <Contacts user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
