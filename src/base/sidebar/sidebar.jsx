import React, { useState } from "react";
import { t } from "../../utils/i18n";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp, Settings as SettingsIcon } from "lucide-react";

import lock_icon from "../../assets/lock_icon.png"

import dashboard_icon from '../../assets/dashboard-icon.svg';
import dashboard_active_icon from '../../assets/dashboard-active-icon.svg';

import my_application_icon from '../../assets/job-listing-icon.svg';
import my_application_active_icon from '../../assets/job-listing-active-icon.svg';

import application_tracker_icon from '../../assets/application.svg';
import application_tracker_active_icon from '../../assets/application-tracker-active-icon.svg';

import saved_jobs_icon from '../../assets/saved-jobs-icon.svg';
import saved_jobs_active_icon from '../../assets/saved-jobs-active-icon.svg';

import proficiency_test from '../../assets/proficiency-test.png';
import active_proficiency_test from '../../assets/active_proficiency-test.png';

import self_development from '../../assets/self-developement.png';
import self_development_active from '../../assets/self-development-active.svg';

import personal_tracker from '../../assets/personal-tracker.png';
import personal_tracker_active from '../../assets/personal-tracker-active.svg';

import profile_icon from '../../assets/profile-icon.svg';
import profile_active_icon from '../../assets/profile-active-icon.svg';

import upgrade_icon from '../../assets/upgrade-icon.svg';
import upgrade_active_icon from '../../assets/upgrade-active-icon.svg';

const Sidebar = ({ isOpen, onClose }) => {

  const { pathname } = useLocation();
const [openJobs, setOpenJobs] = useState(pathname.startsWith("/user/my-jobs"));

  // inside your Sidebar component
  const [openUpcoming, setOpenUpcoming] = useState(false);
  
  


  const menuItems = [
    {
      to: "/user/dashboard",
      defaultIcon: dashboard_icon,
      activeIcon: dashboard_active_icon,
      label: t("sidebar.dashboard")
    },
    {
      label: t("sidebar.myJobs"),
      defaultIcon: my_application_icon,
      activeIcon: my_application_active_icon,
      children: [
        {
          to: "/user/my-jobs/internal",
          label: t("sidebar.internal")
        },
        {
          to: "/user/my-jobs/external",
          label: t("sidebar.external")
        }
      ]
    },
    {
      to: "/user/application-tracker",
      defaultIcon: application_tracker_icon,
      activeIcon: application_tracker_active_icon,
      label: t("sidebar.applicationTracker")
    },
    {
      to: "/user/saved-jobs",
      defaultIcon: saved_jobs_icon,
      activeIcon: saved_jobs_active_icon,
      label: t("sidebar.savedJobs")
    },
    {
      to: "/user/proficiency-test",
      defaultIcon: proficiency_test,
      activeIcon: active_proficiency_test,
      label: t("sidebar.proficiencyTest")
    },
    {
      to: "/user/self-development",
      defaultIcon: self_development,
      activeIcon: self_development_active,
      label: t("sidebar.selfDevelopment")
    },
    {
      to: "/user/personal-tracker",
      defaultIcon: personal_tracker,
      activeIcon: personal_tracker_active,
      label: t("sidebar.personalTracker")
    }
  ];

  return (

    <>

    {isOpen && (
      <div
        className="fixed inset-0 z-40 md:hidden"
        onClick={onClose}
      ></div>
    )}

    <aside
      className={`
        fixed top-16 w-[264px] h-[calc(100vh-64px)] pt-8 bg-white border-r flex-col overflow-y-auto hide-scrollbar z-50 md:z-0
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:flex
      `}
    >

      <div className="flex-1 -mt-3">
        <ul className="space-y-2 pl-2 text-lg text-gray-400">
          {menuItems.map((item, index) => {
            const isActiveParent = item.to && pathname === item.to;
            const isMyJobs = item.label === "My Jobs";

            return (
              <li key={index}>
                {item.children ? (
                  <>
                    {/* My Jobs Parent Link */}
                    <div
                      className={`flex items-center justify-between px-4 py-2 rounded-md transition cursor-pointer ${pathname.includes("/user/my-jobs") ? "text-[#2c6472]" : "text-gray-400"
                        }`}
                      onClick={() => setOpenJobs(prev => !prev)}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={pathname.includes("/user/my-jobs") ? my_application_active_icon : my_application_icon}
                          alt="My Jobs"
                          className="w-5 h-5"
                        />
                        <span className="text-[14px] font-semibold">{t("sidebar.myJobs")}</span>
                      </div>
                      {openJobs ? (
                        <ChevronUp className="w-4 h-4  text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </div>

                    {/* Internal / External Sub-links */}
                    {openJobs && item.children.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.to}
                        className={`block px-4 py-2 text-[14px] font-semibold rounded-md ms-14 transition ${pathname === subItem.to ? "text-[#2c6472]" : "text-gray-400"
                          }`}
                      >
                        {subItem.label}

                        {["Personal Tracker", "Self Development", "Proficiency Test"].includes(subItem.label) && (
                          <img src={lock_icon} alt="lock" className="inline w-4 h-4 object-cover ml-1" />
                        )}
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    to={item.to}
                    className={`flex items-center gap-4 px-4 py-2 transition rounded-md ${isActiveParent ? "text-[#2c6472]" : "text-gray-400"
                      }`}
                  >
                    <img
                      src={isActiveParent ? item.activeIcon : item.defaultIcon}
                      alt={item.label}
                      className="w-5 h-5"
                    />
                    <span className="text-[14px] font-semibold">{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

      </div>

      {/* Bottom Section */}
      <div>
        <ul className="space-y-2 pl-2 text-lg text-gray-400">
          <li>
            <Link
              to="/user/profile"
              className={`flex items-center gap-4 px-4 py-2 rounded-md transition ${pathname === "/user/profile" ? "text-[#2c6472] " : "text-gray-400"
                }`}
            >
              <img
                src={pathname === "/user/profile" ? profile_active_icon : profile_icon}
                alt="Profile"
                className="w-5 h-5"
              />
              <span className="text-[15px] font-semibold text-[rgba(0, 0, 0, 0.25)]">{t("sidebar.jobProfile")}</span>
            </Link>
          </li>

          <li>
            <Link
              to="/user/upgrade"
              className={`flex items-center gap-4 px-4 py-2 rounded-md transition ${pathname === "/user/upgrade" ? "text-[#2c6472] " : "text-gray-400"
                }`}
            >
              <img
                src={pathname === "/user/upgrade" ? upgrade_active_icon : upgrade_icon}
                alt="Upgrade"
                className="w-5 h-5"
              />
              <span className="text-[15px] font-semibold text-[rgba(0, 0, 0, 0.25)]">{t("sidebar.upgrade")}</span>
            </Link>
          </li>

        </ul>
      </div><br />
    </aside>

    </>
  );
};

export default Sidebar;