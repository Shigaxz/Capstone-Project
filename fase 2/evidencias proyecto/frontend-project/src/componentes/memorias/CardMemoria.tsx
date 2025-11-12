
import image1 from '../../assets/imgCITT/CITTInterior.jpg'


function CardMemoria(){
    return (<>
<div className="container mx-auto mt-5 px-4">
  <div className="grid grid-cols-1 md:grid-cols-2 bg-white overflow-hidden  shadow-lg">
    <div className="bg-[#2E2E2E] text-white p-4 md:p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-2 leading-snug italic">
         Memorias
        </h2>
         <p className="text-sm leading-relaxed mb-2 ">
         Los proyectos importantes de nuestros estudiantes en las memorias de DuocUC.
        </p>

        <div className="h-1 w-16 bg-yellow-400 mb-2"></div>

       

        <p className="text-sm leading-relaxed">
          Enterate de los ultimos proyectos realizados por nuestros estudiantes, el impacto que genero este en ellos 
          y como fue su proceso durante este.
        </p>
      </div>

      <div className="h-2 w-full bg-yellow-400 mt-4"></div>
    </div>

 
    <div className="h-56 md:h-72">
      <img
        src={image1}
        alt="Proceso de inscripción"
        className="w-full h-full object-cover"
      />
    </div>
  </div>
</div>

    
    
    
    
    </>);
};

export default CardMemoria;