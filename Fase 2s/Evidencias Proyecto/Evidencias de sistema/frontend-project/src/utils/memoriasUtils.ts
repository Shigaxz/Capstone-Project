
import img1 from '../assets/imgBiblio/E_Biblioteca_1.jpg'
import img2 from '../assets/imgBiblio/E_Biblioteca_2.jpg'
import img3 from '../assets/imgCITT/CITT.jpg'


export interface Memoria {
  id : number;  
  imageUrl: string;
  date: string;
  title: string;
  link: string;
  descripcion: string;
}

export const memoriasData: Memoria[] = [
  {
    id : 1,
    imageUrl: img1,
    date: "12 Octubre 2025",
    title: "Feria de ciencias en la escuela",
    link: "",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  },
  {
    id : 2,
    imageUrl: img2,
    date: "5 Octubre 2025",
    title: "Excursión al museo",
    link: "",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  },
  {
    id : 3,
    imageUrl: img3,
    date: "1 Octubre 2025",
    title: "Torneo de matemáticas",
    link: "",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  }
];
