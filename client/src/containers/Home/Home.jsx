import React from "react";
import "./home.css";
import Contacts from "../Contacts/Contacts";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { BASE_URL } from "../../constants";

const Home = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();
  const { post, loading } = useApi();

  const handleLogout = async () => {
    await post(`${BASE_URL}/auth/logout`);
    localStorage.setItem("isUserLoggedIn",false)
    navigate("/login");
  };

  return (
    <div className="home">
      <h1>Welcome, {user?.username}!</h1>
      <button className="logout-btn" onClick={handleLogout}>
        {loading ? (
          <div className="loader">
            <div className="spinner"></div>
          </div>
        ) : (
          "Logout"
        )}
      </button>
      <div className="contacts-section">
        <Contacts user={user} />
        {params?.id && <Outlet />}
      </div>
    </div>
  );
};

export default Home;
