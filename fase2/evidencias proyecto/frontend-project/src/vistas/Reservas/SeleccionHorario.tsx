import React, { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getReservationsForSpaceAndDate,
  createReservation,
} from "../../services/reservationsApiServices";
import type {
  Reservation,
  CreateReservationData,
} from "../../interfaces/reservations";
import {
  format,
  parseISO,
  setHours,
  setMinutes,
  addMinutes,
  isBefore,
  isEqual,
  startOfDay,
  addDays,
  subDays,
  isSaturday,
  isSunday,
} from "date-fns";
import { es } from "date-fns/locale";
import EmailConfirmationModal from "./EmailConfirmationModal";

const SeleccionHorario: React.FC = () => {
  const { idLocation, idSpace } = useParams<{
    idLocation: string;
    idSpace: string;
  }>();
  console.log("ID del Espacio leído desde la URL (idSpace):", idSpace);
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<Date>(
    startOfDay(new Date())
  );
  const [existingReservations, setExistingReservations] = useState<
    Reservation[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [duration, setDuration] = useState<30 | 60>(30);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const fetchAvailability = useCallback(async () => {
    if (!idSpace) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    setSelectedSlot(null);

    try {
      const data = await getReservationsForSpaceAndDate(idSpace, selectedDate);
      console.log('Reservas recibidas del Backend:', data);
      setExistingReservations(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar disponibilidad");
    } finally {
      setLoading(false);
    }
  }, [idSpace, selectedDate]);

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
  };

  // --- Abre el modal de confirmación ---
  const handleOpenConfirmation = () => {
    setIsEmailModalOpen(true);
  };

  const handleConfirmReservation = async (userEmail: string) => {
    // Comprueba que tenga valor
    if (!idSpace) {
      setError("Error: No se ha seleccionado un ID de espacio.");
      return;
    }
    // Comprueba que tenga valor
    if (!selectedSlot) {
      setError("Error: No se ha seleccionado un bloque horario.");
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
      setSuccess(
        `Reserva solicitada para ${format(
          selectedSlot,
          "HH:mm"
        )} (${duration} min). Recibirás un correo de confirmación.`
      );
      setIsEmailModalOpen(false);
      fetchAvailability();
      setSelectedSlot(null);
    } catch (err: any) {
      setError(err.message || "Error al crear la reserva.");
    } finally {
      setIsEmailModalOpen(false);
      setLoading(false);
    }
  };

  // --- Navegación de fecha con exclusión de fines de semana ---
  const handleNextDay = () => {
    setSelectedDate((prev) => {
      let nextDay = addDays(prev, 1);
      while (isSaturday(nextDay) || isSunday(nextDay)) {
        nextDay = addDays(nextDay, 1);
      }
      return startOfDay(nextDay);
    });
  };

  const handlePrevDay = () => {
    setSelectedDate((prev) => {
      let prevDay = subDays(prev, 1);
      while (isSaturday(prevDay) || isSunday(prevDay)) {
        prevDay = subDays(prevDay, 1);
      }
      // No permitir ir a una fecha anterior a hoy
      if (isBefore(prevDay, startOfDay(new Date()))) {
        return prev;
      }
      return startOfDay(prevDay);
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = startOfDay(new Date(e.target.value + "T00:00:00"));
    if (isSaturday(newDate) || isSunday(newDate)) return;
    setSelectedDate(newDate);
  };
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Botón para volver a la selección de espacios */}
        <div className="mb-6">
          <Link
            to={`/reservas/${idLocation}`}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            &larr; Volver a Espacios
          </Link>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-sans text-gray-800">
            Selecciona un Horario
          </h1>
          <p className="text-gray-500 mt-2">
            Elige el día y la hora para tu reserva.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md space-y-8">
          {/* --- Selector de Fecha --- */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
            <button
              onClick={handlePrevDay}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isEqual(selectedDate, startOfDay(new Date()))}
            >
              &lt;
            </button>
            <div className="text-center">
              <p className="text-lg font-semibold capitalize text-gray-800">
                {format(selectedDate, "EEEE", { locale: es })}
              </p>
              <input
                type="date"
                value={format(selectedDate, "yyyy-MM-dd")}
                min={format(new Date(), "yyyy-MM-dd")}
                onChange={handleDateChange}
                className="p-2 border-gray-300 rounded-md text-center bg-transparent"
              />
            </div>
            <button
              onClick={handleNextDay}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition-colors"
            >
              &gt;
            </button>
          </div>

          {/* --- Selector de Duración --- */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <label className="font-medium text-gray-700">
              Duración de la reserva:
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDurationChange(30)}
                className={`px-6 py-2 rounded-md font-semibold text-sm transition-all duration-200 transform hover:scale-105 ${
                  duration === 30
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                30 min
              </button>
              <button
                onClick={() => handleDurationChange(60)}
                className={`px-6 py-2 rounded-md font-semibold text-sm transition-all duration-200 transform hover:scale-105 ${
                  duration === 60
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                60 min
              </button>
            </div>
          </div>

          {/* --- Mensajes de estado --- */}
          {error && (
            <p className="text-center text-red-600 bg-red-100 p-3 rounded-md">
              {error}
            </p>
          )}
          {success && (
            <p className="text-center text-green-700 bg-green-100 p-3 rounded-md">
              {success}
            </p>
          )}

          {/* --- Grilla de Horarios --- */}
          {loading ? (
            <p className="text-center text-gray-500 py-10">
              Cargando horarios...
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {timeSlots.map((slot: Date) => {
                const available = isSlotAvailable(slot);
                const isSelected = selectedSlot && isEqual(slot, selectedSlot);

                return (
                  <button
                    key={slot.toISOString()}
                    onClick={() => handleSelectSlot(slot)}
                    disabled={!available || loading}
                    className={`
                                    p-3 rounded-md border text-center text-sm font-semibold
                                    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                                    ${
                                      isSelected
                                        ? "bg-blue-600 text-white border-blue-700 ring-blue-500"
                                        : available
                                        ? "bg-white border-gray-300 hover:bg-blue-50 hover:border-blue-400 cursor-pointer"
                                        : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-70"
                                    }
                                `}
                  >
                    {format(slot, "HH:mm")}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Botón de Confirmación */}
        {selectedSlot && !success && (
          <div className="mt-8 text-center">
            <button
              onClick={handleOpenConfirmation}
              disabled={loading}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:bg-gray-400"
            >
              {loading
                ? "Confirmando..."
                : `Confirmar Reserva a las ${format(
                    selectedSlot,
                    "HH:mm"
                  )} (${duration} min)`}
            </button>
          </div>
        )}

        <EmailConfirmationModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          onSubmit={handleConfirmReservation}
          slotTime={selectedSlot ? format(selectedSlot, "HH:mm") : ""}
          duration={duration}
        />
      </div>
    </div>
  );
};

export default SeleccionHorario;
