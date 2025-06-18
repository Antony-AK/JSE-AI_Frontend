import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Login from './Pages/Login/Login.jsx';
import Signup from './Pages/Signup/Signup.jsx';
import Dashboard from './Pages/3_dashboard/Dashboard.jsx';
import Joblisting from "./Pages/4_job listing/Joblistings.jsx";
import Selectedapplication from "./Pages/5_selectedjobs/Selectedapplications.jsx";
import Myapplication from "./Pages/6_myapplications/Myapplication.jsx";
import Applicationtracker from "./Pages/7_app_tracker/Applicationtracker.jsx";
import Savedjob from "./Pages/8_savedjobs/Savedjob.jsx";
import Setting from "./Pages/9_settings/Settings.jsx";
import VerificationPage from './base/1_auth/VerificationPage/VerificationPage.jsx';
import Test1 from './Testing/Test1';
import Navbar from "./base/navbar/Navbar.jsx";
import Sidebar from './base/sidebar/sidebar.jsx';
import 'aos/dist/aos.css';
import "./App.css"
import './index.css';
import Landing from './base/Landing.jsx';
import DataEntryPages from './Pages/DataEntry/DataEntryPages.jsx'; // not used right now
import Profile from './Pages/Profile/Profile.jsx';
import DataOnboarding from './Pages/DataOnboarding/DataOnboarding.jsx';
import Linkedin from './Pages/DataOnboarding/Linkedin.jsx';
import Resume from './Pages/DataOnboarding/Resume.jsx';

const AppRoutes = () => {
    const location = useLocation();

    // Define routes that are data-entry only
    const isDataEntryPage = location.pathname.startsWith('/user/onboarding') || location.pathname.startsWith('/user/dataonboarding') || location.pathname.startsWith('/user/linkedin') || location.pathname.startsWith('/user/resume') || ['/', '/user/login', '/user/signup'].includes(location.pathname);

    return (
        <div className='App'>
            {isDataEntryPage ? (
                <div className='data-entry'>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/user/login" element={<Login />} />
                        <Route path="/user/signup" element={<Signup />} />
                        <Route path="/user/dataonboarding" element={<DataOnboarding />} />
                        <Route path="/user/onboarding/*" element={<DataEntryPages />} />
                        <Route path='/user/linkedin' element={<Linkedin/>} />
                        <Route path='/user/resume' element={<Resume/>} />
                    </Routes>
                </div>
            ) : (
                <div className="main flex flex-col">
                    <Navbar />
                    <div className='flex flex-row h-full'>
                        <Sidebar />
                        <div style={{ width: "calc(100% - 264px)" }} className='ms-64 mt-16 h-full bg-[#f5f5f5]'>
                            <Routes>
                                <Route path="/user/dashboard" element={<Dashboard />} />
                                <Route path="/user/job-listings" element={<Joblisting />} />
                                <Route path="/user/selected-applications" element={<Selectedapplication />} />
                                <Route path="/user/my-applications" element={<Myapplication />} />
                                <Route path="/user/application-tracker" element={<Applicationtracker />} />
                                <Route path="/user/saved-jobs" element={<Savedjob />} />
                                <Route path="/user/settings" element={<Setting />} />
                                <Route path="/test1" element={<Test1 />} />
                                <Route path="/verification" element={<VerificationPage />} />
                                <Route path="/user/profile" element={<Profile />} />
                            </Routes>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

function App() {
    return (
        <AppRoutes />
    );
}

export default App;
