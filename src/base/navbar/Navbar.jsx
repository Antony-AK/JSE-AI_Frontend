import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import arrow_down from "../../assets/down-arrow.svg";
import profile from "../../assets/profile1.png";

const Navbar = () => {
  const [firstName, setFirstName] = useState('User');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchUserInfo = async () => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.warn('No token found in sessionStorage');
      return;
    }

    try {
      const response = await fetch('https://jse.arshan.digital/b1/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      const name = Array.isArray(data) ? data[0]?.first_name : data.first_name;
      if (name) {
        setFirstName(name);
      } else {
        console.warn("First name not found in API response. Using default.");
      }
    } catch (error) {
      console.error('Error fetching personal info:', error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
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
    const title = segments.length ? segments[segments.length - 1] : 'Dashboard';
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  return (
    <>
      <header style={{ width: "calc(100% - 264px)" }} className="fixed top-0 z-10 flex justify-between items-center bg-white h-16 ms-[264px] border-t border-b px-6 border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">{getPageTitle()}</h1>
        <div className="flex items-center space-x-3 relative">
          <img
            src={profile}
            alt="Profile"
            className="w-9 h-9 rounded-full"
          />
          <span className="text-gray-800 font-bold">{firstName}</span>
          <img src={arrow_down} alt="" onClick={() => setMenuOpen(!menuOpen)} className='w-8 h-8 mt-1 p-2 rounded-full hover:bg-[#407684] transform duration-200 ease-linear'/>
          {menuOpen && (
            <div className="absolute top-12 -right-2 bg-white border rounded shadow-md p-1 z-20">
              <button
                onClick={handleLogout}
                className="text-red-800 hover:bg-red-600 hover:text-white transform duration-200 ease-linear font-medium px-3 py-1"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 🌟 Logout popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center animate-fade-in">
          <div className="bg-white rounded shadow-2xl px-10 py-8 w-[92%] max-w-md text-center border-b-8 border-[#2c6472]">
            <h2 className="text-2xl font-bold text-[#2c6472] mb-4">Logged Out Successfully</h2>
            <p className="text-gray-600 w-full ">
              Thanks for visiting - we’ll see you again soon!👋
            </p>
            {/* <div className="w-10 h-1 bg-[#2c6472] mx-auto rounded-full animate-pulse"></div> */}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
