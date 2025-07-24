import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { BASE_URL } from '../../utils/api'
import warning from "../../assets/carbon_warning.png"


const PersonalInfo = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const apiUrl = `${BASE_URL}/personal-info`;

  const token = sessionStorage.getItem('authToken');

  const [showOthers, setShowOthers] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    second_name: '',
    email: '',
    phone: '',
    linkedin_profile: '',
    country: 'Germany',
    state: '',
    city: '',
  });

  const [externalLinks, setExternalLinks] = useState([
    { type: 'website', url: '' },
    { type: 'github', url: '' },
    { type: 'blog', url: '' },
    { type: 'social media', url: '' }

  ]);


  const [errors, setErrors] = useState({});
  const [showSavePopup, setShowSavePopup] = useState(false);


  const fetchEmailAndPhoneOnly = async () => {
    try {
      console.log("📡 Fetching personal info...");
      const res = await axios.get(`${BASE_URL}/personal-info`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const raw = res.data;

      let email = "";
      let phone = "";
      let first_name = "";
      let second_name = "";
      let linkedin_profile = "";
      let country = "Germany";
      let state = "";
      let city = "";
      let external_links = [];

      if (raw.email && raw.phone) {
        // Format: { email: "you@domain.com", phone: "123456" }
        email = raw.email;
        phone = raw.phone;
      } else if (raw.personal_info) {
        // Format: { personal_info: { ... } }
        const info = raw.personal_info;
        email = info.email || "";
        phone = info.phone || "";
        first_name = info.first_name || "";
        second_name = info.second_name || "";
        linkedin_profile = info.linkedin_profile || "";
        country = info.country || "Germany";
        state = info.state || "";
        city = info.city || "";
        external_links = Array.isArray(info.external_links) ? info.external_links : [];
      }

      setFormData(prev => ({
        ...prev,
        email,
        phone,
        first_name,
        second_name,
        linkedin_profile,
        country,
        state,
        city
      }));

      if (external_links.length) {
        const updatedLinks = ['website', 'github', 'blog', 'social media'].map(type => {
          const match = external_links.find(link => link.type?.toLowerCase() === type);
          return { type, url: match?.url || '' };
        });
        setExternalLinks(updatedLinks);
      }

      console.log("✅ Fetched and updated formData!");
    } catch (err) {
      console.error("❌ Failed to fetch personal info:", err);
    }
  };




  useEffect(() => {
    const prefillFromResume = () => {
      const stored = sessionStorage.getItem("extractedResume");
      if (!stored) return;

      const parsed = JSON.parse(stored)?.data;
      console.log("📄 Prefilling from extractedResume:", parsed);

      setFormData(prev => {
        return {
          ...prev,
          first_name: parsed.first_name || prev.first_name,
          second_name: parsed.second_name || prev.second_name,
          city: parsed.city || prev.city,
          state: parsed.state || prev.state,
          country: parsed.country || prev.country,
          linkedin_profile: parsed.linkedin || prev.linkedin_profile,
          // 🛡️ Extra check: If prev.email/phone is already set, NEVER overwrite them
          email: prev.email?.trim() ? prev.email : parsed.email || '',
          phone: prev.phone?.trim() ? prev.phone : parsed.phone || '',
        };
      });

      if (Array.isArray(parsed.links)) {
        const updatedLinks = ['website', 'github', 'blog', 'social media'].map(type => {
          const match = parsed.links.find(link => link.type?.toLowerCase() === type);
          return { type, url: match?.url || '' };
        });
        setExternalLinks(updatedLinks);
      }

    };

    const init = async () => {
      await fetchEmailAndPhoneOnly();   // ✅ Fetch secure data from backend
      await new Promise(resolve => setTimeout(resolve, 50)); // 💤 wait
      prefillFromResume();              // ✅ Then fill missing resume fields, skip email/phone
    };

    init();
  }, [location.pathname]);



  useEffect(() => {
    if (!formData.email || !formData.phone) {
      console.warn("⚠️ Email or phone is missing in formData:", formData);
    }
  }, [formData.email, formData.phone]);


  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [id]: newValue
    }));

    // Clear error when user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: ''
    }));
  };

  const handleExternalLinkChange = (index, value) => {
    const updatedLinks = [...externalLinks];
    updatedLinks[index].url = value;
    setExternalLinks(updatedLinks);
  };


  const validate = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
    if (!formData.second_name.trim()) newErrors.second_name = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.linkedin_profile.trim()) newErrors.linkedin_profile = "LinkedIn is required";

    return newErrors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      try {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
          toast.error("No User found. Please login again.");
          return;
        }

        // 🧹 Clean LinkedIn URL to keep only the unique part
        let cleanedLinkedIn = formData.linkedin_profile.trim();
        const linkedinBase = "https://www.linkedin.com/in/";
        if (cleanedLinkedIn.startsWith(linkedinBase)) {
          cleanedLinkedIn = cleanedLinkedIn.replace(linkedinBase, '');
        }

        // 🧠 Optionally remove trailing slash
        if (cleanedLinkedIn.endsWith("/")) {
          cleanedLinkedIn = cleanedLinkedIn.slice(0, -1);
        }

        const response = await axios.post(apiUrl, {
          ...formData,
          linkedin_profile: cleanedLinkedIn, // ⬅️ Use the cleaned URL
          external_links: externalLinks
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        navigate('/user/onboarding/work-experience');
        window.scrollTo({ top: 0, behavior: 'smooth' });


      } catch (error) {
        console.error("❌ Error submitting form:", JSON.stringify(error.response?.data, null, 2));
        toast.error(error.response?.data.issue || "Failed to submit. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false); // ✅ Reset loading even when errors are found
    }
  };

  return (
    <div className='p-3 md:p-10 pt-14 flex flex-col gap-5 w-[100%] min-h-screen overflow-y-auto'>

      {/* <div className="flex items-center -mt-10 cursor-pointer">
        <img src={right_arrow} className='w-2.5 h-3.5 object-cover' alt="" />
        <p className='ml-2 text-lg font-medium' onClick={() => navigate('/user/dataonboarding')}>Back</p>
      </div> */}

      <p className='text-[#2c6472] font-semibold -mt-10'>STEP 1 OF 8</p>

      <h2 className='font-bold sm:text-lg md:text-xl'>Let's start with your personal information.</h2>

      <form onSubmit={handleSubmit} className="md:p-5 pt-2  flex flex-col gap-5 w-full">

        {/* Name */}
        <div className="flex flex-col sm:flex-row justify-start gap-5 md:gap-10 w-full">
          <div className="flex flex-col gap-2 w-full sm:w-[50%]">
            <label className='text-sm sm:text-base md:text-lg font-medium' htmlFor="first_name">First Name <span className='text-red-500'>*</span></label>
            <input
              className={`px-5 py-3 rounded-lg md:text-lg border ${errors.first_name ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
              value={formData.first_name}
              onChange={handleChange}
              type="text"
              id='first_name'
            />
            {errors.first_name && <span className="text-red-500 text-sm">{errors.first_name}</span>}
          </div>
          <div className="flex flex-col gap-2 w-full sm:w-[50%]">
            <label className='text-sm sm:text-base md:text-lg font-medium' htmlFor="second_name">Last Name <span className='text-red-500'>*</span></label>
            <input
              className={`px-5 py-3 rounded-lg md:text-lg border ${errors.second_name ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
              value={formData.second_name}
              onChange={handleChange}
              type="text"
              id='second_name'
            />
            {errors.second_name && <span className="text-red-500 text-sm">{errors.second_name}</span>}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className='text-sm sm:text-base md:text-lg font-medium' htmlFor="email">Email Address <span className='text-red-500'>*</span></label>
          <input
            className={`px-5 py-3 rounded-lg md:text-lg border ${errors.email ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
            value={formData.email}
            onChange={handleChange}
            type="email"
            id='email'
            disabled
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-2">
          <label className='text-sm sm:text-base md:text-lg font-medium' htmlFor="phone">Phone Number <span className='text-red-500'>*</span></label>
          <input
            className={`px-5 py-3 rounded-lg md:text-lg border ${errors.phone ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
            value={formData.phone}
            onChange={handleChange}
            type="tel"
            id='phone'
            disabled
          />
          {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
        </div>

        {/* Linked in */}
        <div className="flex flex-col gap-2">
          <label className='text-sm sm:text-base md:text-lg font-medium' htmlFor="linkedin_profile">linkedIn Profile <span className='text-red-500'>*</span></label>
          <input
            className={`px-5 py-3 rounded-lg md:text-lg border ${errors.linkedin_profile ? 'border-red-500 animate-shake' : 'border-[rgba(0,0,0,0.14)]'} outline-none focus:border-[#2c6472]`}
            value={formData.linkedin_profile}
            onChange={handleChange}
            type="text"
            id='linkedin_profile'
          />
          {errors.linkedin_profile && <span className="text-red-500 text-sm">{errors.linkedin_profile}</span>}
        </div>



        {/* Portfolio, Resume, Blog */}
        <div className='flex flex-col gap-5'>
          {/* Portfolio */}

          {externalLinks.map((link, index) => (
            <div className="flex flex-col gap-2 w-[100%] mx-auto" key={index}>
              <label className='text-sm sm:text-base md:text-lg font-medium'>{link.type.charAt(0).toUpperCase() + link.type.slice(1)} Link</label>
              <input
                className='px-5 py-3 rounded-lg md:text-lg border border-[rgba(0,0,0,0.14)] outline-none focus:border-[#2c6472]'
                type="text"
                // placeholder={`Enter your ${link.type} URL`}
                value={link.url}
                onChange={(e) => handleExternalLinkChange(index, e.target.value)}
              />
            </div>
          ))}

        </div>


        {/* Country */}
        <div className="flex flex-col gap-2">
          <label className='text-sm sm:text-base md:text-lg font-medium' htmlFor="country">Country</label>
          <input
            className='px-5 py-3 rounded-lg md:text-lg border border-[rgba(0, 0, 0, 0.14)] outline-none focus:border-[#2c6472]'
            value="Germany"
            onChange={handleChange}
            type="text"
            id='country'
            name="country"
            disabled
          />
        </div>

        {/* State */}
        <div className="flex flex-col gap-2">
          <label className='text-sm sm:text-base md:text-lg font-medium' htmlFor="state">State</label>
          <input
            className='px-5 py-3 rounded-lg md:text-lg border border-[rgba(0, 0, 0, 0.14)] outline-none focus:border-[#2c6472]'
            value={formData.state}
            onChange={handleChange}
            type="text"
            id='state' />
        </div>

        {/* City */}
        <div className="flex flex-col gap-2">
          <label className='text-sm sm:text-base md:text-lg font-medium' htmlFor="city">City</label>
          <input
            className='px-5 py-3 rounded-lg md:text-lg border border-[rgba(0, 0, 0, 0.14)] outline-none focus:border-[#2c6472]'
            value={formData.city}
            onChange={handleChange}
            type="text"
            id='city'
          />
        </div>

        <div className='text-xs flex items-center justify-start text-center  '><p><span className='font-medium'>Please note:</span><span className='text-[#2c6472]'> Name ,Email & Phone Number cannot be changed.</span></p></div>

        <div className="flex justify-end mt-7">
          <button
            type="submit"
            disabled={loading}
            className={`rounded-xl px-6 py-2 mb-10 flex items-center justify-center
              ${loading ? 'bg-[#2C6472]/70 cursor-not-allowed' : 'bg-[#2C6472]'}
              text-white transition-all w-[170px] h-[40px] text-sm md:text-lg`}
          >
            {loading ? (
              <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Save & Next'
            )}
          </button>
        </div>

      </form>




      {showSavePopup && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 bg-white border-b-4 border-[#2C6472] text-black rounded-md shadow-lg transform transition-all duration-500 ease-in-out animate-toast-in`}>
          <div className="relative px-3 py-1">
            <span>✅ PersonalInfo saved successfully!</span>
            <div className="absolute bottom-0 left-0 h-[3px] bg-white animate-progress w-full" />
          </div>
        </div>
      )}

      {/* Footer appears after scrolling all content */}
      <div className="flex justify-start gap-2 text-[#2c6472] font-medium text-[13px] md:text-sm mt-8">
        <img src={warning} className="w-5  h-5 object-cover" alt="" />
        AI is not perfect. Make sure your data is accurate before saving.
      </div>

    </div>
  )
}

export default PersonalInfo