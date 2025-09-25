
//import { useState } from 'react'
import './app.css'
import image1 from '../assets/imgsedes/Alameda.jpg';
import image2 from '../assets/imgsedes/Antonio-varas.jpg';
import image3 from '../assets/imgsedes/melipilla-2.jpg';
import Nav from '../componentes/Nav'
import Footer from '../componentes/Footer'
import Carousel from '../componentes/Carousel'



//import viteLogo from '/vite.svg'

function App() {

  return (
    <>
    <Nav/>

    <Carousel items={[
    { image: image1, text: 'Sede Alameda'},
    { image: image2, text: 'Sede Antonio Varas', },
    { image: image3, text: 'Sede Melipilla', },
  ]}/>



    <Footer/>
    </>
  )
}
export default App
