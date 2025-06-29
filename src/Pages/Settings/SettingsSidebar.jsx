import React, { useState } from 'react';
import general_active_icon from '../../assets/general-active-icon.svg';
import general_icon from '../../assets/general-icon.svg';
import preferences_icon from '../../assets/preferences-icon.svg';
import preferences_active_icon from '../../assets/preferences-active-icon.svg';
import notification_icon from '../../assets/notification-icon.svg';
import notification_active_icon from '../../assets/notification-active-icon.svg';
import RequestFeedback_icon from '../../assets/RequestFeedback-icon.svg';
import RequestFeedback_active_icon from '../../assets/RequestFeedback-active-icon.svg';
import billing_icon from '../../assets/billing-icon.svg';
import billing_active_icon from '../../assets/billing-active-icon.svg';
import explore_icon from '../../assets/explore-icon.svg';
import explore_active_icon from '../../assets/explore-active-icon.svg';

const SettingsSidebar = ({ activeSection, setActiveSection }) => {

  const sections = [
    { name: 'General', icon: general_icon, activeIcon: general_active_icon },
    { name: 'Preferences', icon: preferences_icon, activeIcon: preferences_active_icon },
    { name: 'Notification', icon: notification_icon, activeIcon: notification_active_icon },
    { name: 'Request & Feedback', icon: RequestFeedback_icon, activeIcon: RequestFeedback_active_icon },
    { name: 'Billing', icon: billing_icon, activeIcon: billing_active_icon },
    { name: 'Explore Plans', icon: explore_icon, activeIcon: explore_active_icon }
  ];

  return (
    <div className='flex flex-col gap-5'>
      {sections.map((section) => (
        <div
          key={section.name}
          onClick={() => setActiveSection(section.name)}
          className={`flex gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all ${
            activeSection === section.name ? 'bg-[#2c6472] hover:scale-105' : 'bg-transparent hover:bg-[#f3f3f3] hover:scale-105'
          }`}
        >
          <img
            width="16px"
            src={activeSection === section.name ? section.activeIcon : section.icon}
            alt=""
          />
          <h2
            className={`font-medium ${
              activeSection === section.name ? 'text-white' : 'text-[#0000005E]'
            }`}
          >
            {section.name}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default SettingsSidebar;
