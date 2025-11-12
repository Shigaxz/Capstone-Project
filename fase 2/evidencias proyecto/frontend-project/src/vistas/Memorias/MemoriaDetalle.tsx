import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Nav from '../../componentes/Nav';
import Footer from '../../componentes/Footer';
import type { Memory } from '../../interfaces/memories';
import { getMemoryById } from '../../services/memoriesApiService';

const MemoriaDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const [memoria, setMemoria] = useState<Memory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchMemory = async () => {
      try {
        const data = await getMemoryById(id);
        setMemoria(data);
      } catch (error) {
        console.error('Error al cargar memoria:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemory();
  }, [id]);

  if (loading) return <p className="container mt-10">Cargando memoria...</p>;
  if (!memoria) return <p className="container mt-10">Memoria no encontrada</p>;

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
        {memoria.images.length > 0 && (
          <img
            src={memoria.images[0]} 
            className="w-[500px] h-[400px] rounded-lg shadow-lg object-cover"
          />
        )}

        <div className="flex flex-col justify-center text-center md:text-left">
          <h1 className="text-4xl  mb-4">{memoria.title}</h1>
          
          <p className="leading-relaxed ">
            <strong>Miembros:</strong> {memoria.members.join(', ')}
            <p className="text-gray-700 leading-relaxed mt-5">{memoria.description}</p>
            <p className='mt-5'><strong>Docente:</strong> {memoria.teacher}</p>
            <p className='mt-8'> {memoria.company && <><strong>Compañía:</strong> {memoria.company}<br /></>} 
            <strong>Año:</strong> {memoria.year}</p>
            
          </p>
                    
          <p className='text-gray-700 mt-5'>{memoria.createdAt && <em>Creada el: {new Date(memoria.createdAt).toLocaleDateString()}</em>}</p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default MemoriaDetalle;
