// export const changeLanguageGoogleTranslate = (lang) => {
//   let retry = 0;
//   const maxRetries = 20;
//   const interval = setInterval(() => {
//     const select = document.querySelector("select.goog-te-combo");
//     if (select) {
//       console.log("🌍 Google Translate loaded. Switching to:", lang);
//       select.value = lang;
//       select.dispatchEvent(new Event("change"));
//       clearInterval(interval); // ✅ done!
//     } else {
//       console.log("⏳ Waiting for Google Translate dropdown... retry", retry);
//       retry++;
//       if (retry > maxRetries) {
//         console.warn("❌ Google Translate widget not ready after max retries.");
//         clearInterval(interval);
//       }
//     }
//   }, 300); // Try every 300ms
// };
