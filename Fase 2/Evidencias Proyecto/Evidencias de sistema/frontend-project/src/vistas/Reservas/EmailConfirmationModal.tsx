import React, { useState, useEffect } from 'react';

interface EmailConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
  slotTime: string;
  duration: number;
}

const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  slotTime,
  duration,
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('El email no puede estar vacío.');
      return;
    }
    if (!email.endsWith('@duocuc.cl')) {
      setError('Debe ser un correo institucional @duocuc.cl.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSubmit(email);
      // El componente padre se encargará de cerrar el modal si tiene éxito
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al confirmar.');
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Confirmar Reserva</h2>
          <p className="text-sm text-gray-600">Para el horario de las {slotTime} ({duration} min)</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</div>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Ingresa tu correo @duocuc.cl</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre.apellido@duocuc.cl" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required disabled={loading} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50" disabled={loading}>Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400" disabled={loading}>
              {loading ? 'Confirmando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailConfirmationModal;