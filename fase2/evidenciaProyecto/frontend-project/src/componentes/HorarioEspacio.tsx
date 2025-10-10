import React from 'react';
import { getSedes } from '../utils/sedesUtils';

interface HorarioEspacioProps{
    nombreSede:string,
    espacioSede:string
}
const HorarioEspacio: React.FC<HorarioEspacioProps> = ({ nombreSede , espacioSede  })=>{
   const nomSede = getSedes()?.find((sede)=>{return sede.nombre==nombreSede});
   const espSede = nomSede?.espacios.find((esp)=>{return esp.nombre==espacioSede});
    
   return (
    <div className='flex flex-col'>
        {espSede?.espacios.map((space)=>(
            <div className='grid md:grid-cols-2 grid-cols-1'>
                <div className='w-full flex justify-center md:border-b-2 md:border-b-gray-200 p-2'>
                    <img src={space.imagen} alt="" className='w-2xs rounded-md md:shadow-2xl'/>
                </div>
            
                <div className='border-b-2 border-b-gray-200 flex flex-col justify-center items-center'>
                    <div className='font-bold mb-2'>{space.nombre}</div>
                    <div className='my-2 grid grid-cols-4 bg-gray-100 p-5 rounded-lg'>
                        {space.horarios.map((hor)=>(
                            <a href='' className='p-2 bg-amber-200 m-1 rounded-lg hover:bg-amber-300 transition-all'>{hor}</a>
                        ))}
                    </div>
                </div>
                
            </div>
            
            
        ))}     
    </div>
        
    )
} 
export default HorarioEspacio;