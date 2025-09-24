//import reactLogo from '../assets/react.svg'

import './componentes_css/Nav.css'
import { GoListUnordered,GoPersonFill } from "react-icons/go";
import { Link } from 'react-router-dom';
function Nav(){

return(<>

    <nav className="flex  justify-between  p-4 duoc-nav sticky top-0">
    
    <button className='nav-btn rounded-full'>
        <GoListUnordered size={35} />
    </button>
    
    <h1 className='text-2xl font-semibold text-center'>Reserva de Espacios CITT y Biblioteca</h1>
    <Link to="/reservas">Reservas</Link>

    <button className='nav-btn rounded-full'>
        <GoPersonFill size={35} />
    </button>

    </nav>

</>)
}
export default Nav