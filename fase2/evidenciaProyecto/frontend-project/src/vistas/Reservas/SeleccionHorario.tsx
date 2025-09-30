import './SeleccionHorario.css'
import { useState, useEffect } from 'react'
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import CardSedes from '../../componentes/CardSedes';

function SeleccionHorario(){
const listaHorarios = [
    'Hoy',
    'Mañana',
    '25 de Sep.',
    '26 de Sep.',
    '27 de Sep.',
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


const [dia , setDia] = useState('Hoy');
const[segDia, setSegDia] = useState('')

useEffect(()=>{
setSegDia(dia);
console.log('nuevo dia :',segDia);
},[dia , segDia])

return(<>

<div className="text-center text-4xl bg-amber-300 p-2">Seleccionar Horario</div>
    <div className='flex items-center'>
        <GoChevronLeft size={30} className='md:hidden'/>
        <ul className="w-full flex justify-around flex-row gap-4 overflow-x-auto overflow-y-hidden  p-2 mx-2 rounded-sm bg-gray-200">
    {listaHorarios.map((horario)=>(
        <li className="w-full duoc-item" >
            <button onClick={()=>{
            setDia(horario);
            }}
            className="border-2 border-amber-300 hover:bg-amber-300 w-full flex justify-center focus:bg-amber-300 rounded-md z-50 bg-white transition-colors">
                <div className="md:text-3xl text-2xl px-2 md:px-0 whitespace-nowrap">{horario}</div>
            </button>
            
        </li>

        
    ))}
    </ul>
    <GoChevronRight size={30} className='md:hidden'/>
    </div>
    <div className='flex justify-center sticky top-0'>
        <div className='text-2xl mt-2 bg-amber-300 md:w-80  w-50 text-center rounded-md shadow'>{segDia}</div>
    </div>
    

{listaSedes.map((sede)=>(

<CardSedes titulo={sede.nombre} imagen={sede.imagen} direccion={sede.direccion}/>
   
   ))}



</>)
}
export default SeleccionHorario