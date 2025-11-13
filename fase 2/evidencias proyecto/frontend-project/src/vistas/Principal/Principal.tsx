import Nav from '../../componentes/Nav';
import Carousel from '../../componentes/Carousel';
import CardMenu from '../../componentes/CardMenu';
import Footer from '../../componentes/Footer';

function Principal() {

  return (
    <>
    <Nav/>

    <Carousel items={[
    { image: '/images/alameda.jpg', text: 'Sede Alameda'},
    { image: '/images/antonio-varas.jpg', text: 'Sede Antonio Varas', },
    { image: '/images/melipilla.jpg', text: 'Sede Melipilla', },
  ]}/>

    <CardMenu/>


    <Footer/>

 
    </>
  )
}
export default Principal;
