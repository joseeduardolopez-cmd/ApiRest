const base = "/devices";

// 🔥 Cargar al iniciar (mejor que window.onload)
document.addEventListener("DOMContentLoaded", () => {
    getAll();

    // Eventos botones (mobile friendly)
    document.getElementById("btnGuardar").addEventListener("click", create);
    document.getElementById("btnActualizar").addEventListener("click", update);

    // Buscador en tiempo real
    document.getElementById("buscador").addEventListener("input", filtrar);
});


// 🔹 Obtener todos
function getAll() {
    fetch(base)
    .then(r => r.json())
    .then(data => {
        let tabla = document.getElementById("tabla");
        tabla.innerHTML = "";

        data.forEach(d => {
            let fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${d.id}</td>
                <td>${d.nombre}</td>
                <td>${d.tipo}</td>
                <td>${d.estado}</td>
                <td>${d.area}</td>
                <td>${d.fecha_registro}</td>
                <td>
                    <button class="small btnEditar">Editar</button>
                    <button class="small btnEliminar">Eliminar</button>
                </td>
            `;

            // 🔥 Eventos dinámicos (clave para celular)
            fila.querySelector(".btnEditar").addEventListener("click", () => edit(d));
            fila.querySelector(".btnEliminar").addEventListener("click", () => remove(d.id));

            tabla.appendChild(fila);
        });
    });
}


// 🔹 Crear
function create() {
    fetch(base, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(getData())
    })
    .then(r => r.json())
    .then(() => {
        clear();
        getAll();
    });
}


// 🔹 Editar
function edit(d) {
    document.getElementById("id").value = d.id;
    document.getElementById("nombre").value = d.nombre;
    document.getElementById("tipo").value = d.tipo;
    document.getElementById("estado").value = d.estado;
    document.getElementById("area").value = d.area;
}


// 🔹 Actualizar
function update() {
    let id = document.getElementById("id").value;

    if (!id) return;

    fetch(`${base}/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(getData())
    })
    .then(r => r.json())
    .then(() => {
        clear();
        getAll();
    });
}


// 🔹 Eliminar
function remove(id) {
    fetch(`${base}/${id}`, {
        method: "DELETE"
    })
    .then(() => getAll());
}


// 🔹 Obtener datos
function getData() {
    return {
        nombre: document.getElementById("nombre").value,
        tipo: document.getElementById("tipo").value,
        estado: document.getElementById("estado").value,
        area: document.getElementById("area").value
    };
}


// 🔹 Limpiar formulario
function clear() {
    document.getElementById("id").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("tipo").value = "";
    document.getElementById("estado").value = "";
    document.getElementById("area").value = "";
}


// 🔹 Filtrar (mejorado)
function filtrar() {
    let input = document.getElementById("buscador").value.toLowerCase();
    let filas = document.querySelectorAll("#tabla tr");

    filas.forEach(fila => {
        let columnas = fila.getElementsByTagName("td");

        let texto = Array.from(columnas)
            .map(td => td.textContent.toLowerCase())
            .join(" ");

        fila.style.display = texto.includes(input) ? "" : "none";
    });
}
