
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./AdminUsuarios.css";

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [actualizandoRol, setActualizandoRol] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function cargarUsuarios() {
      try {
        const data = await apiRequest("/api/users");
        setUsuarios(data);
      } catch (err) {
        setError(err.message || "No se pudieron cargar los usuarios.");
      } finally {
        setLoading(false);
      }
    }

    cargarUsuarios();
  }, []);

  async function handleCambiarRol(id, nuevoRol) {
    setMensaje("");
    setActualizandoRol(id);

    try {
      const data = await apiRequest(`/api/users/${id}/role`, {
        method: "PATCH",
        body: {
          rol: nuevoRol,
        },
      });

      setUsuarios((usuariosActuales) =>
        usuariosActuales.map((usuario) =>
          usuario.id === id ? data.user : usuario
        )
      );

      setMensaje(data.message || "Rol actualizado correctamente.");
    } catch (err) {
      setMensaje(err.message || "No se pudo actualizar el rol.");
    } finally {
      setActualizandoRol(null);
    }
  }

  async function handleCambiarEstado(usuario) {
    const nuevoEstado = !usuario.activo;

    setMensaje("");
    setActualizandoRol(usuario.id);

    try {
      const data = await apiRequest(`/api/users/${usuario.id}/status`, {
        method: "PATCH",
        body: {
          activo: nuevoEstado,
        },
      });

      setUsuarios((usuariosActuales) =>
        usuariosActuales.map((u) =>
          u.id === usuario.id ? data.user : u
        )
      );

      setMensaje(data.message || "Estado del usuario actualizado.");
    } catch (err) {
      setMensaje(err.message || "No se pudo actualizar el estado.");
    } finally {
      setActualizandoRol(null);
    }
  }

  return (
    <main>
      <header className="admin-usuarios-header">
        <div>
          <h1>Gestión de usuarios</h1>
          <p>
            Consulta y administra los usuarios registrados en la biblioteca.
          </p>
        </div>

        <button
          className="admin-usuarios-boton"
          onClick={() => navigate("/admin")}
        >
          Volver al panel
        </button>
      </header>

      {mensaje && (
        <p className="admin-usuarios-mensaje">{mensaje}</p>
      )}

      {loading && <p>Cargando usuarios...</p>}

      {error && <p className="admin-usuarios-mensaje">{error}</p>}

      {!loading && !error && (
        <section>
          <h2>Usuarios registrados ({usuarios.length})</h2>

          {usuarios.length === 0 ? (
            <p className="admin-usuarios-mensaje">
              No hay usuarios registrados.
            </p>
          ) : (
            <div className="admin-usuarios-grid">
              {usuarios.map((usuario) => (
                <article className="admin-usuario-card" key={usuario.id}>
                  <h3>{usuario.nombre}</h3>

                  <p>
                    <strong>Matrícula:</strong> {usuario.matricula}
                  </p>

                  <p>
                    <strong>Correo:</strong> {usuario.email}
                  </p>

                  <p>
                    <strong>Rol:</strong> {usuario.rol}
                  </p>

                  <p>
                    <strong>Estado:</strong>{" "}
                    {usuario.activo ? "Activo" : "Inactivo"}
                  </p>

                  <p>
                    <strong>Fecha de registro:</strong>{" "}
                    {new Date(usuario.createdAt).toLocaleDateString("es-MX")}
                  </p>

                  <label>Cambiar rol:</label>

                  <select
                    value={usuario.rol}
                    disabled={
                      String(usuario.id) === String(user?.id) ||
                      actualizandoRol === usuario.id
                    }
                    onChange={(event) =>
                      handleCambiarRol(usuario.id, event.target.value)
                    }
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>

                  {String(usuario.id) === String(user?.id) && (
                    <p>No puedes modificar tu propio rol.</p>
                  )}

                  <button
                    type="button"
                    className="admin-usuarios-boton"
                    disabled={
                      String(usuario.id) === String(user?.id) ||
                      actualizandoRol === usuario.id
                    }
                    onClick={() => handleCambiarEstado(usuario)}
                  >
                    {actualizandoRol === usuario.id
                      ? "Actualizando..."
                      : usuario.activo
                        ? "Desactivar usuario"
                        : "Activar usuario"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default AdminUsuarios;
