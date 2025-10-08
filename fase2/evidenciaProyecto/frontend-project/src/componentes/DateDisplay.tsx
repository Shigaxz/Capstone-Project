// src/components/DateDisplay.tsx
import React, { useState, useEffect } from 'react';
import { getNextFiveDays } from '../utils/dateUtils'; // Asegúrate de la ruta correcta

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
    <>
      <input type="radio" defaultChecked={isToday?true:false} className='miracaezon ' id={fullDate} name='fechas'/>
      <label htmlFor={fullDate} className='ellabel border-2 border-amber-300 hover:bg-amber-300 w-full flex justify-center focus:bg-amber-300 rounded-md z-50 bg-white transition-colors'>
        <div className='md:text-3xl text-2xl px-2 md:px-0 whitespace-nowrap'>
          {dateString}
        </div>
        </label>
    </>
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
      <ul className="w-full flex justify-around flex-row gap-4 overflow-x-auto overflow-y-hidden  p-2 mx-2 rounded-sm bg-gray-200">
        <li className="w-full duoc-item" >
          {dates.map((dateObj, index) => (
          <DateCard
            key={index}
            dateString={dateObj.dateString}
            isToday={index === 0} // 'Hoy' es siempre el primer elemento
            fullDate={dateObj.fullDate.toDateString()}
          />
        ))}
        </li>  
      </ul>
  );
};

export default DateDisplay;