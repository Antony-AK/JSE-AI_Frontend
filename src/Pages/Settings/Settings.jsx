import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsSidebar from './SettingsSidebar';
import AccountSecurity from './AccountSecurity';
import Preferences from './Preferences';
import Notification from './Notification';
import Feedback from './Feedback';
import Billing from './Billing';
import ExplorePlans from './ExplorePlans';

const Settings = () => {

    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('General');

  return (
    
    <div className="fixed inset-0 top-16 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="flex gap-7 w-[90%] h-[90%] bg-white rounded-lg p-6 shadow-lg relative">

            {/* Sidebar */}
            <div className='w-1/4 mt-3'>
                <SettingsSidebar
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                />
            </div>

            <div className="border-r border-gray-300"></div>

            {/* Settings Content */}
            <div className="flex flex-col w-full overflow-y-auto pr-2 scrollbar-custom mt-5">
                {/* Settings Heading */}
                <div className="">
                    {activeSection !== 'Explore Plans' && (
                        <h2 className="text-lg font-bold">
                        {activeSection === 'General' ? 'Account Security' : activeSection}
                        </h2>
                    )}
                    <button onClick={() => navigate(-1)} className="absolute top-3.5 right-3.5 text-gray-500 hover:text-gray-800 text-xl">
                        ✕
                    </button>
                </div>

                {activeSection !== 'Explore Plans' && (
                    <div className="border border-b-gray-200 h-px my-3"></div>
                )}

                {/* Settings Body */}  
                {activeSection === 'General' && <AccountSecurity />}
                {activeSection === 'Preferences' && <Preferences />}
                {activeSection === 'Notification' && <Notification />}
                {activeSection === 'Request & Feedback' && <Feedback />}
                {activeSection === 'Billing' && <Billing />}
                {activeSection === 'Explore Plans' && <ExplorePlans />}           

            </div>

        </div>
    </div>
    
  );
};

export default Settings;
