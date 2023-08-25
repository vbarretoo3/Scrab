import React, { useState, useRef, useEffect } from "react";
import logo from "../imgs/Scrab_dark_Logo.svg";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../context/firebase";
import { useAuth } from "../context/auth";
import _ from "lodash";

function ProtectedHeader() {
  const [isModalOpen, setModalOpen] = useState(false);
  const modalRef = useRef(null);
  const currentUser = sessionStorage.getItem("user");
  const user = JSON.parse(currentUser);
  const [firstName, setFirstName] = useState(user.FirstName);
  const [lastName, setLastName] = useState(user.LastName);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = _.throttle((event) => {
      if (
        isModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        // Close the modal here
        setModalOpen(false);
      }
    }, 300);

    // Add the event listener
    document.addEventListener("click", handleOutsideClick);

    // Cleanup the event listener
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isModalOpen, modalRef, setModalOpen]);

  const handleModal = (event) => {
    event.stopPropagation(); // Prevent event from bubbling up
    setModalOpen(true);
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleLogout = async () => {
    try {
      await logout();
      sessionStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Error while signing out:", error);
    }
  };

  const handleSave = async () => {
    if (firstName !== user.FirstName || lastName !== user.LastName) {
      // values have changed, update Firestore
      try {
        const userDoc = doc(db, "Users", user.id); // replace "users" with your collection name and user.uid with the correct identifier
        await updateDoc(userDoc, {
          FirstName: firstName,
          LastName: lastName,
        });

        // Optionally update local session storage
        const updatedUser = {
          ...user,
          FirstName: firstName,
          LastName: lastName,
        };
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        setModalOpen(false);
        window.location.reload();
        // Feedback to the user (like a toast or alert) that it was saved successfully
      } catch (error) {
        console.error("Error updating user:", error);
        // Feedback to the user about the error
      }
    }
  };

  return (
    <>
      <div className="protected-header-container">
        <div className="header-right">
          <Link to="/dashboard">
            <img className="logo" src={logo} alt="Scrab" />
          </Link>
        </div>
        <div onClick={handleModal} className="protected-header-left">
          {user.FirstName} {user.LastName}
        </div>
      </div>
      <Modal isOpen={isModalOpen} className="user-modal">
        <div className="user-modal-container" ref={modalRef}>
          <div className="user-info-button">
            <p>User Config</p>
          </div>
          <div className="user-info-container">
            <div className="user-info">
              <label>First Name</label>
              <input
                value={firstName}
                onChange={handleFirstNameChange}
                type="text"
              />
            </div>
            <div className="user-info">
              <label>Last Name</label>
              <input
                value={lastName}
                onChange={handleLastNameChange}
                type="text"
              />
            </div>
          </div>
          <div className="user-info-button">
            <button className="button-pill" onClick={handleSave}>
              Save
            </button>
            <button className="button-pill" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ProtectedHeader;
