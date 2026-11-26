
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './MisPrestamos.css';

function MisPrestamos() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarPrestamos() {
      try {
        const data = await apiRequest('/api/loans/books');

        const misPrestamos = data.filter(
          (prestamo) => prestamo.userId === user.id
        );

        setPrestamos(misPrestamos);
      } catch (err) {
        setError(err.message || 'No se pudieron cargar tus préstamos.');
      } finally {
        setLoading(false);
      }
    }

    cargarPrestamos();
  }, [user.id]);

  return (
    <main>
      <header className="prestamos-header">
        <div>
          <h1>Mis préstamos</h1>
          <p className="prestamos-descripcion">
            Consulta los libros que tienes actualmente.
          </p>
        </div>

        <button
          className="btn-volver-prestamos"
          onClick={() => navigate('/catalogo')}
        >
          Volver al catálogo
        </button>
      </header>

      {loading && (
        <p className="prestamos-mensaje">
          Cargando préstamos...
        </p>
      )}

      {error && (
        <p className="prestamos-mensaje">
          {error}
        </p>
      )}

      {!loading && !error && prestamos.length === 0 && (
        <p className="prestamos-mensaje">
          No tienes préstamos registrados.
        </p>
      )}

      {!loading && !error && prestamos.length > 0 && (
        <section className="prestamos-contenedor">
          {prestamos.map((prestamo) => (
            <article
              className="prestamo-card"
              key={prestamo.loanId}
            >
              <h2>{prestamo.libro}</h2>

              <p>Autor: {prestamo.autor}</p>

              <p>ISBN: {prestamo.isbn}</p>

              <p>
                Estado:
                <span className="prestamo-estado">
                  {' '}{prestamo.estatus}
                </span>
              </p>

              <p>
                Fecha de préstamo: {prestamo.fechaPrestamo}
              </p>

              <p>
                Fecha de devolución: {prestamo.fechaDevolucionEstimada}
              </p>

              {prestamo.vencido && (
                <p className="prestamo-vencido">
                  Este préstamo está vencido.
                </p>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default MisPrestamos;
