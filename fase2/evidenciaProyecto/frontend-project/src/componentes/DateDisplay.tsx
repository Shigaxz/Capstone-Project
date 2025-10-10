/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/DateDisplay.tsx
import React, { useState, useEffect } from 'react';
import { getNextFiveDays } from '../utils/dateUtils'; // Asegúrate de la ruta correcta
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
interface DateDisplayProps{
onChildData: (dato:any)=>void
}

// Componente principal
const DateDisplay: React.FC<DateDisplayProps> = ({onChildData}) => {
  const [dates, setDates] = useState(getNextFiveDays());
  
  const pasarDatoPalTaita = (data:any)=>{

    onChildData(data)
  }
  // useEffect para actualizar las fechas al montar el componente
  useEffect(() => {
    // Si la aplicación fuera de larga duración, podrías añadir un intervalo
    // para refrescar las fechas a medianoche, pero para 5 días
    // y la hora actual, con un solo cálculo es suficiente.
    onChildData(getNextFiveDays().find((e,index)=>{
    return index == 0
  })?.dateString)
    setDates(getNextFiveDays());
  }, [onChildData]);

  return (
    <div className='flex items-center mt-2 md:mt-4 '>
    <GoChevronLeft size={30} className='md:hidden'/>
      <ul className="rounded-md  flex justify-around bg-gray-100 py-2 overflow-x-auto overflow-y-hidden flex-row w-full">
          {dates.map((dateObj, index) => (
    <li className='w-full text-center'>
      <input type="radio" defaultChecked={index==0?true:false} className='miracaezon ' onClick={()=>pasarDatoPalTaita(dateObj.dateString)} id={dateObj.fullDate.toISOString()} name='fechas'/>
      <label htmlFor={dateObj.fullDate.toISOString()} className='ellabel text-center mx-2  border-2 block whitespace-nowrap rounded-md md:px-0 px-2'>
          {dateObj.dateString}
        </label>
    </li>
        ))}  
      </ul>
      <GoChevronRight size={30} className='md:hidden'/>
    </div>
    
  );
};

export default DateDisplay;