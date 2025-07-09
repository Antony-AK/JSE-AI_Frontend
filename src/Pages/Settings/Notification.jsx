import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/api";

const Notification = () => {
  const [notifications, setNotifications] = useState(null);
  const [updating, setUpdating] = useState(false);

  // 🧠 Fetch Notification Preferences
  useEffect(() => {
    const fetchNotifications = async () => {
      const token = sessionStorage.getItem("authToken");

      try {
        const response = await fetch(`${BASE_URL}/settings/getnotification`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch notification settings");

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("❌ Fetch error:", error.message);
      }
    };

    fetchNotifications();
  }, []);

  // 📡 PUT to Update Notification Preference
  const handleToggle = async (key) => {
    if (!notifications) return;

    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    setUpdating(true);

    console.log("📤 Updating notification:", updated);

    try {
      const token = sessionStorage.getItem("authToken");

      const response = await fetch(`${BASE_URL}/settings/editnotification`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      });

      if (!response.ok) throw new Error("Failed to update notification");
      console.log("✅ Updated successfully");
    } catch (error) {
      console.error("❌ Update error:", error.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 py-3">
      {notifications && (
        <>
          {/* Subscription Notification */}
          <SettingToggle
            title="Subscription Notification"
            desc="Get alerts about your plan status, renewals, and package updates."
            value={notifications.subscription}
            onToggle={() => handleToggle("subscription")}
          />

          {/* Recommended Jobs */}
          <SettingToggle
            title="Recommended Jobs"
            desc="Receive job suggestions based on your profile and preferences."
            value={notifications.recommended_jobs}
            onToggle={() => handleToggle("recommended_jobs")}
          />

          {/* German Test */}
          <SettingToggle
            title="German Test"
            desc="Stay updated on your German proficiency test schedules and results."
            value={notifications.german_test}
            onToggle={() => handleToggle("german_test")}
          />

          {/* Announcements */}
          <SettingToggle
            title="Announcement & Update Settings"
            desc="Get notified about important announcements, feature updates, and policy changes."
            value={notifications.announcements}
            onToggle={() => handleToggle("announcements")}
          />
        </>
      )}

    </div>
  );
};

// ✅ Reusable Toggle UI
const SettingToggle = ({ title, desc, value, onToggle }) => (
  <div className="flex justify-between items-center">
    <div className="flex flex-col gap-1">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-[#000000b0] text-sm">{desc}</p>
    </div>
    <label className="relative inline-block w-10 h-6">
      <input
        type="checkbox"
        checked={value}
        onChange={onToggle}
        className="sr-only peer"
      />
      <div className="w-10 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#2c6472] transition-colors duration-300" />
      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-4 shadow" />
    </label>
  </div>
);

export default Notification;
