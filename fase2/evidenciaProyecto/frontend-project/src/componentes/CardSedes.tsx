import React from 'react';
import './componentes_css/CardSedes.css'

interface EspacioInfo{
  nombre:string,
  horarios:string
}

interface CardSedesProps {
  titulo:string,
  imagen:string,
  direccion:string,
  espacios:EspacioInfo[]
}

const CardSedes: React.FC<CardSedesProps> = ({ titulo, imagen, direccion, espacios}) => {

return(<>
<div className='grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1  sm:py-0 duoc-borders-x hover:bg-gray-100 transition-colors '>
  <div className='p-2   flex justify-center'>
    <img src={imagen} alt="" className='rounded-md lg:h-80'/>
  </div>
  
  <div className='flex flex-col justify-center items-center'>
    <h1 className='lg:text-4xl md:text-4xl sm:text-4xl  font-bold text-center text-2xl'>{titulo}</h1>
    <div className='text-center text-gray-600'>{direccion}</div>
    {espacios.map((espacio)=>(
      <button className='rounded-full outline-2 hidden md:inline w-40 mt-10 py-1 duoc-btn-seleccionar transition-colors'>
      <a href="/seleccionhorario">
        {espacio.nombre}
      </a>
      </button>
    ))}
  
  </div>
        
  <div className='flex justify-center p-2 md:hidden'>
{espacios.map((espacio)=>(
    <button className='bg-amber-200 p-2 rounded-full hover:bg-amber-500 transition-colors w-40 h-10 lg:my-0 sm:my-2 focus:bg-amber-500 font-semibold mx-1'>
      <a href="/seleccionhorario">
        {espacio.nombre}
      </a>
      </button>
        ))}
  </div>
  
</div>

</>)
}
export default CardSedes