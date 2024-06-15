import { cconexion } from './claseconexion.js';

let carrito = JSON.parse(localStorage.getItem('carrito')) || {};
let sub = JSON.parse(localStorage.getItem('sub')) || [];

// Asegúrate de que sub sea un arreglo, incluso si estaba almacenado como un objeto anteriormente
if (!Array.isArray(sub)) {
  sub = [];
}

document.addEventListener('DOMContentLoaded', async function() {
  const binId = '666f131ee41b4d34e4041ea3'; // ID del bin en JSONBin
  const masterKey = '$2a$10$B932aYdxH1HrrkOGgNwB6.SPPh0Fr8LqJYq3hAUzjqP6w.cr9bVdK'; // Master Key de JSONBin

  // URL para obtener los datos del bin específico
  const apiUrl = `https://api.jsonbin.io/v3/b/${binId}/latest`;

  try {
    const conexion01 = new cconexion(binId, masterKey);
    const comidas = (await conexion01.checkconexion()).data.record.comidas;

    const container = document.getElementById('results');
    container.innerHTML = ''; // Limpiar el contenedor antes de agregar las tarjetas
    comidas.forEach(comida => {
      const card = document.createElement('div');
      card.classList.add('col', 'mb-4'); // Clases para las columnas y margen inferior
      card.innerHTML = `
        <div class="card">
          <img src="${comida.imageurl}" class="card-img-top" alt="${comida.title}">
          <div class="card-body">
            <h5 class="card-title">${comida.title}</h5>
            <p class="card-text">Precio: $ ${comida.precio}</p>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary agregar-btn">Agregar</button>
          </div>
        </div>
      `;
      container.appendChild(card);

      // toda la lógica de carrito
      card.querySelector('.agregar-btn').addEventListener('click', () => {
        agregarAlCarrito(comida);
      });
    });

    // Mostrar sumatoria parcial al cargar la página
    mostrarSumatoriaParcial();

  } catch (error) {
    console.error('Error al obtener datos desde JSONBin:', error.message);
    mostrarError();
  }
});

function agregarAlCarrito(comida) {
  if (carrito[comida.title]) {
    carrito[comida.title].cantidad++;
  } else {
    carrito[comida.title] = {
      title: comida.title,
      precio: comida.precio,
      cantidad: 1
    };
  }

  // Agregar el precio al arreglo de sub como número
  sub.push(Number(comida.precio));

  localStorage.setItem('carrito', JSON.stringify(carrito));
  localStorage.setItem('sub', JSON.stringify(sub));

  console.log(`Artículo agregado al carrito: ${comida.title}`);
  console.log(`El subtotal es: ${comida.precio}`);

  // Actualizar la sumatoria parcial
  mostrarSumatoriaParcial();
}

function mostrarSumatoriaParcial() {
  const subtotalElement = document.getElementById('subtotal');
  const sumatoria = sub.reduce((total, precio) => total + precio, 0);
  subtotalElement.textContent = `${sumatoria.toFixed(2)}`;
}
