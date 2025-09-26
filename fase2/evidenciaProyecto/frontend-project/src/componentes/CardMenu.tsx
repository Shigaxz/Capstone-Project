
import './componentes_css/CardMenu.css';
import { Link } from 'react-router-dom';

const CardMenu = () => {
  return (
    <div className='container mt-8 ml-5'>
        <h1 className="text-2xl">Nuestros espacios</h1>
        <h3 className='itext'>
            <i>Entérate de lo que está pasando en nuestras escuelas</i>
        </h3> 
    <div className="between-container">
      
      <div className="card">
        <img
          src="https://www.duoc.cl/wp-content/uploads/2025/02/slider_web_online_2025C-960x600.png"
          className="card-image"
        />
        <p className="card-text">Reserva un espacio</p>
        <Link to="/Reservas"><button className="card-button">Ver Reservas</button></Link>
      </div>

      <div className="card">
        <img
          src="https://www.duoc.cl/wp-content/uploads/2025/02/slider_web_online_2025C-960x600.png"
          className="card-image"
        />
        <p className="card-text">Nuestros Estudiantes</p>
        <Link to="/Memorias"><button className="card-button">Ver Memorias</button></Link>
      </div>
    </div>
    </div>
  );
};

export default CardMenu;
