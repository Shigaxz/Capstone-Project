
import Nav from '../../componentes/Nav'
import Footer from '../../componentes/Footer'
import CardSedes from '../../componentes/CardSedes';
import { useEffect, useState } from 'react';
import { listaSedes } from '../../utils/sedesUtils'; 

import LocationCards from '../../componentes/reservas/LocationCards';
function Reservas() {
  const [laslistaSedes, setListaSedes ] = useState(listaSedes);
  useEffect(()=>{
    setListaSedes(listaSedes)
  },[])

  return (<>
    <Nav/>
    <h1 className='text-center bg-black text-amber-100 p-3 mb-3 sticky top-0 text-2xl font-serif'>Selecciona el Espacio</h1>
    
    <LocationCards />
    <Footer/>
    </>
  );
}

export default Reservas;