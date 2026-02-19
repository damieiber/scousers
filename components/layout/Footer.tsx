import React from 'react';

export function Footer() {
  return (
    <footer className="bg-black text-white py-2 mt-auto border-t-4 border-primary">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-bold mb-1 tracking-tight">FanNews River Plate</h3>
        <p className="text-gray-400 text-xs max-w-md mb-2">
          Tu fuente número uno de noticias, estadísticas e historia del Más Grande. 
          Hecho por hinchas, para hinchas.
        </p>
        <div className="text-[10px] text-gray-600">
          &copy; {new Date().getFullYear()} FanNews. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
