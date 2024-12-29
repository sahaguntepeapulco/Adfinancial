// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function() {
  
  // Función para mostrar la sección de datos (después del login exitoso)
  function showReadOnlyData() {
    document.getElementById('welcome-section').style.display = 'none';
    document.getElementById('data-section').style.display = 'block';
    loadFinancialData(); // Cargar datos en las tablas
  }

  // Función para mostrar la sección de login
  function showLogin() {
    document.getElementById('welcome-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
  }

  // Función para volver a la sección de bienvenida
  function backToWelcome() {
    document.getElementById('data-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('welcome-section').style.display = 'block';
  }

  // Función para formatear el monto con símbolo de moneda ($)
  function formatearMoneda(valor) {
    return `$${parseFloat(valor).toFixed(2)}`; // Convierte el número a formato $0.00
  }

  // Función para cargar los datos financieros desde Firebase
  function loadFinancialData() {
    // Obtener la referencia al contenedor de la tabla
    const dataTable = document.getElementById('data-table');

    // Limpiar la tabla antes de cargar nuevos datos
    dataTable.innerHTML = '';

    // Obtener y cargar los datos de ingresos desde Firebase
    db.collection("ingresos").get().then((querySnapshot) => {
      let ingresosHTML = `
        <h3>Ingresos</h3>
        <table border="1" style="width:100%; text-align: center;">
          <tr><th>Fecha</th><th>Monto</th><th>Categoría</th><th>Método</th><th>Descripción</th></tr>`;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        ingresosHTML += `
          <tr>
            <td>${data.fecha}</td>
            <td>${formatearMoneda(data.monto)}</td> <!-- Monto con símbolo $ -->
            <td>${data.categoria}</td>
            <td>${data.metodoPago}</td>
            <td>${data.descripcion}</td>
          </tr>
        `;
      });
      ingresosHTML += `</table>`;

      // Obtener y cargar los datos de egresos desde Firebase
      db.collection("egresos").get().then((querySnapshot) => {
        let egresosHTML = `
          <h3>Egresos</h3>
          <table border="1" style="width:100%; text-align: center;">
            <tr><th>Fecha</th><th>Monto</th><th>Categoría</th><th>Método</th><th>Descripción</th></tr>`;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          egresosHTML += `
            <tr>
              <td>${data.fecha}</td>
              <td>${formatearMoneda(data.monto)}</td> <!-- Monto con símbolo $ -->
              <td>${data.categoria}</td>
              <td>${data.metodoPago}</td>
              <td>${data.descripcion}</td>
            </tr>
          `;
        });
        egresosHTML += `</table>`;

        // Mostrar los datos combinados en el contenedor de la tabla
        dataTable.innerHTML = ingresosHTML + egresosHTML;
      });
    });
  }

  // Lógica del formulario de login
  document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === '12345') {
      alert('¡Acceso concedido!');
      showReadOnlyData();  // Mostrar los datos financieros
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  });

  // Configuración de Firebase (obtener los datos desde Firebase Console)
  const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID",
    measurementId: "TU_MEASUREMENT_ID"
  };

  // Inicializa Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // Función para agregar un ingreso a Firebase
  document.getElementById('ingresos-form')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const fecha = document.getElementById('fechaIngreso').value;
    const monto = document.getElementById('montoIngreso').value;
    const categoria = document.getElementById('categoriaIngreso').value;
    const metodoPago = document.getElementById('metodoPagoIngreso').value;
    const descripcion = document.getElementById('descripcionIngreso').value;

    db.collection("ingresos").add({
      fecha: fecha,
      monto: monto,
      categoria: categoria,
      metodoPago: metodoPago,
      descripcion: descripcion,
    })
    .then(() => {
      alert("Ingreso registrado.");
      document.getElementById('ingresos-form').reset(); // Limpiar el formulario
      loadFinancialData();  // Recargar los datos
    });
  });

  // Función para agregar un egreso a Firebase
  document.getElementById('egresos-form')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const fecha = document.getElementById('fechaEgreso').value;
    const monto = document.getElementById('montoEgreso').value;
    const categoria = document.getElementById('categoriaEgreso').value;
    const metodoPago = document.getElementById('metodoPagoEgreso').value;
    const descripcion = document.getElementById('descripcionEgreso').value;

    db.collection("egresos").add({
      fecha: fecha,
      monto: monto,
      categoria: categoria,
      metodoPago: metodoPago,
      descripcion: descripcion,
    })
    .then(() => {
      alert("Egreso registrado.");
      document.getElementById('egresos-form').reset(); // Limpiar el formulario
      loadFinancialData();  // Recargar los datos
    });
  });
});

