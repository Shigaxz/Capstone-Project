import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLocations } from '../../services/locationsApiServices';
import type { Location } from '../../interfaces/Locations';


const LocationCards: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getLocations();
        setLocations(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar los lugares.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Cargando lugares...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold font-sans text-center mb-8 text-gray-800">
        Selecciona un Lugar
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
        {locations.map((location) => (
          <Link
            to={`/reservas/${location._id}`}
            key={location._id}
            className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 no-underline max-w-sm mx-auto sm:mx-0" // Added max-width and margin handling
          >
            <div className="h-48 overflow-hidden">
              <img
                src={location.urlImage || 'https://via.placeholder.com/400x300.png?text=Sin+Imagen'}
                alt={location.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 text-center">
                {location.name}
              </h3>
            </div>
          </Link>
        ))}
        {locations.length === 0 && !loading && (
            <p className="text-center text-gray-500 col-span-full">No se encontraron lugares disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default LocationCards;