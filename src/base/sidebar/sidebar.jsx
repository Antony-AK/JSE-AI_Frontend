// Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Briefcase,
  FileText,
  Layers,
  LineChart,
  Bookmark,
  Settings as SettingsIcon,
} from "lucide-react";
import logo from '../../assets/logo.png'

import dashboard_icon from '../../assets/dashboard-icon.svg'
import dashboard_active_icon from '../../assets/dashboard-active-icon.svg'

import job_listing_icon from '../../assets/job-listing-icon.svg'
import job_listing_active_icon from '../../assets/job-listing-active-icon.svg'

import selected_application_icon from '../../assets/selected-application-icon.svg'
import selected_application_active_icon from '../../assets/selected-application-active-icon.svg'

import my_application_icon from '../../assets/my-application-icon.svg'
import my_application_active_icon from '../../assets/my-application-active-icon.svg'

import application_tracker_icon from '../../assets/application-tracker-icon.svg'
import application_tracker_active_icon from '../../assets/application-tracker-active-icon.svg'

import saved_jobs_icon from '../../assets/saved-jobs-icon.svg'
import saved_jobs_active_icon from '../../assets/saved-jobs-active-icon.svg'

import profile_icon from '../../assets/profile-icon.svg'
import profile_active_icon from '../../assets/profile-active-icon.svg'

const Sidebar = () => {
  const { pathname } = useLocation();

  const menuItems = [
    {
      to: "/user/dashboard",
      defaultIcon: dashboard_icon,
      activeIcon: dashboard_active_icon,
      label: "Dashboard"
    },
    {
      to: "/user/job-listings",
      defaultIcon: job_listing_icon,
      activeIcon: job_listing_active_icon,
      label: "Job Listings"
    },
    {
      to: "/user/selected-applications",
      defaultIcon: selected_application_icon,
      activeIcon: selected_application_active_icon,
      label: "Selected Application"
    },
    {
      to: "/user/my-applications",
      defaultIcon: my_application_icon,
      activeIcon: my_application_active_icon,
      label: "My Application"
    },
    {
      to: "/user/application-tracker",
      defaultIcon: application_tracker_icon,
      activeIcon: application_tracker_active_icon,
      label: "Application Tracker"
    },
    {
      to: "/user/saved-jobs",
      defaultIcon: saved_jobs_icon,
      activeIcon: saved_jobs_active_icon,
      label: "Saved Jobs"
    }
  ];
  

  return (
    <aside className="fixed top-0 w-[264px] h-screen bg-white border-r flex flex-col"><br/>
      <div className="flex justify-center items-center mt-[-7px] mr-5">
        <img className="w-9 h-9" src={logo} alt="" />
        <span className="text-[18px] font-bold text-stone-600]"><Link to="/user/dashboard">JSE AI</Link></span>
      </div><br/><br/>

      <hr className="transform -translate-y-[34px] border-gray-200"/>

      <div className="flex-1">
        <ul className="space-y-2 pl-2 text-lg text-gray-400">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.to}
                className={`flex items-center gap-4 px-4 py-2 transition rounded-md ${
                  pathname === item.to ? "text-[#2c6472]" : ""
                }`}
              >
                <img
                  src={pathname === item.to ? item.activeIcon : item.defaultIcon}
                  alt={item.label}
                  className="w-5 h-5"
                />
                <span className="text-[14px] font-semibold">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        {/* Profile */}
        <ul className="space-y-2 pl-2 text-lg text-gray-400">
          <li>
            <Link
              to="/user/profile"
              className={`flex items-center gap-4 px-4 py-2 rounded-md transition ${
                pathname === "/user/profile" ? "text-[#2c6472] bg-gray-100" : "text-gray-400"
              }`}
            >
            <img
              src={pathname === "/user/profile" ? profile_active_icon : profile_icon}
              alt="Profile"
              className="w-5 h-5"
            />
              <span className="text-[15px] font-semibold text-[rgba(0, 0, 0, 0.25)]">Profile</span>
            </Link>
          </li>
        </ul>

        {/* Settings */}
        <ul className="space-y-2 pl-2 text-lg text-gray-400">
          <li>
            <Link
              to="/user/settings"
              className={`flex items-center gap-4 px-4 py-2 rounded-md transition ${
                pathname === "/user/settings" ? "text-[#2c6472] bg-gray-100" : "text-gray-400"
              }`}
            >
              <SettingsIcon
                className={`w-5 h-5 ${
                  pathname === "/user/settings" ? "text-[#2c6472]" : "text-[rgba(0, 0, 0, 0.25)]"
                }`}
              />
              <span className="text-[15px] font-semibold text-[rgba(0, 0, 0, 0.25)]">Settings</span>
            </Link>
          </li>
        </ul>
      </div><br />

    </aside>
  );
};

export default Sidebar;