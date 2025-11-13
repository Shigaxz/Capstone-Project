import "./componentes_css/Footer.css";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <>
      <footer className=" text-white py-12 px-6 lg:px-16 mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-xl font-bold mb-4 border-b-2 border-yellow-500 pb-1 inline-block">
                Contáctanos
              </h3>
              <h4 className="text-lg font-bold mb-2">Admisión</h4>
              <p className="mb-1">(+56) 227 120640</p>

              <h4 className="text-lg font-bold mt-4 mb-2">
                Cursos y Diplomados
              </h4>
              <p className="mb-1">(+56) 227120246</p>

              <h4 className="text-lg font-bold mt-4 mb-2">MESA DE SERVICIOS</h4>

              <p>Servicios Académicos</p>
              <p>Servicios de Financiamiento</p>
              <p>Servicios de Vida Estudiantil</p>
              <p>Servicios Tecnológicos</p>
              <p>Otros Servicios</p>

              <h4 className="text-lg font-bold mt-4 mb-2">Teléfonos</h4>
              <p>(+56) 442 201 098</p>
              <p>(+56) 227 120 245</p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 border-b-2 border-duoc pb-1 inline-block">
                Oferta Académica
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-duoc">
                    CARRERAS
                  </a>
                </li>
                <li>
                  <a href="#" className="text-duoc">
                    CURSOS Y DIPLOMADOS
                  </a>
                </li>
                <li>
                  <a href="#" className="text-duoc">
                    DUOC ONLINE
                  </a>
                </li>
              </ul>

              <h3 className="text-xl font-bold mt-8 mb-4 border-b-2 border-duoc pb-1 inline-block">
                Enlaces de interés
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-duoc">
                    LICEO POLITÉCNICO ANDES
                  </a>
                </li>
                <li>
                  <a href="#" className="text-duoc">
                    PREVENCIÓN Y APOYO A VÍCTIMAS DE VIOLENCIA SEXUAL Y GÉNERO
                  </a>
                </li>
                <li>
                  <a href="#" className="text-duoc">
                    REDES SOCIALES DUOC UC
                  </a>
                </li>
                <li>
                  <a href="#" className="text-duoc">
                    CANAL DE DENUNCIAS Y CONSULTAS
                  </a>
                </li>
                <li>
                  <a href="#" className="text-duoc">
                    EMPRESAS
                  </a>
                </li>
                <li>
                  <a href="#" className="text-duoc">
                    PORTAL PROVEEDORES
                  </a>
                </li>
                <li>
                  <a href="#" className="text-duoc">
                    KIT DIGITAL DUOC UC
                  </a>
                </li>
                <li>
                  <a href="#" className="text-duoc">
                    INFORME CONVIVENCIA E INCLUSIÓN 2022
                  </a>
                </li>
                <li>
                  <a href="#" className="text-duoc">
                    CONTRATO DE SERVICIOS EDUCACIONALES
                  </a>
                </li>
                <li>
                  <a href="#" className="text-duoc">
                    POLÍTICAS DE PRIVACIDAD
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 border-b-2 border-duoc pb-1 inline-block">
                Nosotros
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-duoc">
                    SOBRE DUOC UC
                  </a>
                </li>
                <li>
                  <a href="#" className="text-duoc">
                    SEDES Y CAMPUS
                  </a>
                </li>
                <li>
                  <a href="#" className="text-duoc">
                    SALA DE PRENSA
                  </a>
                </li>
                <li>
                  <a href="#" className="text-duoc">
                    EXTENSIÓN
                  </a>
                </li>
                <li>
                  <a href="#" className="text-duoc">
                    VINCULACIÓN CON EL MEDIO
                  </a>
                </li>
                <li>
                  <a href="#" className="text-duoc">
                    INVESTIGACIÓN APLICADA E INNOVACIÓN
                  </a>
                </li>
                <li>
                  <a href="#" className="text-duoc">
                    INNOVACIÓN & EMPRENDIMIENTO ESTUDIANTIL
                  </a>
                </li>
                <li>
                  <a href="#" className="text-duoc mt-4 block">
                    CALIDAD Y ACREDITACIÓN
                  </a>
                </li>
                <li>
                  <a href="#" className="text-duoc mt-4 block">
                    ÚNETE A NUESTRO EQUIPO
                  </a>
                </li>
                <li>
                  <Link to="/admin" className="text-duoc mt-4 block">
                    ADMINISTRACION DE DATOS
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
