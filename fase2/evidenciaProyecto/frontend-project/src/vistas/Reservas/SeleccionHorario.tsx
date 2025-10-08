import './SeleccionHorario.css'
import { useState, useEffect } from 'react'
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import CardSedes from '../../componentes/CardSedes';
import DateDisplay from '../../componentes/DateDisplay';
function SeleccionHorario(){
const listaHorarios = [
    'Hoy',
    'Mañana',
    '25 de Sep.',
    '26 de Sep.',
    '27 de Sep.',
]
const listaEspacios = [
  'CITT',
  'Biblioteca'
]


interface infoSede {
  nombre:string;
  imagen:string;
  direccion:string;

}

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


const [dia , setDia] = useState(listaHorarios[0]);
const [lugar, setLugar] = useState(listaEspacios[1]);
const[segDia, setSegDia] = useState('');
const[segLugar, setSegLugar] = useState('');

useEffect(()=>{
setSegDia(dia);
setSegLugar(lugar);
},[dia , segDia, lugar, segLugar])

return(<>

<div className="text-center text-4xl bg-amber-300 p-2">Seleccionar Horario</div>

<div className='flex justify-center items-center flex-col mt-2 sticky top-1.5'>
  <div className='bg-amber-100 w-52 py-0.5 rounded-t-lg shadow text-center font-black'>{lugar}</div>
  <div className='bg-amber-300 w-52  py-0.5 rounded-b-lg shadow text-center font-medium'>{dia}</div>
</div>

<DateDisplay/>


<input type="radio" defaultChecked={true} className='miracaezon' id='mish' name='lista'/>
<label htmlFor="mish" className='bg-amber-200 ellabel'>que pasa chaval</label>

<input type="radio" defaultChecked={false} className='miracaezon' id='pex' name='lista'/>
<label htmlFor="pex" className='bg-amber-200 ellabel'>que pasa chaval 2 </label>

    <div className=''>
      {listaSedes.map((sede,index)=>(

//<CardSedes key={index} titulo={sede.nombre} imagen={sede.imagen} direccion={sede.direccion}/>
  <>
  <input type="radio" defaultChecked={index==0?true:false} className='miracaezon' id={sede.nombre} name='sedes'/>
<label htmlFor={sede.nombre} className='bg-amber-200 ellabel'>{sede.nombre}</label>
  </>
   ))}
    </div>

</>)
}
export default SeleccionHorario