import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './App.css';

function App() {
  const [resultado, setResultado] = useState('');
  const qrRegionId = "lector-qr";

  useEffect(() => {
    const qrCode = new Html5Qrcode(qrRegionId);
    qrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        setResultado(decodedText);
        qrCode.stop();
        enviarDatos(decodedText);
      },
      (err) => {}
    ).catch(err => console.error("Error al iniciar cámara:", err));

    return () => {
      qrCode.stop().catch(err => {});
    };
  }, []);

  const enviarDatos = (texto) => {
    fetch("https://script.google.com/macros/s/AKfycbwMOzeIl2AB5Aizh4O2cdDwkN6iS3mvP0ho0D6k4XmalBPvnb6jba9MtzSIMq7qnMWV/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qr: texto })
    })
    .then(res => res.json())
    .then(data => console.log("Enviado:", data))
    .catch(err => console.error("Error al enviar:", err));
  };

  return (
    <div className="contenedor">
      <h2 className="titulo">Registro Juventud Idente</h2>
      <div id="lector-qr" className="lector"></div>
      <p className="resultado">📎 Código leído: {resultado}</p>
    </div>
  );
}

export default App;
