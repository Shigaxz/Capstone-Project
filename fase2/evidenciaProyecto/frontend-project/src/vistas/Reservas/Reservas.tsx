
import Nav from '../../componentes/Nav'
import Footer from '../../componentes/Footer'
import CardSedes from '../../componentes/CardSedes';
import { useEffect, useState } from 'react';
import { getSedes } from '../../utils/sedesUtils'; 

function Reservas() {
  const [listaSedes, setListaSedes ] = useState(getSedes());
  useEffect(()=>{
    setListaSedes(getSedes())
  },[])

  return (<>
    <Nav/>
    <h1 className='text-center bg-black text-amber-100 p-3 mb-3 sticky top-0 text-2xl font-serif'>Selecciona el Espacio</h1>
    <div className=''>
      {listaSedes.map((sede)=>(

<CardSedes key={sede.nombre} titulo={sede.nombre} imagen={sede.imagen} direccion={sede.direccion} espacios={sede.espacios}/>
   
   ))}
    </div>
    
    
    <Footer/>
    </>
  );
}

export default Reservas;