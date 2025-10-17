
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
    imageUrl: "src/assets/imgBiblio/E_Biblioteca_1.jpg",
    date: "12 Octubre 2025",
    title: "Feria de ciencias en la escuela",
    link: "",
    descripcion: "hola"
  },
  {
    id : 2,
    imageUrl: "src/assets/imgBiblio/E_Biblioteca_1.jpg",
    date: "5 Octubre 2025",
    title: "Excursión al museo",
    link: "",
    descripcion: "hola"
  },
  {
    id : 3,
    imageUrl: "src/assets/imgBiblio/E_Biblioteca_1.jpg",
    date: "1 Octubre 2025",
    title: "Torneo de matemáticas",
    link: "",
    descripcion: "hola"
  }
];
