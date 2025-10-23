// src/utils/dateUtils.ts

interface FormattedDate {
  dateString: string;
  dayName: string;
  fullDate: Date;
}

/**
 * Genera un array con la fecha actual y los siguientes 4 días.
 * Omite los fines de semana y devuelve el nombre del día.
 * Formatea la cadena para mostrar 'Hoy', 'Mañana' o la fecha.
 * @returns Un array de objetos FormattedDate.
 */
export const getNextFiveDays = (): FormattedDate[] => {
  const dates: FormattedDate[] = [];
  const today = new Date();
  const currentDate = new Date();

  const dateformatterOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
  };

  const dayFormatterOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
  };

  while (dates.length < 5) {
    const dayOfWeek = currentDate.getDay();

    // 0 = Domingo, 6 = Sábado. Solo procesamos días de semana.
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      let dateString: string;

      const isToday = today.toDateString() === currentDate.toDateString();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      const isTomorrow = tomorrow.toDateString() === currentDate.toDateString();

      if (isToday) {
        dateString = 'Hoy';
      } else if (isTomorrow) {
        dateString = 'Mañana';
      } else {
        const parts = new Intl.DateTimeFormat('es-ES', dateformatterOptions).formatToParts(currentDate);
        const day = parts.find(p => p.type === 'day')?.value;
        let month = parts.find(p => p.type === 'month')?.value;

        if (month) {
          month = month.charAt(0).toUpperCase() + month.slice(1);
        }

        dateString = `${day} de ${month}.`;
      }

      let dayName = new Intl.DateTimeFormat('es-ES', dayFormatterOptions).format(currentDate);
      dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

      dates.push({
        dateString,
        dayName,
        fullDate: new Date(currentDate),
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};