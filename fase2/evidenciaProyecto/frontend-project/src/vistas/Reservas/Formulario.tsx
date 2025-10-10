import { useLocation } from "react-router-dom"

interface FormData{
    sede:string,
    sedeImg:string,
    sedeDireccion:string,
    espacio:string,
    sitio:string,
    sitioImg:string,
    horario:string
}

function Formulario(){

    const locate = useLocation();
    const ladata = locate.state as FormData | null
if(!ladata){
  return <div className='absolute self-center text-bold text-red-600 top-[50%] left-[50%]'>ERROR</div>
}

    return <>
    <div className="font-bold text-2xl text-center bg-amber-200">Confirmar Reserva</div>
    <div className="grid md:grid-cols-2 p-2">
        <div className=" grid md:grid-cols-2 grid-cols-1 bg-gray-100 mx-2 rounded-lg my-2">
            <div className="flex justify-center">
                <img src={ladata.sedeImg} alt="" className="h-50 rounded-md my-2"/>
            </div>
            
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl">{ladata.sede}</h1>
                <p >{ladata.sedeDireccion}</p>
            </div>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 bg-gray-100 mx-2 rounded-lg my-2">
            <div className="flex justify-center">
                <img src={ladata.sitioImg} alt="" className="h-50 rounded-md my-2"/>
            </div>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl">{ladata.espacio}</h1>
                <p>{ladata.sitio}</p>
                <p className="">(Hoy) {ladata.horario}</p>
            </div>
        </div>
    </div>
    <div className="flex md:justify-start md:flex-row flex-col mb-3">
        <div className=" ms-5 ">Ingresa tu correo institucional</div>
        <input type="email" className="bg-gray-100 rounded-lg px-2 py-0.5 border-2 border-gray-200 mx-4" placeholder="email"/>
        <button className="mx-2 text-bold border-2 border-amber-400 px-2 py-0.5 rounded-lg hover:bg-amber-400 transition-all md:mt-0 mt-2 hidden md:inline">Confirmar</button>
        <button className="bg-amber-200 mt-8 py-3 mx-4 rounded-md md:hidden font-black">Confirmar</button>
    </div>
    
    </>
}
export default Formulario