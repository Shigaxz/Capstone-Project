import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReservationsForSpaceAndDate, createReservation } from '../../services/reservationsApiServices';
import type { Reservation, CreateReservationData } from '../../interfaces/reservations';
import { format, parseISO, setHours, setMinutes, addMinutes, isBefore, isEqual, startOfDay, addDays, subDays } from 'date-fns';

const SeleccionHorario: React.FC = () => {
  const { idLocation, idSpace } = useParams<{ idLocation: string; idSpace: string }>();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [existingReservations, setExistingReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [duration, setDuration] = useState<30 | 60>(30);

  // --- Carga las reservas existentes ---
  const fetchAvailability = useCallback(async () => {
    if (!idSpace) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    setSelectedSlot(null);

    try {
      const data = await getReservationsForSpaceAndDate(idSpace, selectedDate);
      setExistingReservations(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar disponibilidad');
    } finally {
      setLoading(false);
    }
  }, [idSpace, selectedDate]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  // --- Genera los bloques horarios del día ---
  const timeSlots = useMemo(() => {
    const slots: Date[] = [];
    const startHour = 8;
    const endHour = 18;
    const interval = 30;

    let currentTime = setMinutes(setHours(selectedDate, startHour), 0);
    const endTime = setMinutes(setHours(selectedDate, endHour), 0);

    while (isBefore(currentTime, endTime)) {
      slots.push(currentTime);
      currentTime = addMinutes(currentTime, interval);
    }

    return slots;
  }, [selectedDate]);

  // --- Verifica si un slot está disponible ---
  const isSlotAvailable = (slot: Date): boolean => {
    if (isBefore(slot, new Date())) return false;

    const slotEnd = addMinutes(slot, duration);

    for (const res of existingReservations) {
      const resStart = parseISO(res.startTime);
      const resEnd = parseISO(res.endTime);
      if (isBefore(slot, resEnd) && isBefore(resStart, slotEnd)) {
        return false;
      }
    }
    return true;
  };

  // --- Maneja la selección de un slot ---
  const handleSelectSlot = (slot: Date) => {
    if (isSlotAvailable(slot)) {
      setSelectedSlot(slot);
      setError(null);
      setSuccess(null);
    }
  };

  // --- Maneja el cambio de duración ---
  const handleDurationChange = (newDuration: 30 | 60) => {
      setDuration(newDuration);
      setSelectedSlot(null);
  }

  // --- Maneja el envío de la reserva ---
  const handleConfirmReservation = async () => {
    if (!selectedSlot || !idSpace) return;

    const userEmail = prompt("Ingresa tu email @duocuc.cl:", "");
    if (!userEmail || !userEmail.endsWith('@duocuc.cl')) {
        alert("Email inválido o no proporcionado.");
        return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const reservationData: CreateReservationData = {
      espacioId: idSpace,
      email: userEmail,
      startTime: selectedSlot.toISOString(),
      duration: duration,
    };

    try {
      await createReservation(reservationData);
      setSuccess(`Reserva solicitada para ${format(selectedSlot, "HH:mm")} (${duration} min). Recibirás un correo de confirmación.`);
      fetchAvailability();
      setSelectedSlot(null);
    } catch (err: any) {
      setError(err.message || 'Error al crear la reserva.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-sans text-center mb-4 text-gray-800">
        Selecciona un Horario
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Espacio ID: {idSpace} | Lugar ID: {idLocation}
      </p>

      <div className="flex justify-center items-center mb-6 space-x-4">
         <button
            onClick={() => setSelectedDate(prev => startOfDay(subDays(prev, 1)))}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isEqual(selectedDate, startOfDay(new Date()))}
         >
            &lt; Anterior
         </button>
        <input
          type="date"
          value={format(selectedDate, 'yyyy-MM-dd')}
          min={format(new Date(), 'yyyy-MM-dd')}
          onChange={(e) => setSelectedDate(startOfDay(new Date(e.target.value + 'T00:00:00')))}
          className="p-2 border rounded"
        />
         <button onClick={() => setSelectedDate(prev => startOfDay(addDays(prev, 1)))} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
             Siguiente &gt;
         </button>
      </div>

      <div className="flex justify-center items-center mb-8 space-x-4">
          <label className="font-medium">Duración:</label>
          <button
             onClick={() => handleDurationChange(30)}
             className={`px-4 py-1 rounded ${duration === 30 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
           >
               30 min
           </button>
           <button
             onClick={() => handleDurationChange(60)}
             className={`px-4 py-1 rounded ${duration === 60 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
           >
               60 min
           </button>
      </div>

      {error && <p className="text-center text-red-500 mb-4">{error}</p>}
      {success && <p className="text-center text-green-600 mb-4">{success}</p>}

      {loading ? (
        <p className="text-center text-gray-500">Cargando horarios...</p>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-w-3xl mx-auto">
          {timeSlots.map((slot: Date) => {
            const available = isSlotAvailable(slot);
            const isSelected = selectedSlot && isEqual(slot, selectedSlot);

            return (
              <button
                key={slot.toISOString()}
                onClick={() => handleSelectSlot(slot)}
                disabled={!available || loading}
                className={`
                  p-2 rounded border text-center text-sm font-medium
                  transition-colors duration-150
                  ${isSelected
                    ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300'
                    : available
                      ? 'bg-white border-gray-300 hover:bg-blue-100 hover:border-blue-400 cursor-pointer'
                      : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {format(slot, 'HH:mm')}
              </button>
            );
          })}
        </div>
      )}

      {/* Botón de Confirmación */}
      {selectedSlot && !success && (
        <div className="mt-8 text-center">
          <button
            onClick={handleConfirmReservation}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded disabled:bg-gray-400"
          >
            {loading ? 'Confirmando...' : `Confirmar Reserva a las ${format(selectedSlot, 'HH:mm')} (${duration} min)`}
          </button>
        </div>
      )}
    </div>
  );
};

export default SeleccionHorario;