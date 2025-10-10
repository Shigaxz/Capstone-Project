import './SeleccionHorario.css'
import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import DateDisplay from '../../componentes/DateDisplay';
import HorarioEspacio from '../../componentes/HorarioEspacio';

interface Prueba{
  nombre:string
}
interface DisplayHorarios{
  nombreSede:string,
  espacioSede:string
}
function SeleccionHorario(){

const navigate = useNavigate();
const locate = useLocation()
const ladata = locate.state as DisplayHorarios
const [dia , setDia] = useState('');
const handeaElPrueba = ()=>{
  const palaprueba:Prueba = {nombre:'pedo'}
  navigate('/formulario' , {state: palaprueba})
}
const handleChildData = useCallback((data:string)=>{
  setDia(data);
},[])

return(<>

<div className="text-center text-4xl bg-amber-300 p-2">Seleccionar Horario</div>

<DateDisplay onChildData={handleChildData}/>

<div className='flex justify-center items-center flex-col my-2 sticky top-1.5'>
  <div className='bg-amber-300 w-52  py-0.5 rounded-lg shadow text-center font-medium'>{dia}</div>
</div>

<button onClick={handeaElPrueba}>tocame papi</button>

<HorarioEspacio nombreSede={ladata.nombreSede} espacioSede={ladata.espacioSede}/>
   


</>)
}
export default SeleccionHorario