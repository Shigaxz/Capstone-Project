import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSpacesByLocation } from '../../services/spacesApiServices';
import { getLocationById } from '../../services/locationsApiServices';
import type { Space } from '../../interfaces/spaces';
import Footer from '../../componentes/Footer';
import Navbar from '../../componentes/reservas/Navbar';

const SpaceSelectionPage: React.FC = () => {
  const { id: locationId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!locationId) {
      setError('ID del lugar no encontrado en la URL.');
      setLoading(false);
      return;
    }

    const fetchSpaces = async () => {
      try {
        setLoading(true);
        setError(null);
        // Obtenemos la informacion de la location
        const locationData = await getLocationById(locationId);
        // Verificamos si está disponible
        if (!locationData.isAvailable) {
          navigate('/reservas'); // Redirigir a la lista general
          return; // Detener la ejecución
        }
        // Si está disponible cargamos los espacios
        const spacesData = await getSpacesByLocation(locationId);
        setSpaces(spacesData);

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error al cargar la información.');
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, [locationId]);

  if (loading) {
    return <p className="text-center text-gray-500 py-10">Cargando espacios...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">{error}</p>;
  }

  return (
    <>
    <Navbar 
        buttonText="Volver a Lugares" 
        buttonPath="/reservas" 
      />
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">

        {/* Título */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold font-sans text-gray-800">
            Selecciona un Espacio
          </h1>
          <p className="text-gray-500 mt-2">
            Elige uno de los espacios disponibles para continuar con tu reserva.
          </p>
        </div>

        {/* Grid de Espacios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {spaces.map((space) => (
            <Link
              to={`/reserva/${locationId}/horario/${space._id}`}
              key={space._id}
              className={`
                group block rounded-xl overflow-hidden transition-all duration-300
                ${space.isAvailable 
                  ? 'bg-white shadow-md hover:shadow-xl hover:-translate-y-1' 
                  : 'bg-gray-100 cursor-not-allowed'
                }
              `}
              onClick={(e) => !space.isAvailable && e.preventDefault()}
            >
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 truncate">{space.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Capacidad: {space.capacity} personas</p>
              </div>
              <div className={`px-5 py-3 text-sm font-semibold ${space.isAvailable ? 'bg-blue-50 text-blue-700' : 'bg-gray-200 text-gray-500'}`}>
                {space.isAvailable ? 'Ver horarios' : 'No Disponible'}
              </div>
            </Link>
          ))}
          {spaces.length === 0 && !loading && (
              <p className="text-center text-gray-500 col-span-full py-10">No se encontraron espacios en este lugar.</p>
          )}
        </div>
      </div>
    </div>
    <Footer/>
    </>
    
  );
};

export default SpaceSelectionPage;