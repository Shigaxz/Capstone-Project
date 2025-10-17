import './SeleccionHorario.css'
import { useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom';
import DateDisplay from '../../componentes/DateDisplay';
import HorarioEspacio from '../../componentes/HorarioEspacio';
interface DisplayHorarios{
  nombreSede:string,
  espacioSede:string
}
function SeleccionHorario(){

const locate = useLocation()
const ladata = locate.state as DisplayHorarios | null
const [dia , setDia] = useState('');

const handleChildData = useCallback((data:string)=>{
  setDia(data);
},[])

if(!ladata){
  return <div className='absolute self-center text-bold text-red-600 top-[50%] left-[50%]'>ERROR</div>
}

return(<>

<div className="text-center text-4xl bg-amber-300 p-2">Seleccionar Horario</div>

<DateDisplay onChildData={handleChildData}/>

<div className='flex justify-center items-center flex-col my-2 sticky top-1.5'>
  <div className='bg-amber-300 w-52  py-0.5 rounded-lg shadow text-center font-medium'>{dia}</div>
</div>


<HorarioEspacio nombreSede={ladata.nombreSede} espacioSede={ladata.espacioSede}/>
   


</>)
}
export default SeleccionHorario