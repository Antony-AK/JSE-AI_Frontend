import React, { useState, useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";
import ModernDeedy from "../../base/DocumentEditor/CV/ModernDeedy";
import EuropassCV from "../../base/DocumentEditor/CV/EuropassCV";
import ModernClassic from "../../base/DocumentEditor/CV/ModernClassic";
import ThirdCV from "../../base/DocumentEditor/CV/CV-Third-Template";
import PlushCV from "../../base/DocumentEditor/CV/PlushCV";

import CoverLetterModern from "../../base/DocumentEditor/CL/CL-Third-Temp";
import CoverLetterPlush from "../../base/DocumentEditor/CL/CoverLetterPlush";
import ClPreview from "../../base/DocumentEditor/CL/ClTemp";
import { toast } from "react-toastify";
import ExternalModernDeedy from "../../base/DocumentEditor/CV/ExternalModernDeedy";
import ExternalPlushCV from "../../base/DocumentEditor/CV/ExternalPlushCV";
import ExternalEuropassCV from "../../base/DocumentEditor/CV/ExternalEuropassCV";
import ExternalModernClassic from "../../base/DocumentEditor/CV/ExternalModernClassic";
import ExternalThirdCV from "../../base/DocumentEditor/CV/External-CV-Third-Template";
import ExternalCoverLetterModern from "../../base/DocumentEditor/CL/External-CL-Third-Temp";
import ExternalCoverLetterPlush from "../../base/DocumentEditor/CL/ExternalCoverLetterPlush";
import ExternalClTemp from "../../base/DocumentEditor/CL/ExternalClTemp";

const templateMap = {
  ModernDeedy,
  PlushCV,
  ThirdCV,
  EuropassCV,
  ModernClassic,
  ExternalModernDeedy,
  ExternalPlushCV,
  ExternalEuropassCV,
  ExternalModernClassic,
  ExternalThirdCV


};

const clTemplates = {
  ModernCL: CoverLetterModern,
  PlushCL: CoverLetterPlush,
  ClassisCL: ClPreview,
  ExternalModernCL: ExternalCoverLetterModern,
  ExternalPlushCL: ExternalCoverLetterPlush,
  ExternalClassicCL: ExternalClTemp,
};



const DownloadHandler = ({ data, onFinish, type = "cv" }) => {
  const previewRef = useRef(null);
  const [language, setLanguage] = useState(() => sessionStorage.getItem("selectedLanguage") || "en");


  console.log("📄 CV:", type === "cv" ? data : undefined);
  console.log("✉️ CL:", type === "cl" ? data : undefined);
  console.log("lang", data?.language || "english");

  const format = data?.format;

  console.log("✅ Selected format:", format);


  if (!data || !format) {
    console.warn("⚠️ Missing data or format");
    onFinish?.();
    return null;
  }

  useEffect(() => {
    if (!data) return;

    const timeout = setTimeout(() => {
      const element = previewRef.current;
      if (!element) return console.warn("⛔ No element found for download!");

      requestAnimationFrame(() => {
        const opt = {
          margin: 0,
          filename: type === "cv" ? "CV.pdf" : "Cover_Letter.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" },
        }

        html2pdf()
          .set(opt)
          .from(element)
          .save()
          .then(() => {
            console.log(`✅ ${type.toUpperCase()} downloaded`);
            onFinish?.();
          });
      });
    }, 600);


    return () => clearTimeout(timeout);
  }, [data, type, onFinish]);

  if (!data) return null;

  const SelectedTemplate = type === "cl"
    ? clTemplates[format || "ModernCL"]
    : templateMap[format || "ModernDeedy"];


  if (!SelectedTemplate) {
    toast.error(`❌ Template not found for ${type === "cl" ? data?.cl_format : data?.cv_format}`);
    return null; // stop rendering here
  }

  if (type === "cl") {
    const cl = data || {}; // 🧠 FIXED LINE

    const clProps = {
      personalInfo: {
        name: cl.name || "",
        title: cl.title || "",
        mail: cl.mail || "",
        contact: cl.contact || "",
        address: cl.address || "[ address ]",
        website: cl.website || "",
      },
      paragraphs: cl.paragraphs || [],
      recipient: cl.recipient || {},
      language,
    };

    return (
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div
          ref={previewRef}
          style={{
            width: "794px",
            height: "1123px",
            backgroundColor: "#fff",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <SelectedTemplate {...clProps} />
        </div>
      </div>
    );
  }

  const cvData = data || {};

  const normalizeCvData = (cvData) => ({
    personalInfo: {
      Name: cvData.personal_info?.name || "",
      Title: cvData.personal_info?.title || "",
      Mail: cvData.personal_info?.mail || "",
      Phone: cvData.personal_info?.phone || "",
      Address: cvData.personal_info?.address || "",
      LinkedIn: cvData.personal_info?.linkedin || "",
      Website: cvData.personal_info?.portfolio || "",
    },
    professionalSummary: {
      title: "Professional Summary",
      content: cvData.profile_summary || "",
    },
    workExperience: {
      title: "Work Experience",
      content: (cvData.work_experience || []).map((item) => ({
        Role: item.position || "",
        Company: item.company_name || "",
        Duration: item.period || "",
        Description: Array.isArray(item.description)
          ? item.description
          : [item.description || ""],
      })),
    },
    education: {
      title: "Education",
      content: (cvData.education || []).map((entry) => ({
        degree: entry.degree || entry || "",
        city: entry.city || "",
        school: entry.school || "",
        field_of_study: entry.field_of_study || "",
        end_date: entry.end_date || "",
        achievements: entry.achievements || "",
      })),
    },
    projects: {
      title: "Projects",
      content: (cvData.projects || []).map((item) => ({
        Name: item.project_name || "",
        Company: item.company_name || "",
        Duration: item.period || "",
        Skills: item.skills_used || "",
        Description: Array.isArray(item.description)
          ? item.description
          : [item.description || ""],
      })),
    },
    certificates: {
      title: "Certificates",
      content: (cvData.certifications || []).map((item) => ({
        certificate_name: item.certificate_name || item || "",
        provider: item.provider || "",
      })),
    },
    skills: {
      title: "Skills",
      content: cvData.skills || [],
    },
    languages: {
      title: "Languages",
      content: (cvData.languages || []).map((lang) => ({
        language: lang.language || "",
        proficiency: lang.proficiency || "",
      })),
    },
    language,
  });

  const normalizedProps = normalizeCvData(cvData);




  return (
    <div style={{ position: "absolute", left: "-9999px", top: 0, width: "794px" }}>
      <div
        ref={previewRef}
        style={{
          width: "794px",
          backgroundColor: "#fff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <SelectedTemplate {...normalizedProps} />
      </div>
    </div>
  );

};

export default DownloadHandler;
