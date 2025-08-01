import { t } from "../../utils/i18n";

const LanguageSelectModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-md shadow-lg flex flex-col gap-2 p-6 w-[570px] border-b-8 border-[#2c6472] h-[320px] text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {t("languageModal.title")}
        </h2>
        <p className="text-sm text-gray-600 mb-6 border p-4 border-emerald-900">
          {t("languageModal.description")}
        </p>
        <div className="flex justify-center gap-8">
          <button
            onClick={() => onSelect("english")}
            className="px-4 py-2 bg-[#2C6472] text-white rounded hover:bg-[#234f58]"
          >
            {t("languageModal.english")}
          </button>
          <button
            onClick={() => onSelect("german")}
            className="px-4 py-2 bg-[#2C6472] text-white rounded hover:bg-[#234f58]"
          >
            {t("languageModal.german")}
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:underline"
        >
          {t("languageModal.cancel")}
        </button>
      </div>
    </div>
  );
};

export default LanguageSelectModal;
