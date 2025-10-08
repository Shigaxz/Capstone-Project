// src/utils/dateUtils.ts

interface FormattedDate {
  dateString: string;
  fullDate: Date;
}

/**
 * Genera un array con la fecha actual y los siguientes 4 días.
 * Formatea la cadena de texto para mostrar 'Hoy' y 'Mañana'.
 * @returns Un array de objetos FormattedDate.
 */
export const getNextFiveDays = (): FormattedDate[] => {
  const dates: FormattedDate[] = [];
  const today = new Date(); // Fecha actual

  // Opciones de formato para el día y mes (ej: '8 de Oct')
  const formatterOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short', // 'short' para Oct, Nov, etc.
  };

  for (let i = 0; i < 5; i++) {
    const nextDate = new Date();
    nextDate.setDate(today.getDate() + i); // Añade 'i' días a la fecha de hoy

    let dateString: string;

    if (i === 0) {
      dateString = 'Hoy';
    } else if (i === 1) {
      dateString = 'Mañana';
    } else {
      // Formato para el día y el mes (ej: 8 de Oct)
      // Ajuste para capitalizar la primera letra del mes (opcional)
      const parts = new Intl.DateTimeFormat('es-ES', formatterOptions).formatToParts(nextDate);
      const day = parts.find(p => p.type === 'day')?.value;
      let month = parts.find(p => p.type === 'month')?.value;

      // Capitaliza la primera letra del mes
      if (month) {
        month = month.charAt(0).toUpperCase() + month.slice(1);
      }

      dateString = `${day} de ${month}.`;
    }

    dates.push({
      dateString,
      fullDate: nextDate,
    });
  }

  return dates;
};