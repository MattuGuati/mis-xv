import React from "react";
import { useNavigate } from "react-router-dom";

export default function QRSection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-4 relative">
      {/* Botón volver */}
      <button onClick={() => navigate("/")} className="back-button">←</button>

      {/* Texto descriptivo */}
      <p className="mb-6 text-lg font-medium text-center">
        Escaneá el QR para pedir tu canción por WhatsApp.
      </p>

      {/* Imagen del QR */}
      <img
        src="/images/qr.png"
        alt="QR para WhatsApp"
        className="w-64 h-auto shadow-lg rounded-xl"
      />
    </div>
  );
}
