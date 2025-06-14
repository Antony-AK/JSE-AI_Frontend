import React, { useState, useEffect } from "react";

import Sidebar from "../../base/sidebar/sidebar.jsx";
import { Lock, ShieldCheck, Mail, ChevronRight, Settings as SettingsIcon, Home, Briefcase, FileText, Layers, LineChart, Bookmark } from "lucide-react";
import Navbar from "../../base/navbar/Navbar.jsx";



const Settings = () => {
  const [user, setUser] = useState({});
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await fetch("https://arshan.digital/profile");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user settings:", error);
      }
    };
    fetchUserSettings();
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    console.log("User logged out");
    navigate('/user/login');
    // Add logout functionality here
  };

  return (
    <div className="flex h-screen bg-gray-50">

      {/* Main Content */}
      <main className="flex flex-col w-[1300px] min-h-screen bg-gray-40">
        
<br/>

        {/* Settings Cards */}
        <div className="flex justify-center">
  <div className="w-full max-w-3xl space-y-4">
    {/* Change Password */}
    <div className="bg-white p-6 h-[70px] rounded-xl cursor-not-allowed shadow-sm hover:shadow-md transition border border-gray-200 flex items-center justify-between ">
      <div className="flex items-center gap-4">
        <div className="bg-gray-100 p-3 items-center justify-center rounded-full">
          <Lock className="text-[#2c6472] w-5 h-5" />
        </div>
        <div>
          <p className="font-semibold text-sm">Change Password</p>
          <p className="text-xs text-gray-500">Securely update your password</p>
        </div>
      </div>
      <ChevronRight className="text-gray-400 w-5 h-5" />
    </div><br/>

    {/* Account Security */}
    <div className="bg-white p-6 h-[70px] rounded-xl cursor-not-allowed shadow-sm hover:shadow-md transition border border-gray-200 flex items-center justify-between ">
      <div className="flex items-center gap-4">
        <div className="bg-gray-100 p-3 rounded-full">
          <ShieldCheck hclassName="text-[#2c6472] w-5 h-5" />
        </div>
        <div>
          <p className="font-semibold text-sm">Account Security</p>
          <p className="text-xs text-gray-500">Enable two-factor authentication</p>
        </div>
      </div>
      <ChevronRight className="text-gray-400 w-5 h-5" />
    </div><br/>

    {/* Contact */}
    <div className="bg-white p-6 h-[70px] rounded-xl cursor-not-allowed shadow-sm hover:shadow-md transition border border-gray-200 flex items-center justify-between ">
      <div className="flex items-center gap-4">
        <div className="bg-gray-100 p-3 rounded-full">
          <Mail className="text-[#2c6472] w-5 h-5" />
        </div>
        <div>
          <p className="font-semibold text-sm   ">Contact</p>
          <p className="text-xs text-gray-500">{user?.contact || "info@arshan.de"}</p>
        </div>
      </div>
      <ChevronRight className="text-gray-400 w-5 h-5" />
    </div>
  </div>
</div>

      </main>
    </div>
  );
};

export default Settings;
