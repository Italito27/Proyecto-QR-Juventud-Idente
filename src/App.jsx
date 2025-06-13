import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { supabase } from './supabaseClient';
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

  const enviarDatos = async (texto) => {
    const [cedula, fechaRaw] = texto.split('#');
    if (!cedula || !fechaRaw) {
      alert("Código QR inválido");
      return;
    }

    const now = new Date();
    const hora = now.toTimeString().split(' ')[0];
    const fecha = `${fechaRaw.slice(0, 4)}-${fechaRaw.slice(4, 6)}-${fechaRaw.slice(6)}`;
    const tipo = 'entrada'; // Puedes modificar esto según tu lógica

    const { error } = await supabase.from('asistencias').insert([
      { cedula, fecha, hora, tipo }
    ]);

    if (error) {
      console.error("❌ Supabase error:", error);
      alert("No se pudo registrar la asistencia");
    } else {
      console.log("✅ Registro guardado:", data);
      alert(`Asistencia registrada: ${cedula}`);
    }
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
