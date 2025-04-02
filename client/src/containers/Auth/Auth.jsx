import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../constants";
import { useApi } from "../../hooks/useApi";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import "./Auth.css";
import "../../index.css";
import { useNavigate } from "react-router-dom";

const Auth = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { data, loading, error, post } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const url = `${BASE_URL}/auth/${isLogin ? "login" : "register"}`;
    const body = { username, password };

    await post(url, body);
  };

  useEffect(() => {
    if (data && data.user) {
      if (isLogin) {
        setUser(data?.user);
        localStorage.setItem("isUserLoggedIn",true);
        navigate('/');
      }else{
        setIsLogin(true)
        setUsername('')
        setPassword('')
      }

      toast.success(data?.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    if (error) {
      toast.error(error?.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [data, error]);

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="auth-input"
          minLength={4}
          required
        />
        <div className="auth-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            minLength={6}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
          />
          <span className="eye-icon" onClick={togglePasswordVisibility}>
            {showPassword ? "hide" : "show"}
          </span>
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? (
            <div className="loader">
              <div className="spinner"></div>
            </div>
          ) : isLogin ? (
            "Login"
          ) : (
            "Register"
          )}
        </button>
      </form>

      <button onClick={() => setIsLogin(!isLogin)} className="toggle-button">
        Switch to {isLogin ? "Register" : "Login"}
      </button>

      <ToastContainer />
    </div>
  );
};

export default Auth;
