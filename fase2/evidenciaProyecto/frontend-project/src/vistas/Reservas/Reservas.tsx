
import Nav from '../../componentes/Nav'
import Footer from '../../componentes/Footer'
import CardSedes from '../../componentes/CardSedes';
interface infoSede {
  nombre:string;
  imagen:string;
  direccion:string;

}
function Reservas() {

  const listaSedes:infoSede[]=[
    {
      nombre:'Sede San Bernardo',
      imagen:'https://www.duoc.cl/wp-content/uploads/2020/06/san-bernardo.jpg',
      direccion:'Freire 857, San Bernardo.'
    },
    {
      nombre:'Sede Alameda',
      imagen:'https://www.duoc.cl/wp-content/uploads/2020/06/Alameda.jpg',
      direccion:'Av. España 8, Santiago Centro, Metro Estación República (esquina Alameda).'
    },
    {
      nombre:'Sede Antonio Varas',
      imagen:'https://www.duoc.cl/wp-content/uploads/2020/06/Antonio-varas.jpg',
      direccion:'Antonio Varas 666, Providencia.'
    },
    {
      nombre:'Sede Educacion continua',
      imagen:'https://www.duoc.cl/wp-content/uploads/2020/06/educacion-continua.jpg',
      direccion:'Miguel Claro 337, Providencia, Santiago.'
    },
    {
      nombre:'Sede Melipilla',
      imagen:'https://www.duoc.cl/wp-content/uploads/2020/06/melipilla-2.jpg',
      direccion:'Serrano 1105, Melipilla.'
    },
  ]

  return (<>
    <Nav/>
    <h1 className='text-center bg-black text-amber-100 p-3 mb-3 sticky top-0 text-2xl font-serif'>Selecciona la Sede</h1>
    <div className=''>
      {listaSedes.map((sede)=>(

<CardSedes titulo={sede.nombre} imagen={sede.imagen} direccion={sede.direccion}/>
   
   ))}
    </div>
    
    
    <Footer/>
    </>
  );
}

export default Reservas;