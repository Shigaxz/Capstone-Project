import './SeleccionHorario.css'
import { useState, useCallback } from 'react'
import DateDisplay from '../../componentes/DateDisplay';
import HorarioEspacio from '../../componentes/HorarioEspacio';
function SeleccionHorario(){


const [dia , setDia] = useState('');
const handleChildData = useCallback((data:string)=>{
  setDia(data);
},[])

return(<>

<div className="text-center text-4xl bg-amber-300 p-2">Seleccionar Horario</div>

<DateDisplay onChildData={handleChildData}/>

<div className='flex justify-center items-center flex-col my-2 sticky top-1.5'>
  <div className='bg-amber-300 w-52  py-0.5 rounded-lg shadow text-center font-medium'>{dia}</div>
</div>


<HorarioEspacio nombreSede='Sede Alameda' espacioSede='CITT'/>
   


</>)
}
export default SeleccionHorario