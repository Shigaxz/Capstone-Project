import './componentes_css/CardMenu.css';
import { Link } from 'react-router-dom';

import image1 from '../assets/imgBiblio/E_Biblioteca_1.jpg';
import image2 from '../assets/imgSedes/sede_maipu-1.jpg';



const CardMenu = () => {
  return (
<div className="container mt-10 mx-auto px-4">
  <h1 className="text-4xl text-left">Nuestros espacios</h1>
  <h3 className="itext text-left mb-6">
    <i>Entérate de lo que está pasando en nuestras escuelas</i>
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
    <Link to="/reservas">
    <div className="relative group overflow-hidden  shadow-lg cursor-pointer h-80">
      <img
        src={image1}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 z-0"
      />
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <h2 className="text-white italic text-3xl md:text-4xl font-semibold tracking-wide text-center drop-shadow-lg transition-transform duration-500 group-hover:translate-y-[-4px]">
          Reserva de espacios
        </h2>
      </div>
    </div>
    </Link>
    <Link to="/memorias">
    <div className="relative group overflow-hidden  shadow-lg cursor-pointer h-80">
      <img
        src={image2}
        alt="Sedes y Campus"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 z-0"
      />
      <div className="absolute inset-0 flex items-center justify-center z-20">
          <h2 className="text-white italic text-3xl md:text-4xl font-semibold tracking-wide text-center drop-shadow-lg transition-transform duration-500 group-hover:translate-y-[-4px]">
          Memorias 
        </h2>
      </div>
    </div>
    </Link>
  </div>
</div>

 


  );
};

export default CardMenu;