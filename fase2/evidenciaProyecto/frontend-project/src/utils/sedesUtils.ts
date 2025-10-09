interface infoSede {
  nombre:string;
  imagen:string;
  direccion:string;
  espacios:string[];
}
const listaSedes:infoSede[]=[
    {
      nombre:'Sede San Bernardo',
      imagen:'https://www.duoc.cl/wp-content/uploads/2020/06/san-bernardo.jpg',
      direccion:'Freire 857, San Bernardo.',
      espacios:['CITT','Biblioteca']
    },
    {
      nombre:'Sede Alameda',
      imagen:'https://www.duoc.cl/wp-content/uploads/2020/06/Alameda.jpg',
      direccion:'Av. España 8, Santiago Centro, Metro Estación República (esquina Alameda).'
    ,espacios:['Biblioteca']
    },
    {
      nombre:'Sede Antonio Varas',
      imagen:'https://www.duoc.cl/wp-content/uploads/2020/06/Antonio-varas.jpg',
      direccion:'Antonio Varas 666, Providencia.'
      ,espacios:['CITT']
    },
    {
      nombre:'Sede Educacion continua',
      imagen:'https://www.duoc.cl/wp-content/uploads/2020/06/educacion-continua.jpg',
      direccion:'Miguel Claro 337, Providencia, Santiago.'
      ,espacios:['CITT','Biblioteca']
    },
    {
      nombre:'Sede Melipilla',
      imagen:'https://www.duoc.cl/wp-content/uploads/2020/06/melipilla-2.jpg',
      direccion:'Serrano 1105, Melipilla.'
      ,espacios:['CITT','Biblioteca']
    },
  ]
export const getSedes = ()=>{
return listaSedes
}