import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Greetings() {
  const navigate = useNavigate();
  const [view, setView] = useState("menu");

  // ------------------------- INACTIVIDAD -------------------------
  useEffect(() => {
    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      if (view !== "menu") {
        timer = setTimeout(() => navigate("/"), 60000);
      }
    };
    window.addEventListener("click", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();
    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, [view, navigate]);

  // ------------------------- FIRMA -------------------------
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]);
  const [currentStroke, setCurrentStroke] = useState([]);
  const [persistedStrokes, setPersistedStrokes] = useState([]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { x, y } = getCoords(e);
    setCurrentStroke([{ x, y }]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getCoords(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    setCurrentStroke((prev) => [...prev, { x, y }]);
  };

  const stopDrawing = () => {
    if (isDrawing && currentStroke.length > 0) {
      const updatedStrokes = [...strokes, currentStroke];
      setStrokes(updatedStrokes);
      setPersistedStrokes(updatedStrokes);
    }
    setIsDrawing(false);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
  };

  const getCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const redrawCanvas = (allStrokes) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    allStrokes.forEach((stroke) => {
      ctx.beginPath();
      stroke.forEach((point, idx) => {
        if (idx === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    });
  };

  const deleteLastStroke = () => {
    const newStrokes = [...strokes];
    newStrokes.pop();
    setStrokes(newStrokes);
    setPersistedStrokes(newStrokes);
    redrawCanvas(newStrokes);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `firma_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStrokes([]);
    setPersistedStrokes([]);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    if (view === "signature" && persistedStrokes.length > 0) {
      setStrokes(persistedStrokes);
      redrawCanvas(persistedStrokes);
    }
  }, [view]);

  // ------------------------- FOTO -------------------------
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const startCamera = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({ video: { width: 1920, height: 1080 } });
    videoRef.current.srcObject = localStream;
    setStream(localStream);
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
  };

  const triggerPhoto = () => {
    setShowCountdown(true);
    let counter = 3;
    const interval = setInterval(() => {
      setCountdown(counter);
      counter--;
      if (counter < 0) {
        clearInterval(interval);
        takePhoto();
        setShowCountdown(false);
      }
    }, 1000);
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    photoRef.current.src = canvas.toDataURL("image/png");
    setPhotoTaken(true);
  };

  const savePhoto = () => {
    const link = document.createElement("a");
    link.href = photoRef.current.src;
    link.download = `foto_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setPhotoTaken(false);
  };

  // ------------------------- VIDEO -------------------------
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const startRecording = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({ video: { width: 1920, height: 1080 }, audio: true });
    videoRef.current.srcObject = localStream;
    const recorder = new MediaRecorder(localStream);
    setMediaRecorder(recorder);
    setRecordedChunks([]);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) setRecordedChunks((prev) => [...prev, e.data]);
    };
    recorder.start();
    setStream(localStream);
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    stream.getTracks().forEach((track) => track.stop());
    setRecording(false);
    Swal.fire({
      title: "¿Qué desea hacer?",
      showDenyButton: true,
      confirmButtonText: "Guardar",
      denyButtonText: "Descartar",
    }).then((result) => {
      if (result.isConfirmed) {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `video_${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  };

  useEffect(() => {
    if (view === "photo" || view === "video") startCamera();
    return stopCamera;
  }, [view]);

  // ------------------------- RENDER -------------------------
  const renderView = () => {
    switch (view) {
      case "signature":
        return (
          <div className="flex flex-col items-center">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseMove={draw}
              className="bg-white border-4 border-yellow-500 rounded-lg"
            />
            <div className="mt-4 flex gap-4">
              <button className="main-button" onClick={deleteLastStroke}>Borrar última firma</button>
              <button className="main-button" onClick={saveSignature}>Guardar y nuevo lienzo</button>
            </div>
          </div>
        );

      case "photo":
        return (
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-3xl aspect-video border-4 border-yellow-500 rounded-lg overflow-hidden bg-black">
              <video ref={videoRef} autoPlay playsInline className={`w-full h-full ${photoTaken ? "hidden" : "block"}`} />
              <img ref={photoRef} alt="captured" className={`w-full h-full ${photoTaken ? "block" : "hidden"}`} />
              {showCountdown && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-7xl font-bold bg-black bg-opacity-50">
                  {countdown}
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-4">
              {!photoTaken && <button className="main-button" onClick={triggerPhoto}>Tomar Foto</button>}
              {photoTaken && (
                <>
                  <button className="main-button" onClick={() => setPhotoTaken(false)}>Repetir</button>
                  <button className="main-button" onClick={savePhoto}>Guardar</button>
                </>
              )}
            </div>
          </div>
        );

      case "video":
        return (
          <div className="flex flex-col items-center">
            <video ref={videoRef} autoPlay playsInline muted className="w-full max-w-3xl border-4 border-yellow-500 rounded-lg" />
            <div className="mt-4">
              {recording ? (
                <button className="main-button" onClick={stopRecording}>Detener</button>
              ) : (
                <button className="main-button" onClick={startRecording}>Iniciar</button>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center">
            <p className="mb-4 text-lg font-medium text-center">Elige una acción para enviar tu saludo.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="main-button" onClick={() => setView("signature")}>Firmar</button>
              <button className="main-button" onClick={() => setView("photo")}>Tomar Foto</button>
              <button className="main-button" onClick={() => setView("video")}>Grabar Video</button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-4 relative">
      <button onClick={() => { setPersistedStrokes(strokes); navigate("/"); }} className="back-button">←</button>
      {renderView()}
    </div>
  );
}
