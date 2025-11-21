interface LanguageSelectorProps {
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
];

const LanguageSelector = ({
  selectedLanguage,
  onSelectLanguage,
}: LanguageSelectorProps) => {
  return (
    <div className="my-4">
      <label htmlFor="language" className="block mb-2 text-sm font-medium">
        Select your language:
      </label>
      <select
        id="language"
        value={selectedLanguage}
        onChange={(e) => onSelectLanguage(e.target.value)}
        className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
