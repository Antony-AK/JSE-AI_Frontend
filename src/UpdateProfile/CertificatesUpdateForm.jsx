import React, { useState, useEffect, useCallback } from 'react';
import trash from "../assets/trash2.png";
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from '../utils/api';
import Calendar from '../base/Calender/Calender';
import { format } from 'date-fns';
import { t } from "../utils/i18n";

const CertificatesUpdateForm = ({ onclose }) => {

  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [certificates, setCertificates] = useState([]);
  const [formData, setFormData] = useState({
    certificate_name: '',
    certificate_type: '',
    provider: '',
    completion_date: '',
  });

  const [activeId, setActiveId] = useState(null);
  const token = sessionStorage.getItem('authToken');
  const apiUrl = `${BASE_URL}/certificates`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.certificate_name || !formData.certificate_type || !formData.completion_date) {
      toast.error("Please fill all required fields.");
      return false;
    }
    return true;
  };

  const fetchCertificates = useCallback(async () => {
    try {
      const res = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(res.data) ? res.data : res.data?.certificates || [];
      const dataWithId = data.map((cer, index) => ({ ...cer, tempId: index + 1 }));
      setCertificates(dataWithId);
    } catch (err) {
      console.error("Failed to fetch certificates", err);
    }
  }, [token]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const handleSelectCertificate = (cer) => {
    setFormData({
      certificate_name: cer.certificate_name || '',
      certificate_type: cer.certificate_type || '',
      provider: cer.provider || '',
      completion_date: cer.completion_date?.split('T')[0] || '',
    });
    setActiveId(cer.tempId);
  };

  const handleAddCertificate = async () => {
    if (!validateForm()) return;
    setAddLoading(true);
    try {
      await axios.post(apiUrl, {
        ...formData,
        completion_date: new Date(formData.completion_date).toISOString()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Certificate added!");
      setFormData({ certificate_name: '', certificate_type: '', provider: '', completion_date: '' });
      await fetchCertificates();
    } catch (err) {
      console.error("Add failed", err);
      toast.error("Failed to add certificate.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleUpdateCertificate = async () => {
    if (!activeId) return;
    const selected = certificates.find(c => c.tempId === activeId);
    if (!selected) return toast.error("Selected certificate not found");

    setUpdateLoading(true);
    try {
      await axios.put(`${apiUrl}/${activeId}`, {
        ...formData,
        completion_date: new Date(formData.completion_date).toISOString()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Certificate updated!");
      await fetchCertificates();
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update certificate.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteCertificate = async () => {
    if (!activeId) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`${apiUrl}/${activeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Certificate deleted");
      setFormData({ certificate_name: '', certificate_type: '', provider: '', completion_date: '' });
      setActiveId(null);
      await fetchCertificates();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete certificate.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center'>
      <div className='w-[700px] h-[620px] bg-white flex flex-col shadow rounded-xl px-10 py-5'>
        <div className="flex justify-between w-full mt-3 mb-7">
          <h3 className='text-lg font-semibold'>{t("certificates_and_courses")}</h3>
          <p onClick={onclose} className='text-lg font-semibold cursor-pointer hover:scale-95'>X</p>
        </div>

        {/* Tabs */}
        {certificates.length > 0 && (
          <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory min-h-[2rem]">
            {certificates.map((cer) => (
              <div
                key={cer.tempId}
                onClick={() => handleSelectCertificate(cer)}
                className={`flex-shrink-0 h-8 px-3 py-1.5 text-sm rounded snap-start cursor-pointer 
                ${activeId === cer.tempId ? 'bg-[#2c6472] text-white' : 'bg-gray-500/20'} 
                hover:bg-[#2c6472] hover:text-white transition-all duration-200`}
              >
                {cer.certificate_name}
              </div>
            ))}

            {/* + Tab */}
            <div
              onClick={() => {
                setFormData({ certificate_name: '', certificate_type: '', provider: '', completion_date: '' });
                setActiveId(null);
              }}
              className="flex items-center justify-center flex-shrink-0 h-8 w-8 p-3 rounded snap-start cursor-pointer 
                bg-gray-500/20 text-[#2c6472] text-xl font-medium hover:bg-gray-300 transition-all duration-200"
            >
              +
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 mt-5">
          <div className="flex flex-col">
            <label className='text-sm text-gray-600'>{t("certificate_name")} <span className='text-red-500'>*</span></label>
            <input
              type="text"
              name="certificate_name"
              value={formData.certificate_name}
              onChange={handleChange}
              className='border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-[#2c6472]'
            />
          </div>

          <div className="flex flex-col">
            <label className='text-sm text-gray-600'>{t("certificate_type")} <span className='text-red-500'>*</span></label>
            <select
              name="certificate_type"
              value={formData.certificate_type}
              onChange={handleChange}
              className='border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-[#2c6472]'
            >
              <option value="">{t("select_type")}</option>
              <option value="certification">{t("certification")}</option>
              <option value="participation">{t("participation")}</option>
              <option value="completion">{t("completion")}</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className='text-sm text-gray-600'>{t("provider")}</label>
            <input
              type="text"
              name="provider"
              value={formData.provider}
              onChange={handleChange}
              className='border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-[#2c6472]'
            />
          </div>

          <div className="flex flex-col">
            <label className='text-sm text-gray-600'>{t("completion_date")} <span className='text-red-500'>*</span></label>
            <Calendar
              selectedDate={formData.completion_date ? new Date(formData.completion_date) : null}
              onDateChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  completion_date: format(date, 'yyyy-MM-dd'),
                }))
              }
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-2">
            <button
              onClick={activeId === null && !addLoading ? handleAddCertificate : null}
              disabled={activeId !== null || addLoading}
              className={`text-sm flex items-center gap-2 font-semibold hover:scale-95 transition ${activeId !== null || addLoading ? 'text-gray-400 cursor-not-allowed' : 'text-[#2c6472]'
                }`}
            >
              {addLoading ? (
                <div className="w-4 h-4 border-[2.5px] border-[#2c6472] border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="text-lg font-bold">+</span>
              )}
              {t("add_certificate")}
            </button>

            <button
              onClick={activeId !== null && !deleteLoading ? handleDeleteCertificate : null}
              disabled={activeId === null || deleteLoading}
              className={`text-sm flex items-center gap-2 font-semibold hover:scale-95 transition ${activeId === null || deleteLoading ? 'text-gray-400 cursor-not-allowed' : 'text-red-500'
                }`}
            >
              {deleteLoading ? (
                <div className="w-4 h-4 border-[2.5px] border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <img src={trash} alt="trash icon" className="w-4 h-4 mr-1" />
              )}
              {t("remove_certificate")}
            </button>
          </div>

          <div className='flex justify-center mx-auto items-center mt-3'>
            <button
              onClick={activeId !== null && !updateLoading ? handleUpdateCertificate : null}
              disabled={activeId === null || updateLoading}
              className={`w-32 text-sm px-3 py-2 rounded-xl transition ${activeId !== null && !updateLoading ? 'bg-[#2c6472] text-white' : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
              {updateLoading ? (
                <div className="w-4 h-4 mx-auto border-[2.5px] border-[#2c6472] border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{t("save_changes")}</span>
              )}

            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatesUpdateForm;
