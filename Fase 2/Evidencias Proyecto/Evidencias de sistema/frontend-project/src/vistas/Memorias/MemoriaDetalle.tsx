import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Nav from "../../componentes/Nav";
import Footer from "../../componentes/Footer";
import type { Memory } from "../../interfaces/memories";
import {
  getMemoryById,
  downloadMemoryPDF,
} from "../../services/memoriesApiService";

const MemoriaDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const [memoria, setMemoria] = useState<Memory | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchMemory = async () => {
      try {
        const data = await getMemoryById(id);
        setMemoria(data);
      } catch (error) {
        console.error("Error al cargar memoria:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMemory();
  }, [id]);

  const handleDownload = async () => {
    if (!id || !memoria) return;
    setIsDownloading(true);
    try {
      await downloadMemoryPDF(id, memoria.title);
    } catch (error) {
      alert("No se pudo descargar el PDF. Inténtalo de nuevo.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Cargando memoria...</p></div>;
  if (!memoria) return <div className="min-h-screen flex items-center justify-center"><p>Memoria no encontrada</p></div>;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Nav />

      <main className="flex-grow w-full pb-12">
        
        <div className="container mx-auto mt-5 px-4"> 
          <Link to="/memorias" className="inline-block mb-4 px-2 underline italic">
            ← Volver a Memorias
          </Link>
        </div>

        <div className="container mx-auto mt-8 flex flex-col md:flex-row items-center md:items-start gap-10 px-4">
          {/* Imagen */}
          {memoria.images.length > 0 && (
            <div className="flex-shrink-0 w-full md:w-[500px]">
                <img
                src={memoria.images[0]}
                alt={memoria.title}
                className="w-full h-[400px] rounded-lg shadow-lg object-cover"
                />
            </div>
          )}

          <div className="flex flex-col text-center md:text-left w-full">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">{memoria.title}</h1>

            <div className="space-y-4 text-gray-700 leading-relaxed">
                <div>
                    <strong className="text-gray-900">Miembros:</strong> {memoria.members.join(", ")}
                </div>
                
                <div className="text-gray-600 mt-4">
                    {memoria.description}
                </div>

                <div className="mt-4">
                    <strong className="text-gray-900">Docente:</strong> {memoria.teacher}
                </div>

                <div className="mt-2">
                    {memoria.company && (
                        <>
                        <strong className="text-gray-900">Compañía:</strong> {memoria.company}
                        <br />
                        </>
                    )}
                    <strong className="text-gray-900">Año:</strong> {memoria.year}
                </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="
                mt-8 px-6 py-3 
                bg-blue-600 text-white font-bold 
                rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg
                transition-all duration-200
                disabled:bg-gray-400 disabled:cursor-not-allowed
                self-center md:self-start
              "
            >
              {isDownloading ? "Descargando..." : "Descargar Memoria (PDF)"}
            </button>

            {memoria.createdAt && (
                <p className="text-gray-400 text-sm mt-8 italic">
                 Creada el: {new Date(memoria.createdAt).toLocaleDateString()}
                </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MemoriaDetalle;