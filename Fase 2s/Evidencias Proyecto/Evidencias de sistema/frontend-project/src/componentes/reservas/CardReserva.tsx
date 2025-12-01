
import image1 from '../../assets/imgBiblio/Biblioteca.jpg'


function CardReserva(){
    return (<>
<div className="container mx-auto mt-10 px-4">
  <div className="grid grid-cols-1 md:grid-cols-2 bg-white overflow-hidden  shadow-lg">
    <div className="bg-[#2E2E2E] text-white p-4 md:p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-2 leading-snug italic">
         Reserva tu espacio
        </h2>
         <p className="text-sm leading-relaxed mb-2 ">
         El proceso de poder reservar tu espacio en DuocUC es cada vez mas posible.
        </p>

        <div className="h-1 w-16 bg-yellow-400 mb-2"></div>

       

        <p className="text-sm leading-relaxed">
          <strong>Desde lunes a viernes</strong> podras reservar un espacio en <strong> CITT </strong>,
          Tambien podras reservar espacios en la <strong>Biblioteca</strong> de tu sede.
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

export default CardReserva;