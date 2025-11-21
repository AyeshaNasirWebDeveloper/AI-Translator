interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

const MODELS = [
  { code: 'gemini-pro', name: 'Gemini Pro' },
  { code: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro' },
  { code: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro' },
];

const TranslationModelSelector = ({
  selectedModel,
  onSelectModel,
}: ModelSelectorProps) => {
  return (
    <div className="my-4">
      <label htmlFor="translation-model" className="block mb-2 text-sm font-medium">
        Select translation model:
      </label>
      <select
        id="translation-model"
        value={selectedModel}
        onChange={(e) => onSelectModel(e.target.value)}
        className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        {MODELS.map((model) => (
          <option key={model.code} value={model.code}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TranslationModelSelector;
