import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './App.css';

function App() {
  const [resultado, setResultado] = useState('');
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    const qrRegionId = 'lector-qr';

    if (!html5QrCodeRef.current) {
      html5QrCodeRef.current = new Html5Qrcode(qrRegionId);
    }

    const html5QrCode = html5QrCodeRef.current;

    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length) {
        html5QrCode
          .start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
              setResultado(decodedText);
              enviarDatos(decodedText);
              html5QrCode.stop().catch(console.error);
            }
          )
          .catch(console.error);
      }
    });

    return () => {
      if (html5QrCode.getState() === 2) {
        html5QrCode.stop().then(() => html5QrCode.clear()).catch(console.error);
      }
    };
  }, []);

  const enviarDatos = (texto) => {
    fetch('https://script.google.com/macros/s/AKfycbwMOzeIl2AB5Aizh4O2cdDwkN6iS3mvP0ho0D6k4XmalBPvnb6jba9MtzSIMq7qnMWV/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qr: texto }),
    })
      .then((res) => res.json())
      .then((data) => console.log('Datos enviados:', data))
      .catch((err) => console.error('Error al enviar:', err));
  };

  return (
    <div className="contenedor">
      <h2 className="titulo">Registro Juventud Idente</h2>
      <div id="lector-qr" className="lector" />
      <p className="resultado">📎 Código leído: {resultado}</p>
    </div>
  );
}

export default App;
