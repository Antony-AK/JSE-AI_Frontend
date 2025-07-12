import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CvProvider } from './base/DocumentEditor/Context/CvContext.jsx';
import { ClProvider } from './base/DocumentEditor/Context/ClContext.jsx';

import { ExternalCvProvider } from './base/DocumentEditor/Context/ExternalCvContext.jsx';
import { ExternalClProvider } from './base/DocumentEditor/Context/ExternalClContext.jsx';

import Login from './Pages/Login/Login.jsx';
import Signup from './Pages/Signup/Signup.jsx';
import Dashboard from './Pages/3_dashboard/Dashboard.jsx';
import Myapplication from "./Pages/6_my_jobs/Internal.jsx";
import Savedjob from "./Pages/8_savedjobs/Savedjob.jsx";
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
import External from './Pages/6_my_jobs/External.jsx';
import ApplicationsChart from './Pages/3_dashboard/graph/graph.jsx';
import Announcements from './Pages/Announcements/Announcements.jsx';
import Cv from './base/DocumentEditor/CV/Cv.jsx';
import Cl from './base/DocumentEditor/CL/Cl.jsx';
import ApplicationTracker from './Pages/Application tracker/ApplicationTracker.jsx';
import DocumentEditor from './base/DocumentEditor/DocumentEditor.jsx';
import ExternalCv from './base/DocumentEditor/CV/ExternalCv.jsx';
import ExternalCl from './base/DocumentEditor/CL/ExternalCl.jsx';
import Settings from './Pages/Settings/Settings.jsx';
import ForgetPassword from './base/Forget_Passwrd/ForgetPassword.jsx';
import InProgress from './Pages/InProgress/InProgress.jsx';
import Upgrade from './Pages/Upgrade/Upgrade.jsx';
import ProficiencyTest from './Pages/ProficiencyTest/ProficiencyTest.jsx';
import SelfDevelopment from './Pages/SelfDevelopment/SelfDevelopment.jsx';
import PersonalTracker from './Pages/PersonalTracker/PersonalTracker.jsx';
import PaymentSuccess from './Pages/PaymentDesign/PaymentSuccess.jsx';
import PaymentCancel from './Pages/PaymentDesign/PaymentCancel.jsx';


const AppRoutes = () => {
    const location = useLocation();

    const hideLayout = location.pathname === '/user/cv' || location.pathname === '/user/cl' || location.pathname === '/user/document-editor' || location.pathname === '/user/external-cv' || location.pathname === '/user/external-cl' || location.pathname === '/user/forgot-password' || location.pathname === '/user/success' || location.pathname === '/user/cancel';

    // Define routes that are data-entry only
    const isDataEntryPage = location.pathname.startsWith('/user/onboarding') || location.pathname.startsWith('/user/dataonboarding') || location.pathname.startsWith('/user/linkedin') || location.pathname.startsWith('/user/resume') || ['/', '/user/login', '/user/signup'].includes(location.pathname) || location.pathname.startsWith('/user/forgot-password');

    return (
        <div className='App'>

            {isDataEntryPage ? (
                <div className='data-entry'>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/user/login" element={<Login />} />
                        <Route path="/user/forgot-password" element={<ForgetPassword />} />
                        <Route path="/user/signup" element={<Signup />} />
                        <Route path="/user/dataonboarding" element={<DataOnboarding />} />
                        <Route path="/user/onboarding/*" element={<DataEntryPages />} />
                        <Route path='/user/linkedin' element={<Linkedin />} />
                        <Route path='/user/resume' element={<Resume />} />
                    </Routes>
                </div>
            ) : (
                <div className="main relative flex flex-col">
                    {!hideLayout && <Navbar />}
                    <div className='flex flex-row h-full'>
                        {!hideLayout && <Sidebar />}
                        <div
                            style={{ width: hideLayout ? '100%' : 'calc(100% - 264px)' }}
                            className={`${!hideLayout ? 'ms-64 mt-16' : ''} h-full bg-[#f5f5f5]`}
                        >
                            <Routes>
                                <Route path="/user/personal-tracker" element={<PersonalTracker />} />
                                <Route path="/user/self-development" element={<SelfDevelopment />} />
                                <Route path="/user/proficiency-test" element={<ProficiencyTest />} />
                                <Route path="/user/upgrade" element={<Upgrade />} />
                                <Route path="/user/dashboard" element={<Dashboard />} />
                                <Route path="/user/my-jobs/internal" element={<Myapplication />} />
                                <Route path="/user/my-jobs/external" element={<External />} />
                                <Route path="/user/application-tracker" element={<ApplicationTracker />} />
                                <Route path="/user/saved-jobs" element={<Savedjob />} />
                                <Route path="/user/settings" element={<Settings />} />
                                <Route path="/test1" element={<Test1 />} />
                                <Route path="/verification" element={<VerificationPage />} />
                                <Route path="/user/profile" element={<Profile />} />
                                <Route path='/user/graph' element={<ApplicationsChart />} />
                                <Route path='/user/announcements' element={<Announcements />} />
                                <Route path="/user/cv" element={<CvProvider> <Cv key={Date.now()} /> </CvProvider>} />
                                <Route path="/user/cl" element={<ClProvider> <Cl key={Date.now()} /> </ClProvider>} />
                                <Route path="/user/document-editor" element={<ExternalCvProvider> <ExternalClProvider> <DocumentEditor /> </ExternalClProvider> </ExternalCvProvider>} />
                                <Route path='/user/external-cv' element={<ExternalCvProvider> <ExternalCv /> </ExternalCvProvider>} />
                                <Route path='/user/external-cl' element={<ExternalClProvider> <ExternalCl /> </ExternalClProvider>} />
                                <Route path='/user/success' element={<PaymentSuccess />} />
                                <Route path='/user/cancel' element={<PaymentCancel />} />
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
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                closeOnClick={false}
                rtl={false}
                pauseOnHover={false}
                pauseOnFocusLoss={false}
                draggable
                theme="light"
                transition={Bounce}
            />
            <AppRoutes />
        </>
    );
}

export default App;
