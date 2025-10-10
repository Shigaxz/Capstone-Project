import { useLocation } from "react-router-dom"

interface FormData{
    sede:string,
    espacio:string,
    sitio:string,
    horario:string
}

function Formulario(){

    const locate = useLocation();
    const ladata = locate.state as FormData

    return <div>
        <h1>{ladata.sede}</h1>
        <h1>{ladata.espacio}</h1>
        <h1>{ladata.sitio}</h1>
        <h1>{ladata.horario}</h1>
    </div>
}
export default Formulario