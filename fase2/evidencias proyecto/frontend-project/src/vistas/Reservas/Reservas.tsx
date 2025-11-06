
import Nav from '../../componentes/Nav'
import Footer from '../../componentes/Footer'
import LocationCards from '../../componentes/reservas/LocationCards';
import CardReserva from '../../componentes/reservas/CardReserva';
function Reservas() {


  return (<>
    <Nav/>
    <CardReserva/>  
    <LocationCards />
    <Footer/>
    </>
  );
}

export default Reservas;