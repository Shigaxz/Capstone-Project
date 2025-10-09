import './SeleccionHorario.css'
//import { useState, useEffect } from 'react'
import DateDisplay from '../../componentes/DateDisplay';
function SeleccionHorario(){


//const [dia , setDia] = useState('Hoy');


return(<>

<div className="text-center text-4xl bg-amber-300 p-2">Seleccionar Horario</div>

<DateDisplay/>

<div className='flex justify-center items-center flex-col mt-2 sticky top-1.5'>
  <div className='bg-amber-300 w-52  py-0.5 rounded-lg shadow text-center font-medium'>cuek</div>
</div>



   


</>)
}
export default SeleccionHorario