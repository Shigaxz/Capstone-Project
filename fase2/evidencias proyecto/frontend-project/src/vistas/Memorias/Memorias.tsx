import { useEffect, useState } from 'react';
import Nav from '../../componentes/Nav';
import Footer from '../../componentes/Footer';
import CardMemorias from './CardMemorias';
import type { Memory } from '../../interfaces/memories';
import { getMemories } from '../../services/memoriesApiService';
import { Link } from 'react-router-dom';

function Memorias() {
  const [memorias, setMemorias] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const data = await getMemories();
        setMemorias(data);
      } catch (error) {
        console.error('Error al cargar memorias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemories();
  }, []);

  return (
    <>
      <Nav/>
         <div className="container mt-5 flex ml-2">
        <Link
          to="/"
          className="mb-4 px-4 underline italic"
        >
          ← Volver a Principal
        </Link>
      </div>

      <div className='container mt-5 ml-5'>
        <h1 className="text-2xl">Memorias</h1>
        <h3 className='itext'>
          <i>Entérate de lo que está pasando en nuestras escuelas</i>
        </h3> 
      </div>

      {loading ? (
        <div className='container mt-10'>Cargando memorias...</div>
      ) : (
        <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 justify-center gap-6 mt-10">
          {memorias.map((memoria) => (
            <CardMemorias
              key={memoria._id}
              imageUrl={memoria.images[0] || ''} // primera imagen
              date={memoria.createdAt ? new Date(memoria.createdAt).toLocaleDateString() : memoria.year.toString()}
              title={memoria.title}
              link={`/Memorias/${memoria._id}`}
            />
          ))}
        </div>
      )}

      <Footer/>
    </>
  );
}

export default Memorias;
