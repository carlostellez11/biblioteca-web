
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Catalogo.css';

function Catalogo() {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, logout } = useAuth();

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

  return (
    <main>
      <header className="catalogo-header">
        <div>
          <h1>Catálogo de libros</h1>
          <p>Bienvenido, {user?.name || user?.email}</p>
        </div>

        <div className="catalogo-acciones">
          <Link to="/solicitud-prestamo">
            Solicitar préstamo
          </Link>

          <Link to="/mis-prestamos">
            Mis préstamos
          </Link>

          <button
            className="btn-cerrar-sesion"
            onClick={logout}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {loading && (
        <p className="catalogo-mensaje">Cargando libros...</p>
      )}

      {error && (
        <p className="catalogo-mensaje">{error}</p>
      )}

      {!loading && !error && (
        <section className="catalogo-libros">
          {libros.map((libro) => (
            <article className="libro-card" key={libro.id}>
              <h2>{libro.titulo}</h2>
              <p>Autor: {libro.autor}</p>
              <p>Categoría: {libro.categoria}</p>
              <p>ISBN: {libro.isbn}</p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Catalogo;
