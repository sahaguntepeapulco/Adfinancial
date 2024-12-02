// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function() {

  // Función para mostrar la sección de datos
  function showReadOnlyData() {
    document.getElementById('welcome-section').style.display = 'none';
    document.getElementById('data-section').style.display = 'block';
    loadFinancialData(); // Cargar datos en la tabla
  }

  // Función para mostrar la sección de login
  function showLogin() {
    document.getElementById('welcome-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
  }

  // Función para volver a la bienvenida
  function backToWelcome() {
    document.getElementById('data-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('welcome-section').style.display = 'block';
  }

  // Función para cargar los datos financieros
  function loadFinancialData() {
    // Obtener la referencia a la tabla de datos
    const dataTable = document.getElementById('data-table');

    // Limpiar la tabla antes de cargar los datos
    dataTable.innerHTML = '';

    // Obtener los ingresos desde Firebase
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
            <td>$${data.monto}</td>
            <td>${data.categoria}</td>
            <td>${data.metodoPago}</td>
            <td>${data.descripcion}</td>
          </tr>
        `;
      });
      ingresosHTML += `</table>`;

      // Cargar los egresos
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
              <td>$${data.monto}</td>
              <td>${data.categoria}</td>
              <td>${data.metodoPago}</td>
              <td>${data.descripcion}</td>
            </tr>
          `;
        });
        egresosHTML += `</table>`;

        // Agregar los datos a la tabla
        dataTable.innerHTML = ingresosHTML + egresosHTML;
      });
    });
  }

  // Lógica para el formulario de login
  document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === '12345') {
      alert('¡Acceso concedido!');
      showReadOnlyData();  // Mostrar los datos al iniciar sesión
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  });

  // Configuración de Firebase (obtén estos datos desde tu consola de Firebase)
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

  // Función para agregar ingreso
  document.getElementById('ingresos-form')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const fecha = document.getElementById('fechaIngreso').value;
    const monto = document.getElementById('montoIngreso').value;
    const categoria = document.getElementById('categoriaIngreso').value;
    const metodoPago = document.getElementById('metodoPagoIngreso').value;
    const descripcion = document.getElementById('descripcionIngreso').value;

    // Agregar ingreso a Firestore
    db.collection("ingresos").add({
      fecha: fecha,
      monto: monto,
      categoria: categoria,
      metodoPago: metodoPago,
      descripcion: descripcion,
    })
    .then(() => {
      console.log("Ingreso registrado correctamente.");
      alert("Ingreso registrado.");
      document.getElementById('ingresos-form').reset(); // Limpiar el formulario
      loadFinancialData();  // Recargar los datos
    })
    .catch((error) => {
      console.error("Error al agregar el ingreso: ", error);
    });
  });

  // Función para agregar egreso
  document.getElementById('egresos-form')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const fecha = document.getElementById('fechaEgreso').value;
    const monto = document.getElementById('montoEgreso').value;
    const categoria = document.getElementById('categoriaEgreso').value;
    const metodoPago = document.getElementById('metodoPagoEgreso').value;
    const descripcion = document.getElementById('descripcionEgreso').value;

    // Agregar egreso a Firestore
    db.collection("egresos").add({
      fecha: fecha,
      monto: monto,
      categoria: categoria,
      metodoPago: metodoPago,
      descripcion: descripcion,
    })
    .then(() => {
      console.log("Egreso registrado correctamente.");
      alert("Egreso registrado.");
      document.getElementById('egresos-form').reset(); // Limpiar el formulario
      loadFinancialData();  // Recargar los datos
    })
    .catch((error) => {
      console.error("Error al agregar el egreso: ", error);
    });
  });
});
