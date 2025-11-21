import { useState, useRef, useEffect } from 'react';
import { useWebRTC } from '../hooks/useWebRTC';
import LanguageSelector from './LanguageSelector';
import Subtitles from './Subtitles';
import Waveform from './Waveform';
import TranscriptionModelSelector from './TranscriptionModelSelector';
import TranslationModelSelector from './TranslationModelSelector';

const CallUI = () => {
  const [roomId] = useState('test-room');
  const { localStream, remoteStreams, subtitles, socket } = useWebRTC(roomId);
  const [language, setLanguage] = useState('en');
  const [transcriptionModel, setTranscriptionModel] = useState('gemini-pro');
  const [translationModel, setTranslationModel] = useState('gemini-pro');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (socket) {
      socket.emit('set-language', newLanguage);
    }
  };

  const handleTranscriptionModelChange = (newModel: string) => {
    setTranscriptionModel(newModel);
    if (socket) {
      socket.emit('set-transcription-model', newModel);
    }
  };

  const handleTranslationModelChange = (newModel: string) => {
    setTranslationModel(newModel);
    if (socket) {
      socket.emit('set-translation-model', newModel);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2">Local Stream</h2>
          <video ref={localVideoRef} autoPlay playsInline muted />
          <Waveform stream={localStream} />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Remote Streams</h2>
          <div ref={remoteVideosRef} className="grid grid-cols-1 gap-4">
            {Object.entries(remoteStreams).map(([userId, stream]) => (
              <video
                key={userId}
                ref={(video) => {
                  if (video) video.srcObject = stream;
                }}
                autoPlay
                playsInline
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <LanguageSelector selectedLanguage={language} onSelectLanguage={handleLanguageChange} />
        <TranscriptionModelSelector selectedModel={transcriptionModel} onSelectModel={handleTranscriptionModelChange} />
        <TranslationModelSelector selectedModel={translationModel} onSelectModel={handleTranslationModelChange} />
      </div>
      <Subtitles subtitles={subtitles} />
    </div>
  );
};

export default CallUI;
