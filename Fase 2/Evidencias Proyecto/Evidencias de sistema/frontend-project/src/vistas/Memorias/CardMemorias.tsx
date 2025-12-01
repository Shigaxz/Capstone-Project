import React from "react";
import { Link } from "react-router-dom";
import './Memorias.css'

interface CardMemoriasProps {
  imageUrl: string;
  date: string;
  title: string;
  link: string;   
}

const CardMemorias: React.FC<CardMemoriasProps> = ({ imageUrl, date, title, link}) => {
  return (
<div className="max-w-sm h-[400px]  shadow-lg
                  flex flex-col cardmemo ">
  <div className="h-2/3 w-full">
    <img
      src={imageUrl}
      className="w-full h-full object-cover"
    />
  </div>

  <div className="h-1/3 p-4 flex flex-col justify-between">
    <div className="overflow-hidden">
      <p className="text-xs text-gray-500 font-medium uppercase mb-2 truncate">{date}</p>
      <h3 className="text-lg font-semibold text-gray-800 leading-snug truncate">{title}</h3>
    </div>

     <div className="flex justify-end mt-2">
  <Link
    to={link}
    className="text-sm font-medium  flex items-center"
  >
    Leer noticia
    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  </Link>
  </div>
  </div>
</div>


  );
};

export default CardMemorias;
