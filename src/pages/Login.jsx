
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);

      const rol = user.rol || user.role;

      if (rol?.toUpperCase() === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/catalogo');
      }
    } catch (err) {
      const mensaje = (err.message || '').toLowerCase();

      if (
        mensaje.includes('datos inválidos') ||
        mensaje.includes('datos invalidos') ||
        mensaje.includes('invalid credentials') ||
        mensaje.includes('credenciales') ||
        mensaje.includes('unauthorized') ||
        mensaje.includes('401')
      ) {
        setError(
          'El correo o la contraseña no son correctos. Verifica tus datos e inténtalo nuevamente.'
        );
      } else {
        setError(err.message || 'No se pudo iniciar sesión. Inténtalo nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Biblioteca Universitaria</h1>

        <p className="login-descripcion">
          Inicia sesión en tu cuenta
        </p>

        {error && (
          <p className="login-mensaje">{error}</p>
        )}

        <div className="login-formulario">
          <div className="login-campo">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="correo@ejemplo.com"
              autoComplete="username"
              required
            />
          </div>

          <div className="login-campo">
            <label htmlFor="password">Contraseña</label>

            <div className="login-password-contenedor">
              <input
                id="password"
                type={mostrarPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="login-ver-password"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {mostrarPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            className="login-boton"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </div>

        <p className="login-enlace">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </form>
    </main>
  );
}

export default Login;
