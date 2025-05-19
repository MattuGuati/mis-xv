// src/pages/Tables.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExcel = async () => {
      const res = await fetch("/data/mesas.xlsx");
      const blob = await res.blob();
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const parsed = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const grouped = parsed.reduce((acc, row, i) => {
          if (i === 0) return acc; // skip header
          const [mesa, nombre] = row;
          if (!mesa) return acc;
          if (!acc[mesa]) acc[mesa] = [];
          if (nombre) acc[mesa].push(nombre);
          return acc;
        }, {});

        setTables(Object.entries(grouped));
      };

      reader.readAsArrayBuffer(blob);
    };

    fetchExcel();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-white relative">
      <button onClick={() => navigate("/")} className="back-button">←</button>
      <div className="w-full max-w-3xl space-y-4">
        {tables.map(([mesa, invitados], index) => (
          <div key={index} className="bg-white bg-opacity-10 backdrop-blur-sm p-4 rounded border-2 border-yellow-500">
            <h3 className="text-yellow-300 text-lg font-bold mb-2">Mesa {mesa}</h3>
            <ul className="text-white text-sm list-disc list-inside">
              {invitados.map((nombre, idx) => (
                <li key={idx}>{nombre}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
