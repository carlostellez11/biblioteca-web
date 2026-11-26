import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import './Admin.css';

function Admin() {
  const { user, logout: cerrarSesion } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await cerrarSesion();
    navigate('/login');
  }

  return (
    <main className="admin-container">
      <header className="admin-header">
        <div>
          <h1>Panel de administración</h1>
          <p>Bienvenido, {user.nombre}</p>
        </div>

        <button onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <section className="admin-grid">
        <article className="admin-card">
          <h2>Gestión de libros</h2>
          <p>Administra el catálogo de libros.</p>
          <button onClick={() => navigate('/admin/libros')}>
            Administrar libros
          </button>
        </article>

        <article className="admin-card">
          <h2>Gestión de usuarios</h2>
          <p>Consulta y administra los usuarios registrados.</p>
          <button onClick={() => navigate('/admin/usuarios')}>
            Administrar usuarios
          </button>
        </article>

        <article className="admin-card">
          <h2>Gestión de préstamos</h2>
          <p>Consulta los préstamos y registra devoluciones.</p>
          <button onClick={() => navigate('/admin/prestamos')}>
            Administrar préstamos
          </button>
        </article>
      </section>
    </main>
  );
}

export default Admin;