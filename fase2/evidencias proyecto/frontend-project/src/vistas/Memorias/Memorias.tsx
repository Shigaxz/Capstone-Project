
import Nav from '../../componentes/Nav'
import Footer from '../../componentes/Footer'
import CardMemorias from './CardMemorias';
import { memoriasData } from '../../utils/memoriasUtils';

function Memorias() {
  return (<>
    <Nav/>
    <div className='container mt-8 ml-5'>
        <h1 className="text-2xl">Memorias</h1>
        <h3 className='itext'>
            <i>Entérate de lo que está pasando en nuestras escuelas</i>
        </h3> 
    </div>
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 justify-center gap-6 mt-10">
      {memoriasData.map((memoria, index) => 
      <CardMemorias
        key={index}
        {...memoria} 
        link={`/Memorias/${memoria.id}`}
        />
      )}
   
    </div>

    <Footer/>
    </>
  );
}

export default Memorias;