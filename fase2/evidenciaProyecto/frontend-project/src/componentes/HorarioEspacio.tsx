import React, { useState, useEffect } from 'react';
import { getSedes } from '../utils/sedesUtils';
interface HorarioEspacioProps{
    nombreSede:string,
    espacioSede:string
}
const HorarioEspacio: React.FC<HorarioEspacioProps> = ({ nombreSede , espacioSede  })=>{
   const nomSede = getSedes()?.find((sede)=>{return sede.nombre==nombreSede})
   const espSede = nomSede?.espacios.find((esp)=>{return esp.nombre==espacioSede})
    return (
        <div>ola chavales {nomSede?.nombre} , {espSede?.horarios}</div>
    )
} 
export default HorarioEspacio;