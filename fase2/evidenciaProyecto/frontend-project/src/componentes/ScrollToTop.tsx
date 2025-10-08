import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop ()  {
  // Obtiene el objeto de ubicación (location object) del router
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuando 'pathname' (la ruta actual) cambia, desplaza la ventana a la parte superior.
    // 'window.scrollTo(0, 0)' establece la posición de desplazamiento en (x=0, y=0).
    window.scrollTo(0, 0);
  }, [pathname]); // El efecto se ejecuta cada vez que 'pathname' cambia.

  // Este componente no renderiza nada, solo maneja efectos secundarios.
  return null;
};

export default ScrollToTop;