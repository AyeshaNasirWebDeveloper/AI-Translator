import { Server, Socket } from 'socket.io';
import { geminiService } from '../services';

interface CustomSocket extends Socket {
  language?: string;
}

export const setupSocket = (io: Server) => {
  io.on('connection', (socket: CustomSocket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join-room', (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
      socket.to(roomId).emit('user-connected', socket.id);
    });

    socket.on('offer', (data: { to: string; offer: any }) => {
      console.log(`Sending offer from ${socket.id} to ${data.to}`);
      io.to(data.to).emit('offer', { from: socket.id, offer: data.offer });
    });

    socket.on('answer', (data: { to: string; answer: any }) => {
      console.log(`Sending answer from ${socket.id} to ${data.to}`);
      io.to(data.to).emit('answer', { from: socket.id, answer: data.answer });
    });

    socket.on(
      'ice-candidate',
      (data: { to: string; candidate: RTCIceCandidate }) => {
        console.log(`Sending ICE candidate from ${socket.id} to ${data.to}`);
        io.to(data.to).emit('ice-candidate', {
          from: socket.id,
          candidate: data.candidate,
        });
      }
    );

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      // You might want to emit a 'user-disconnected' event to the room
    });

    // Translation related events
    socket.on('set-language', (language: string) => {
      socket.language = language;
      console.log(`User ${socket.id} set language to: ${language}`);
    });

    socket.on('set-transcription-model', (model: string) => {
      geminiService.setTranscriptionModel(model);
      console.log(`User ${socket.id} set transcription model to: ${model}`);
    });

    socket.on('set-translation-model', (model: string) => {
      geminiService.setTranslationModel(model);
      console.log(`User ${socket.id} set translation model to: ${model}`);
    });

    socket.on('start-translation', (roomId: string) => {
        console.log(`Translation started in room: ${roomId}`);
        // Here you can add logic to start the translation process
    });

    socket.on('audio-chunk', async (data: { roomId: string; chunk: any }) => {
        console.log(`Received audio chunk from ${socket.id} in room ${data.roomId}`);
        
        try {
            const transcription = await geminiService.transcribe(data.chunk);
            const targetLanguage = socket.language || 'es'; // Default to Spanish
            const translation = await geminiService.translate(transcription, targetLanguage);
            const audioData = await geminiService.textToSpeech(translation);

            io.to(data.roomId).emit('translated-audio', { audioData });
            io.to(data.roomId).emit('subtitles', { speaker: socket.id, text: translation });

        } catch (error) {
            console.error("Error processing audio chunk:", error);
        }
    });
  });
};
