import { useParams } from 'react-router-dom';
import { memoriasData } from '../../utils/memoriasUtils';
import Nav from '../../componentes/Nav';
import Footer from '../../componentes/Footer';
import { Link } from 'react-router-dom';

const MemoriaDetalle = () => {
  const { id } = useParams();
  const memoria = memoriasData.find(m => m.id.toString() === id);
  console.log(memoria)
  if (!memoria) return <p>Memoria no encontrada</p>;

  return (
    <>
   <Nav />
      <div className="container mt-5 flex ml-5">
        <Link
          to="/memorias"
          className="mb-4 px-4 underline italic"
          >
          ← Volver a Memorias
        </Link>
      </div>

      <div className="container mt-8 flex flex-col md:flex-row items-center md:items-start gap-8 px-4 md:px-10">
        <img
        src={memoria.imageUrl}
        className="w-full max-w-md rounded-lg shadow-lg object-cover"
        />

  
        <div className="flex flex-col justify-center text-center md:text-left">
          <h1 className="text-2xl font-semibold mb-4">
            {memoria.title}
          </h1>
            <p className="text-gray-700 leading-relaxed">{memoria.descripcion}</p>
          
        </div>
        
      </div>
      
  <Footer />
    </>
  );
};

export default MemoriaDetalle;
