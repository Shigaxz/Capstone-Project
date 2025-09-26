import './SeleccionHorario.css'
import { useState, useEffect } from 'react'
function SeleccionHorario(){
const listaHorarios = [
    'Hoy',
    'Mañana',
    '25/09',
    '26/09',
    '27/09',
]

const [dia , setDia] = useState('');
const[segDia, setSegDia] = useState('')

useEffect(()=>{
setSegDia(dia);
console.log('nuevo dia :',segDia);
},[dia])


return(<>

<h1 className="text-center text-4xl mb-3 bg-amber-300">HORARIOS</h1>

    <ul className="flex justify-around flex-row gap-4 overflow-x-auto overflow-y-hidden outline-1 outline-gray-500 p-2 mx-2 rounded-sm bg-gray-100">
    {listaHorarios.map((horario)=>(
        <li className="w-full duoc-item" >
            <button onClick={()=>{
            setDia(horario);
            }}
            className="border-2 border-amber-300 hover:bg-amber-300 w-full flex justify-center focus:bg-amber-300 rounded-md z-50 bg-white transition-colors">
                <h1 className="md:text-3xl text-2xl px-2 md:px-0">{horario}</h1>
            </button>
            
        </li>

        
    ))}
    </ul>

<h1>{dia}</h1>

<h2>{segDia}</h2>

</>)
}
export default SeleccionHorario