
import Nav from '../componentes/Nav'
import Footer from '../componentes/Footer'

function Reservas() {
  return (<>
    <Nav/>
    <div>
      <h1>Reservas</h1>
      <h1>Reservas Page</h1>
      <p>This is the reservations page.</p>
      <h2>Sample Reservation</h2>
      <p>
        <strong>ID:</strong> 123
      </p>
      <p>
        <strong>Date:</strong> 2024-01-20
      </p>
      <p>
        <strong>Location:</strong> CITT
      </p>
    </div>
    <Footer/>
    </>
  );
}

export default Reservas;