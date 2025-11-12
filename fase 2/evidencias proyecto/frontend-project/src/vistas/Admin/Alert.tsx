import React from 'react';

// Define los tipos de alerta que el componente puede mostrar
type AlertType = 'success' | 'error' | 'warning' | 'info';

// Define las props que el componente aceptará
interface AlertProps {
  type: AlertType;
  title: string;
  message: string;
  isVisible: boolean;
  onClose?: () => void; // onClose es opcional para permitir alertas no descartables
}

// Mapeo de estilos y SVG de iconos para cada tipo de alerta
const alertConfig = {
  success: {
    containerClasses: 'bg-green-100 border-l-4 border-green-500 text-green-700',
    icon: (
      <svg className="w-6 h-6 mr-4" fill="currentColor" viewBox="0-0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
  },
  error: {
    containerClasses: 'bg-red-100 border-l-4 border-red-500 text-red-700',
    icon: (
      <svg className="w-6 h-6 mr-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
  },
  warning: {
    containerClasses: 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700',
    icon: (
      <svg className="w-6 h-6 mr-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  info: {
    containerClasses: 'bg-blue-100 border-l-4 border-blue-500 text-blue-700',
    icon: (
      <svg className="w-6 h-6 mr-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
  },
};

const Alert: React.FC<AlertProps> = ({ type, title, message, isVisible, onClose }) => {
  if (!isVisible) {
    return null;
  }

  const { containerClasses, icon } = alertConfig[type];

  return (
    <div 
      className={`
        fixed top-5 left-1/2 -translate-x-1/2 md:left-auto md:right-5 md:translate-x-0 
        w-11/12 max-w-sm p-4 rounded-md shadow-lg flex items-start transition-all duration-300 z-50 ${containerClasses}
      `} 
      role="alert"
    >
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-grow">
        <p className="font-bold">{title}</p>
        <p className="text-sm">{message}</p>
      </div>
      {onClose && (
        <button 
          onClick={onClose} 
          className="ml-4 -mt-1 -mr-1 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50"
          aria-label="Cerrar"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;