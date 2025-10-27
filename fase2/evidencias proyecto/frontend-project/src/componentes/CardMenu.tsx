import './componentes_css/CardMenu.css';
import { Link } from 'react-router-dom';

const CardMenu = () => {
  return (
    <div className='container mt-8 mx-auto px-4'> 
        <h1 className="text-4xl text-left">Nuestros espacios</h1>
        <h3 className='itext text-left mb-6'> 
            <i>Entérate de lo que está pasando en nuestras escuelas</i>
        </h3> 
      <div className="flex justify-center gap-6 md:gap-8">

        <div className="card">
          <img
            src="https://www.duoc.cl/wp-content/uploads/2025/02/slider_web_online_2025C-960x600.png"
            className="card-image"
            alt="Reserva de espacios"
          />
          <p className="card-text">Reserva un espacio</p>
          <Link to="/reservas"><button className="card-button">Reservar</button></Link>
        </div>
        <div className="card">
          <img
            src="https://www.duoc.cl/wp-content/uploads/2025/02/slider_web_online_2025C-960x600.png"
            className="card-image"
            alt="Memorias"
          />
          <p className="card-text">Nuestros Estudiantes</p>
          <Link to="/memorias"><button className="card-button">Ver Memorias</button></Link>
        </div>
      </div>
    </div>
  );
};

export default CardMenu;