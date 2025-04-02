import React, { useEffect } from "react";
import { BASE_URL } from "../../constants";
import { useApi } from "../../hooks/useApi";
import "./Contacts.css";
import { useNavigate } from "react-router-dom";

const Contacts = ({ user }) => {
  const { data, get, loading } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      get(`${BASE_URL}/auth/contacts`);
    }
  }, [user]);

  return (
    <div className="contacts-container">
      <h2>Contacts ({data?.contacts?.length || 0})</h2>
      <div className="contacts-list">
        {loading && (
          <div className="loader">
            <div className="spinner"></div>
          </div>
        )}
        {data?.contacts?.length === 0 && <div>No contacts found.</div>}
        {(data?.contacts)?.map((contact) => (
          <div
            className="contact-card"
            key={contact?.id}
            onClick={() => {
              navigate(`/contacts/${contact?.id}`);
            }}
          >
            <div className="contact-avatar">
              <div className="avatar-initials">
                {contact?.username?.charAt(0)?.toUpperCase()}
              </div>
            </div>
            <div className="contact-info">
              <div className="contact-name">{contact?.username}</div>
              <div className="last-message">{contact?.last_message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contacts;
