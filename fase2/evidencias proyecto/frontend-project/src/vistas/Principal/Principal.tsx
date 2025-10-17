import Nav from '../../componentes/Nav';
import Carousel from '../../componentes/Carousel';
import CardMenu from '../../componentes/CardMenu';
import Footer from '../../componentes/Footer';

import image1 from '../../assets/imgsedes/Alameda.jpg';
import image2 from '../../assets/imgsedes/Antonio-varas.jpg';
import image3 from '../../assets/imgsedes/melipilla-2.jpg';

function Principal() {

  return (
    <>
    <Nav/>

    <Carousel items={[
    { image: image1, text: 'Sede Alameda'},
    { image: image2, text: 'Sede Antonio Varas', },
    { image: image3, text: 'Sede Melipilla', },
  ]}/>

    <CardMenu/>


    <Footer/>

 
    </>
  )
}
export default Principal;
