//guardar en PHP y en localStorage

const seccionAgregar = document.getElementById("seccionAgregar");
const seccionBuscar = document.getElementById("seccionBuscar");
const seccionListar = document.getElementById("seccionListar");

const btnAgregar = document.getElementById("btnAgregar");
const btnBuscar = document.getElementById("btnBuscar");
const btnListar = document.getElementById("btnListar");

btnAgregar.addEventListener("click", () => mostrarSeccion("agregar"));
btnBuscar.addEventListener("click", () => mostrarSeccion("buscar"));
btnListar.addEventListener("click", () => mostrarSeccion("listar"));

function mostrarSeccion(seccion) {
  seccionAgregar.classList.add("hidden");
  seccionBuscar.classList.add("hidden");
  seccionListar.classList.add("hidden");

  if (seccion === "agregar") seccionAgregar.classList.remove("hidden");
  else if (seccion === "buscar") seccionBuscar.classList.remove("hidden");
  else if (seccion === "listar") seccionListar.classList.remove("hidden");
}

const formAgregar = document.getElementById("formAgregar");
formAgregar.addEventListener("submit", (e) => {
  e.preventDefault();
  const persona = {
    id: document.getElementById("id").value.trim(),
    nombres: document.getElementById("nombres").value.trim(),
    apellidos: document.getElementById("apellidos").value.trim(),
    direccion: document.getElementById("direccion").value.trim(),
    telefono: document.getElementById("telefono").value.trim()
  };

  // Guardar en localStorage
  let personas = JSON.parse(localStorage.getItem("personas")) || [];
  personas.push(persona);
  localStorage.setItem("personas", JSON.stringify(personas));

  // Enviar a PHP
  fetch("insert.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(persona)
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Persona guardada correctamente.");
        e.target.reset();
      } else {
        alert("Error al guardar en la base de datos: " + data.message);
      }
    })
    .catch(error => alert("Error de conexión: " + error));
});

const formBuscar = document.getElementById("formBuscar");
formBuscar.addEventListener("submit", (e) => {
  e.preventDefault();
  const criterio = document.getElementById("criterio").value;
  const valor = document.getElementById("valorBuscar").value.toLowerCase().trim();
  const personas = JSON.parse(localStorage.getItem("personas")) || [];
  const resultados = personas.filter(p => p[criterio].toLowerCase().includes(valor));
  mostrarTabla(resultados, "resultadoBuscar");
});

document.getElementById("btnCargarLista").addEventListener("click", () => {
  const personas = JSON.parse(localStorage.getItem("personas")) || [];
  mostrarTabla(personas, "resultadoLista");
});

function mostrarTabla(data, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (data.length === 0) {
    contenedor.innerHTML = "<p>No se encontraron resultados.</p>";
    return;
  }

  let tabla = `<table>
    <thead>
      <tr>
        <th>Documento</th><th>Nombres</th><th>Apellidos</th>
        <th>Dirección</th><th>Teléfono</th>
      </tr>
    </thead>
    <tbody>`;

  data.forEach(p => {
    tabla += `<tr>
      <td>${p.id}</td><td>${p.nombres}</td><td>${p.apellidos}</td>
      <td>${p.direccion}</td><td>${p.telefono}</td>
    </tr>`;
  });

  tabla += "</tbody></table>";
  contenedor.innerHTML = tabla;
}
