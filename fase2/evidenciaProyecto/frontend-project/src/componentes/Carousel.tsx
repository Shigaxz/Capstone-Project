import React, { useState, useEffect } from 'react';


interface CarouselItem {
  image: string;
  text: string;
}

interface CarouselProps {
  items: CarouselItem[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer); // Cleanup on unmount
  }, [items.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={index} className="w-full flex-shrink-0 relative">
            <img src={item.image} alt={`Slide ${index + 1}`} className="w-full object-cover h-64 md:h-96" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center">
              <h2 className="text-xl md:text-3xl font-bold">{item.text}</h2>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 flex justify-between w-full text-3xl">
        <button
          onClick={goToPrevious}
          className="text-white p-2 rounded-full focus:outline-none ml-5"
        >
          &#10094;
        </button>
        <button
          onClick={goToNext}
          className="text-white p-2  rounded-full focus:outline-none mr-5"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default Carousel;