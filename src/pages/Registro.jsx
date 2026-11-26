
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import './Registro.css';

function Registro() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    matricula: '',
    email: '',
    password: '',
    confirmarPassword: '',
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (formulario.password !== formulario.confirmarPassword) {
      setError('Las contraseñas no coinciden. Verifica ambos campos.');
      return;
    }

    setLoading(true);

    try {
      await apiRequest('/api/auth/register', {
        method: 'POST',
        auth: false,
        body: {
          nombre: formulario.nombre,
          matricula: formulario.matricula,
          email: formulario.email,
          password: formulario.password,
          rol: 'USER',
        },
      });

      navigate('/login');
    } catch (err) {
      const mensaje = (err.message || '').toLowerCase();

      if (mensaje.includes('email') && (
        mensaje.includes('exist') || mensaje.includes('registr')
      )) {
        setError('Este correo electrónico ya está registrado. Utiliza otro.');
      } else if (mensaje.includes('matrícula') || mensaje.includes('matricula')) {
        setError('La matrícula ingresada ya está registrada o no es válida.');
      } else if (
        mensaje.includes('datos inválidos') ||
        mensaje.includes('datos invalidos') ||
        mensaje.includes('validation')
      ) {
        setError('Algunos datos no son válidos. Revisa tu nombre, matrícula, correo y contraseña.');
      } else {
        setError(err.message || 'No se pudo completar el registro. Revisa los datos e inténtalo nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="registro-container">
      <form className="registro-card" onSubmit={handleSubmit}>
        <h1>Crear cuenta</h1>

        <p className="registro-descripcion">
          Regístrate en la Biblioteca Universitaria
        </p>

        {error && (
          <p className="registro-mensaje">{error}</p>
        )}

        <div className="registro-formulario">
          <div className="registro-campo">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              id="nombre"
              name="nombre"
              value={formulario.nombre}
              onChange={handleChange}
              placeholder="Ingresa tu nombre completo"
              autoComplete="name"
              required
            />
          </div>

          <div className="registro-campo">
            <label htmlFor="matricula">Matrícula</label>
            <input
              id="matricula"
              name="matricula"
              value={formulario.matricula}
              onChange={handleChange}
              placeholder="Ingresa tu matrícula"
              required
            />
          </div>

          <div className="registro-campo">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formulario.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="registro-campo">
            <label htmlFor="password">Contraseña</label>

            <div className="registro-password-contenedor">
              <input
                id="password"
                name="password"
                type={mostrarPassword ? 'text' : 'password'}
                value={formulario.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="registro-ver-password"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {mostrarPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="registro-campo">
            <label htmlFor="confirmarPassword">
              Confirmar contraseña
            </label>

            <div className="registro-password-contenedor">
              <input
                id="confirmarPassword"
                name="confirmarPassword"
                type={mostrarConfirmacion ? 'text' : 'password'}
                value={formulario.confirmarPassword}
                onChange={handleChange}
                placeholder="Confirma tu contraseña"
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="registro-ver-password"
                onClick={() => setMostrarConfirmacion(!mostrarConfirmacion)}
                aria-label={mostrarConfirmacion ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {mostrarConfirmacion ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            className="registro-boton"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </div>

        <p className="registro-enlace">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </main>
  );
}

export default Registro;
