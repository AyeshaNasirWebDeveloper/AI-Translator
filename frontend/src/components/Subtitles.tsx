interface SubtitlesProps {
  subtitles: { speaker: string; text: string }[];
}

const Subtitles = ({ subtitles }: SubtitlesProps) => {
  return (
    <div className="mt-6 p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-bold mb-2">Subtitles</h3>
      <div className="h-40 overflow-y-auto">
        {subtitles.map((subtitle, index) => (
          <div key={index} className="mb-2">
            <span className="font-bold text-blue-400">{subtitle.speaker}: </span>
            <span>{subtitle.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subtitles;
