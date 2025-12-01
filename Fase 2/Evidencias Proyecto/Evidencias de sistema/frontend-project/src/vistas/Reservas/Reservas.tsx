
import Nav from '../../componentes/Nav'
import Footer from '../../componentes/Footer'
import LocationCards from '../../componentes/reservas/LocationCards';
import CardReserva from '../../componentes/reservas/CardReserva';
import { Link } from 'react-router-dom';
function Reservas() {


  return (<>
    <Nav/>
     <div className="container mt-5 flex ml-2">
        <Link
          to="/"
          className="mb-4 px-4 underline italic"
        >
          ← Volver a Principal
        </Link>
      </div>
    <CardReserva/>  
    <LocationCards />
    <Footer/>
    </>
  );
}

export default Reservas;