import { useParams } from 'react-router-dom';
import { memoriasData } from '../../utils/memoriasUtils';
import Nav from '../../componentes/Nav';
import Footer from '../../componentes/Footer';

const MemoriaDetalle = () => {
  const { id } = useParams();
  const memoria = memoriasData.find(m => m.id.toString() === id);
  console.log(memoria)
  if (!memoria) return <p>Memoria no encontrada</p>;

  return (
    <>
      <Nav />
      <div className="container mt-8 ml-5">
        <h1>{memoria.title}</h1>
        <p>{memoria.descripcion}</p>
        <img src={memoria.imageUrl}  className="mt-4 w-full max-w-lg" />
      </div>
      <Footer />
    </>
  );
};

export default MemoriaDetalle;
