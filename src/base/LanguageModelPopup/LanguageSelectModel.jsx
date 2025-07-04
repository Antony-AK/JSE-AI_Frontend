const LanguageSelectModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-md shadow-lg flex flex-col gap-2 p-6 w-[550px] border-b-8 border-[#2c6472] h-[250px] text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Select a language</h2>
        <p className="text-sm text-gray-600 mb-6">Choose a language to generate your document</p>

        <div className="flex justify-center gap-8">
          <button
            onClick={() => onSelect("english")}
            className="px-4 py-2 bg-[#2C6472] text-white rounded hover:bg-[#234f58]"
          >
            English
          </button>
          <button
            onClick={() => onSelect("german")}
            className="px-4 py-2 bg-[#2C6472] text-white rounded hover:bg-[#234f58]"
          >
            German
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// ❌ Wrong: export default LanguageSelectModal();
// ✅ Correct:
export default LanguageSelectModal;
