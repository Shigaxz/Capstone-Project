interface infoEspacio {
  nombre:string;
  horarios:string[]
}
interface infoSede {
  nombre:string;
  imagen:string;
  direccion:string;
  espacios:infoEspacio[];
}
const listaSedes:infoSede[]=[
    {
      nombre:'Sede San Bernardo',
      imagen:'https://www.duoc.cl/wp-content/uploads/2020/06/san-bernardo.jpg',
      direccion:'Freire 857, San Bernardo.',
      espacios:[
        {
        nombre:'CITT',
        horarios: ['12:00' , '13:00', '14:00', '16:00', '17:00', '18:00', '19:00', '20:00']
      },
      {
        nombre:'Biblioteca',
        horarios: ['12:00' , '13:00', '14:00', '16:00', '17:00', '18:00', '19:00', '20:00']
      }
    ]
    },
    {
      nombre:'Sede Alameda',
      imagen:'https://www.duoc.cl/wp-content/uploads/2020/06/Alameda.jpg',
      direccion:'Av. España 8, Santiago Centro, Metro Estación República (esquina Alameda).'
    ,espacios:[
      {
        nombre:'CITT',
        horarios: ['12:00' , '13:00', '14:00', '16:00', '17:00', '18:00', '19:00', '20:00']
      }
    ]
    },
    {
      nombre:'Sede Antonio Varas',
      imagen:'https://www.duoc.cl/wp-content/uploads/2020/06/Antonio-varas.jpg',
      direccion:'Antonio Varas 666, Providencia.'
      ,espacios:[
      {
        nombre:'Biblioteca',
        horarios: ['12:00' , '13:00', '14:00', '16:00', '17:00', '18:00', '19:00', '20:00']
      }
      ]
    },
    {
      nombre:'Sede Educacion continua',
      imagen:'https://www.duoc.cl/wp-content/uploads/2020/06/educacion-continua.jpg',
      direccion:'Miguel Claro 337, Providencia, Santiago.'
      ,espacios:[
        {
        nombre:'CITT',
        horarios: ['12:00' , '13:00', '14:00', '16:00', '17:00', '18:00', '19:00', '20:00']
      },
      {
        nombre:'Biblioteca',
        horarios: ['12:00' , '13:00', '14:00', '16:00', '17:00', '18:00', '19:00', '20:00']
      }
      ]
    },
    {
      nombre:'Sede Melipilla',
      imagen:'https://www.duoc.cl/wp-content/uploads/2020/06/melipilla-2.jpg',
      direccion:'Serrano 1105, Melipilla.'
      ,espacios:[
        {
        nombre:'CITT',
        horarios: ['12:00' , '13:00', '14:00', '16:00', '17:00', '18:00', '19:00', '20:00']
      },
      {
        nombre:'Biblioteca',
        horarios: ['12:00' , '13:00', '14:00', '16:00', '17:00', '18:00', '19:00', '20:00']
      }
      ]
    },
  ]
export const getSedes = ()=>{
return listaSedes
}