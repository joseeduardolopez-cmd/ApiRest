const base = "/devices";

// Cargar tabla al iniciar
window.onload = getAll;

// 🔹 Obtener todos
function getAll() {
    fetch(base)
    .then(r => r.json())
    .then(data => {
        let tabla = document.getElementById("tabla");
        tabla.innerHTML = "";

        data.forEach(d => {
            tabla.innerHTML += `
                <tr>
                    <td>${d.id}</td>
                    <td>${d.nombre}</td>
                    <td>${d.tipo}</td>
                    <td>${d.estado}</td>
                    <td>${d.area}</td>
                    <td>${d.fecha_registro}</td>
                    <td>
                        <button class="small" onclick='edit(${JSON.stringify(d)})'>Editar</button>
                        <button class="small" onclick="remove(${d.id})">Eliminar</button>
                    </td>
                </tr>
            `;
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

// 🔹 Editar (llenar formulario)
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

function filtrar() {
    let input = document.getElementById("buscador").value.toLowerCase();
    let filas = document.querySelectorAll("#tabla tr");

    filas.forEach(fila => {
        let columnas = fila.getElementsByTagName("td");

        let nombre = columnas[1]?.textContent.toLowerCase() || "";
        let tipo = columnas[2]?.textContent.toLowerCase() || "";
        let estado = columnas[3]?.textContent.toLowerCase() || "";
        let area = columnas[4]?.textContent.toLowerCase() || "";

        if (
            nombre.includes(input) ||
            tipo.includes(input) ||
            estado.includes(input) ||
            area.includes(input)
        ) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }
    });
}
