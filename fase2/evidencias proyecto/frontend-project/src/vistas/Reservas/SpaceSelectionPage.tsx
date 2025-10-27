import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSpacesByLocation } from '../../services/spacesApiServices';
import type { Space } from '../../interfaces/spaces';

const SpaceSelectionPage: React.FC = () => {
  const { id: locationId } = useParams<{ id: string }>();

  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string>(''); 

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
        const data = await getSpacesByLocation(locationId);
        setSpaces(data);
        if (data.length > 0) {
        }

      } catch (err: any) {
        setError(err.message || 'Error al cargar los espacios.');
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
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold font-sans text-center mb-8 text-gray-800">
        Selecciona un Espacio
      </h2>
      
       <Link to="/reservas" className="inline-block mb-6 text-blue-600 hover:underline">
        &larr; Volver a Lugares
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
        {spaces.map((space) => (
          <Link
            to={`/reserva/${locationId}/horario/${space._id}`}
            key={space._id}
            className={`
              block p-6 rounded-lg shadow-md transition-colors duration-200
              ${space.isAvailable ? 'bg-white hover:bg-gray-50' : 'bg-gray-200 cursor-not-allowed opacity-60'}
            `}
            // Prevent navigation if space is not available
            onClick={(e) => !space.isAvailable && e.preventDefault()}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{space.name}</h3>
            <p className="text-sm text-gray-600">Capacidad: {space.capacity}</p>
            {!space.isAvailable && (
              <p className="text-sm font-semibold text-red-600 mt-2">No Disponible</p>
            )}
          </Link>
        ))}
        {spaces.length === 0 && !loading && (
            <p className="text-center text-gray-500 col-span-full">No se encontraron espacios en este lugar.</p>
        )}
      </div>
    </div>
  );
};

export default SpaceSelectionPage;