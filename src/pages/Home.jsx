// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../public/images/background.jpg"; // asegura que exista la imagen

function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center text-center text-white"
      style={{
        backgroundImage: "url(/images/background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 drop-shadow-lg">
        Mis XV Martina
      </h1>
      <div className="flex flex-col items-center space-y-4">
        <button className="main-button" onClick={() => navigate("/book")}>
          VER BOOK
        </button>
        <button className="main-button" onClick={() => navigate("/saludos")}>
          ENVIAR SALUDOS
        </button>
        <button className="main-button" onClick={() => navigate("/mesas")}>
          VER MESAS
        </button>
        <button className="main-button" onClick={() => navigate("/cancion")}>
          PEDIR CANCIÓN
        </button>
      </div>
      <p className="mt-6 text-sm text-white drop-shadow">
        Selecciona una opción para navegar.
      </p>
    </div>
  );
}

export default Home;
