
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './SolicitudPrestamo.css';

function SolicitudPrestamo() {
  const [libros, setLibros] = useState([]);
  const [bookId, setBookId] = useState('');
  const [fechaDevolucion, setFechaDevolucion] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function cargarLibros() {
      try {
        const data = await apiRequest('/api/books');
        setLibros(data);
      } catch (err) {
        setError(err.message || 'No se pudieron cargar los libros.');
      } finally {
        setLoading(false);
      }
    }

    cargarLibros();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMensaje('');
    setEnviando(true);

    try {
      const data = await apiRequest('/api/loans/books', {
        method: 'POST',
        body: {
          bookId: Number(bookId),
          userId: user.id,
          fechaDevolucionEstimada: fechaDevolucion,
        },
      });

      setMensaje(
        `¡Préstamo solicitado correctamente! Libro: ${data.libro}`
      );

      setLibros((actuales) =>
        actuales.map((libro) =>
          libro.id === Number(bookId)
            ? {
                ...libro,
                stockDisponible: libro.stockDisponible - 1,
              }
            : libro
        )
      );

      setBookId('');
      setFechaDevolucion('');
    } catch (err) {
      setError(err.message || 'No se pudo solicitar el préstamo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main>
      <section className="solicitud-contenedor">
        <h1>Solicitar préstamo</h1>

        <p className="solicitud-descripcion">
          Selecciona el libro que deseas solicitar y establece
          una fecha estimada para su devolución.
        </p>

        <button
          className="btn-volver"
          onClick={() => navigate('/catalogo')}
        >
          Volver al catálogo
        </button>

        {loading ? (
          <p className="solicitud-mensaje">
            Cargando libros...
          </p>
        ) : (
          <form
            className="solicitud-formulario"
            onSubmit={handleSubmit}
          >
            <label htmlFor="libro">
              Selecciona un libro
            </label>

            <select
              id="libro"
              value={bookId}
              onChange={(event) => setBookId(event.target.value)}
              required
            >
              <option value="">Selecciona un libro</option>

              {libros.map((libro) => (
                <option
                  key={libro.id}
                  value={libro.id}
                  disabled={libro.stockDisponible <= 0}
                >
                  {libro.titulo} - {libro.autor} (
                  {libro.stockDisponible > 0
                    ? `Disponibles: ${libro.stockDisponible}`
                    : 'Agotado'}
                  )
                </option>
              ))}
            </select>

            <label htmlFor="fechaDevolucion">
              Fecha estimada de devolución
            </label>

            <input
              id="fechaDevolucion"
              type="date"
              value={fechaDevolucion}
              onChange={(event) =>
                setFechaDevolucion(event.target.value)
              }
              required
            />

            {error && (
              <p className="solicitud-error">{error}</p>
            )}

            {mensaje && (
              <p className="solicitud-exito">{mensaje}</p>
            )}

            <div className="solicitud-botones">
              <button
                className="btn-solicitar"
                type="submit"
                disabled={enviando}
              >
                {enviando
                  ? 'Enviando...'
                  : 'Solicitar préstamo'}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}

export default SolicitudPrestamo;
