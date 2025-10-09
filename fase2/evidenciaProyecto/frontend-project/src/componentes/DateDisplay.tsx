// src/components/DateDisplay.tsx
import React, { useState, useEffect } from 'react';
import { getNextFiveDays } from '../utils/dateUtils'; // Asegúrate de la ruta correcta
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
interface DateCardProps {
  dateString: string;
  isToday: boolean;
  fullDate:string;
}

// Subcomponente para cada tarjeta de fecha
const DateCard: React.FC<DateCardProps> = ({ dateString, isToday, fullDate }) => {
  /*
  const baseClasses = "flex-1 p-3 text-center border rounded-lg transition-all duration-300 shadow-md";
  const activeClasses = "bg-blue-600 text-white border-blue-700 font-bold transform scale-105";
  const inactiveClasses = "bg-white text-gray-800 border-gray-200 hover:bg-gray-50";
*/
  return (
    <li className='w-full text-center'>
      <input type="radio" defaultChecked={isToday?true:false} className='miracaezon ' id={fullDate} name='fechas'/>
      <label htmlFor={fullDate} className='ellabel text-center mx-2  border-2 block whitespace-nowrap rounded-md md:px-0 px-2'>
          {dateString}
        </label>
    </li>
    /*
    <div className={`${baseClasses} ${isToday ? activeClasses : inactiveClasses}`}>
        <div className=''>{fullDate}</div>
      <span className="text-sm sm:text-base">{dateString}</span>
    </div>*/
  );
};

// Componente principal
const DateDisplay: React.FC = () => {
  const [dates, setDates] = useState(getNextFiveDays());

  // useEffect para actualizar las fechas al montar el componente
  useEffect(() => {
    // Si la aplicación fuera de larga duración, podrías añadir un intervalo
    // para refrescar las fechas a medianoche, pero para 5 días
    // y la hora actual, con un solo cálculo es suficiente.
    setDates(getNextFiveDays());
  }, []);

  return (
    <div className='flex items-center mt-2 md:mt-4 '>
    <GoChevronLeft size={30} className='md:hidden'/>
      <ul className="rounded-md  flex justify-around bg-gray-100 py-2 overflow-x-auto overflow-y-hidden flex-row w-full">
          {dates.map((dateObj, index) => (
          <DateCard
            key={index}
            dateString={dateObj.dateString}
            isToday={index === 0} // 'Hoy' es siempre el primer elemento
            fullDate={dateObj.fullDate.toDateString()}
          />
        ))}  
      </ul>
      <GoChevronRight size={30} className='md:hidden'/>
    </div>
    
  );
};

export default DateDisplay;