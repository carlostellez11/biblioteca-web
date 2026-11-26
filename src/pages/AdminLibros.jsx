
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import "./AdminLibros.css";

function AdminLibros() {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [nuevoLibro, setNuevoLibro] = useState({
    isbn: "",
    titulo: "",
    autor: "",
    categoria: "",
    stockTotal: 1,
  });

  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [libroEditando, setLibroEditando] = useState(null);
  const [actualizando, setActualizando] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function cargarLibros() {
      try {
        const data = await apiRequest("/api/books");
        setLibros(data);
      } catch (err) {
        setError(err.message || "No se pudieron cargar los libros.");
      } finally {
        setLoading(false);
      }
    }

    cargarLibros();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setMensaje("");
    setGuardando(true);

    try {
      const data = await apiRequest("/api/books", {
        method: "POST",
        body: {
          ...nuevoLibro,
          stockTotal: Number(nuevoLibro.stockTotal),
        },
      });

      setMensaje(data.message || "Libro registrado correctamente.");

      setNuevoLibro({
        isbn: "",
        titulo: "",
        autor: "",
        categoria: "",
        stockTotal: 1,
      });

      setMostrarFormulario(false);

      const librosActualizados = await apiRequest("/api/books");
      setLibros(librosActualizados);
    } catch (err) {
      setMensaje(err.message || "No se pudo registrar el libro.");
    } finally {
      setGuardando(false);
    }
  }

  async function handleEditar(event) {
    event.preventDefault();
    setMensaje("");
    setActualizando(true);

    try {
      const data = await apiRequest(`/api/books/${libroEditando.id}`, {
        method: "PUT",
        body: {
          titulo: libroEditando.titulo,
          autor: libroEditando.autor,
          isbn: libroEditando.isbn,
          categoria: libroEditando.categoria,
          stockTotal: Number(libroEditando.stockTotal),
        },
      });

      setMensaje(data.message || "Libro actualizado correctamente.");
      setLibroEditando(null);

      const librosActualizados = await apiRequest("/api/books");
      setLibros(librosActualizados);
    } catch (err) {
      setMensaje(err.message || "No se pudo actualizar el libro.");
    } finally {
      setActualizando(false);
    }
  }

  return (
    <main>
      <header className="admin-libros-header">
        <div>
          <h1>Gestión de libros</h1>
          <p>Consulta y administra los libros de la biblioteca.</p>
        </div>

        <button
          className="admin-libros-boton"
          onClick={() => navigate("/admin")}
        >
          Volver al panel
        </button>
      </header>

      <div className="admin-libros-acciones">
        <button
          type="button"
          className="admin-libros-boton"
          onClick={() => setMostrarFormulario(true)}
        >
          Registrar nuevo libro
        </button>
      </div>

      {mostrarFormulario && (
        <div className="admin-modal-fondo">
          <form
            className="admin-libro-formulario admin-modal"
            onSubmit={handleSubmit}
          >
            <h2>Registrar nuevo libro</h2>

            <label>ISBN</label>
            <input
              type="text"
              value={nuevoLibro.isbn}
              onChange={(event) =>
                setNuevoLibro({ ...nuevoLibro, isbn: event.target.value })
              }
              required
            />

            <label>Título</label>
            <input
              type="text"
              value={nuevoLibro.titulo}
              onChange={(event) =>
                setNuevoLibro({ ...nuevoLibro, titulo: event.target.value })
              }
              required
            />

            <label>Autor</label>
            <input
              type="text"
              value={nuevoLibro.autor}
              onChange={(event) =>
                setNuevoLibro({ ...nuevoLibro, autor: event.target.value })
              }
              required
            />

            <label>Categoría</label>
            <input
              type="text"
              value={nuevoLibro.categoria}
              onChange={(event) =>
                setNuevoLibro({ ...nuevoLibro, categoria: event.target.value })
              }
              required
            />

            <label>Existencias</label>
            <input
              type="number"
              min="1"
              value={nuevoLibro.stockTotal}
              onChange={(event) =>
                setNuevoLibro({ ...nuevoLibro, stockTotal: event.target.value })
              }
              required
            />

            <div className="admin-libros-acciones">
              <button type="submit" disabled={guardando}>
                {guardando ? "Guardando..." : "Guardar libro"}
              </button>

              <button
                type="button"
                className="admin-libros-boton"
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {mensaje && <p className="admin-libros-mensaje">{mensaje}</p>}

      {libroEditando && (
        <div className="admin-modal-fondo">
          <form
            className="admin-libro-formulario admin-modal"
            onSubmit={handleEditar}
          >
            <h2>Editar libro</h2>

            <label>ISBN</label>
            <input
              type="text"
              value={libroEditando.isbn}
              onChange={(event) =>
                setLibroEditando({
                  ...libroEditando,
                  isbn: event.target.value,
                })
              }
            />

            <label>Título</label>
            <input
              type="text"
              value={libroEditando.titulo}
              onChange={(event) =>
                setLibroEditando({
                  ...libroEditando,
                  titulo: event.target.value,
                })
              }
            />

            <label>Autor</label>
            <input
              type="text"
              value={libroEditando.autor}
              onChange={(event) =>
                setLibroEditando({
                  ...libroEditando,
                  autor: event.target.value,
                })
              }
            />

            <label>Categoría</label>
            <input
              type="text"
              value={libroEditando.categoria}
              onChange={(event) =>
                setLibroEditando({
                  ...libroEditando,
                  categoria: event.target.value,
                })
              }
            />

            <label>Existencias totales</label>
            <input
              type="number"
              min="0"
              value={libroEditando.stockTotal}
              onChange={(event) =>
                setLibroEditando({
                  ...libroEditando,
                  stockTotal: event.target.value,
                })
              }
            />

            <div className="admin-libros-acciones">
              <button type="submit" disabled={actualizando}>
                {actualizando ? "Actualizando..." : "Guardar cambios"}
              </button>

              <button
                type="button"
                className="admin-libros-boton"
                onClick={() => setLibroEditando(null)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <p>Cargando libros...</p>}

      {error && <p className="admin-libros-mensaje">{error}</p>}

      {!loading && !error && (
        <section>
          <h2>Libros registrados ({libros.length})</h2>

          {libros.length === 0 ? (
            <p className="admin-libros-mensaje">
              No hay libros registrados.
            </p>
          ) : (
            <div className="admin-libros-grid">
              {libros.map((libro) => (
                <article className="admin-libro-card" key={libro.id}>
                  <h3>{libro.titulo}</h3>
                  <p>Autor: {libro.autor}</p>
                  <p>Categoría: {libro.categoria}</p>
                  <p>ISBN: {libro.isbn}</p>
                  <p>
                    Existencias: {libro.stockDisponible} de {libro.stockTotal}
                  </p>

                  <button
                    type="button"
                    className="admin-libros-boton"
                    onClick={() => setLibroEditando({ ...libro })}
                  >
                    Editar libro
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

export default AdminLibros;
