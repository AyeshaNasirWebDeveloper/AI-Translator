import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const useWebRTC = (roomId: string) => {
  const [socket, setSocket] = useState<any>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  const [subtitles, setSubtitles] = useState<{ speaker: string; text: string }[]>([]);
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    const newSocket = io(BACKEND_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join-room', roomId);
    });

    const initializeLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setLocalStream(stream);
        startStreamingAudio(stream, newSocket);
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    initializeLocalStream();

    newSocket.on('user-connected', (userId: string) => {
      console.log('User connected:', userId);
      const pc = createPeerConnection(userId, newSocket, localStream);
      sendOffer(userId, pc, newSocket);
    });

    newSocket.on('offer', (data: { from: string; offer: RTCSessionDescriptionInit }) => {
      console.log('Received offer from:', data.from);
      handleOffer(data.from, data.offer, newSocket, localStream);
    });

    newSocket.on('answer', (data: { from: string; answer: RTCSessionDescriptionInit }) => {
      console.log('Received answer from:', data.from);
      handleAnswer(data.from, data.answer);
    });

    newSocket.on('ice-candidate', (data: { from: string; candidate: RTCIceCandidateInit }) => {
      console.log('Received ICE candidate from:', data.from);
      handleIceCandidate(data.from, data.candidate);
    });

    newSocket.on('user-disconnected', (userId: string) => {
      console.log('User disconnected:', userId);
      closePeerConnection(userId);
    });
    
    newSocket.on('translated-audio', (data: { audioData: any }) => {
        const blob = new Blob([data.audioData], { type: 'audio/mpeg' });
        const url = window.URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
    });

    newSocket.on('subtitles', (data: { speaker: string; text: string }) => {
      setSubtitles(prev => [...prev, data]);
    });

    return () => {
      newSocket.disconnect();
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      Object.values(peerConnections.current).forEach(pc => pc.close());
    };
  }, [roomId]);

  const startStreamingAudio = (stream: MediaStream, socket: any) => {
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        socket.emit('audio-chunk', { roomId, chunk: event.data });
      }
    };
    mediaRecorder.current.start(1000); // Capture 1-second chunks
  };

  const createPeerConnection = (userId: string, socket: any, stream: MediaStream | null) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    if (stream) {
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { to: userId, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStreams(prev => ({ ...prev, [userId]: event.streams[0] }));
    };

    peerConnections.current[userId] = pc;
    return pc;
  };

  const sendOffer = async (userId: string, pc: RTCPeerConnection, socket: any) => {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit('offer', { to: userId, offer });
  };

  const handleOffer = async (userId: string, offer: RTCSessionDescriptionInit, socket: any, stream: MediaStream | null) => {
    const pc = createPeerConnection(userId, socket, stream);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    sendAnswer(userId, pc, socket);
  };

  const sendAnswer = async (userId: string, pc: RTCPeerConnection, socket: any) => {
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit('answer', { to: userId, answer });
  };

  const handleAnswer = async (userId: string, answer: RTCSessionDescriptionInit) => {
    const pc = peerConnections.current[userId];
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleIceCandidate = async (userId: string, candidate: RTCIceCandidateInit) => {
    const pc = peerConnections.current[userId];
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const closePeerConnection = (userId: string) => {
    if (peerConnections.current[userId]) {
      peerConnections.current[userId].close();
      delete peerConnections.current[userId];
    }
    setRemoteStreams(prev => {
      const newStreams = { ...prev };
      delete newStreams[userId];
      return newStreams;
    });
  };

  return { localStream, remoteStreams, subtitles, socket };
};
