//import reactLogo from '../assets/react.svg'

import './componentes_css/Nav.css'
import { Link } from 'react-router-dom';
function Nav(){

return(<>
    <nav className="flex  p-4 duoc-nav  top-0">
     <img src="https://www.duoc.cl/wp-content/themes/wordpress-duoc-cl/images/logo-duoc.svg" className='imagenduoc hidden md:inline' />
    
    <Link to="/">
        <h1 className='text-xl font-semibold text-center mt-5 navtext ml-8' >Reserva de Espacios CITT y Biblioteca</h1>
    </Link>
    </nav>

</>)
}
export default Nav