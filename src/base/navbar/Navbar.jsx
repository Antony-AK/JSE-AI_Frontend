import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import arrow_down from "../../assets/down-arrow.svg";
import profile from "../../assets/profile1.png";
import { BASE_URL } from '../../utils/api';
import axios from 'axios';
import { useProfileImage } from '../../base/ProfileEditor/ProfileImageContext';


const Navbar = () => {

  const menuRef = useRef(null);

  const [firstName, setFirstName] = useState('User');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profileImage } = useProfileImage(); // 👈 use context

  const token = sessionStorage.getItem('authToken');

  useEffect(() => {
  if (!token) {
    console.warn("No token found. Redirecting to login...");
    navigate("/user/login");
  }
}, [token, navigate]);

  const fetchUserInfo = async () => {
    if (!token) {
      console.warn('No token found in sessionStorage');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/jobprofile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      // ✅ Now accessing from nested "profile" object
      const name = data?.seeker?.personal_info?.first_name;

      if (name) {
        setFirstName(name);
      } else {
        console.warn("First name not found in profile data. Using default.");
      }

    } catch (error) {
      console.error('❌ Error fetching personal info:', error);
    }
  };


  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setMenuOpen(false);
    setShowLogoutPopup(true); // show popup

    setTimeout(() => {
      setShowLogoutPopup(false); // hide popup
      navigate('/user/login');
    }, 2500); // 2.5s delay
  };

  const getPageTitle = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    const rawTitle = segments.length ? segments[segments.length - 1] : 'dashboard';

    return rawTitle
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <>
      <header style={{ width: "calc(100% - 264px)" }} className="fixed top-0 z-10 flex justify-between items-center bg-white h-16 ms-[264px] border-t border-b px-6 border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">{getPageTitle()}</h1>
        <div ref={menuRef} className="flex items-center space-x-3 relative cursor-pointer">
          <img
            src={profileImage || profile}
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover border border-black"
            onClick={() => setMenuOpen(!menuOpen)}
          />
          <span className="text-gray-800 font-bold" onClick={() => setMenuOpen(!menuOpen)} >{firstName}</span>
          <img src={arrow_down} alt="" onClick={() => setMenuOpen(!menuOpen)} className={`w-8 h-8 mt-1 p-2 rounded-full hover:bg-[#407684]/20 transform duration-200 ease-linear ${menuOpen ? 'rotate-180' : 'rotate-0'}`}/>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-12 -right-2 bg-white border flex flex-col items-center justify-center rounded shadow-md p-1 z-20"
              >
                <Link
                  to="/user/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-2 rounded-md transition"
                >
                  <span className="text-[15px] font-semibold text-[rgba(0, 0, 0, 0.25)]">Settings</span>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="text-red-800 hover:bg-red-600 hover:text-white transform duration-200 ease-linear font-medium px-3 py-1"
                >
                  Logout
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* 🌟 Logout popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center animate-fade-in">
          <div className="bg-white rounded shadow-2xl px-10 py-8 w-[92%] max-w-md text-center border-b-8 border-[#2c6472]">
            <h2 className="text-2xl font-bold text-[#2c6472] mb-4">Logged Out Successfully</h2>
            <p className="text-gray-600 w-full ">
              Thanks for visiting - we’ll see you again soon!
            </p>
            {/* <div className="w-10 h-1 bg-[#2c6472] mx-auto rounded-full animate-pulse"></div> */}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
