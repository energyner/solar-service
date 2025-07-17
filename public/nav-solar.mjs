// nav-solar.mjs
// Mejoras en la lógica de conexión al servidor y detección de entorno.

document.getElementById("solar-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const area = document.getElementById("area").value;
  const irradiacion = document.getElementById("irradiacion").value;
  const eficiencia = document.getElementById("eficiencia").value;

  // --- Configuración de URLs de API ---
  // URL de tu API desplegada en Google Cloud Run
  // ¡Asegúrate de que esta URL sea la correcta para tu servicio Cloud Run!
  const CLOUD_RUN_API_URL =
    "https://solar-service-487796814360.us-east1.run.app/api/produccion-solar";

  // URL de tu API cuando se ejecuta localmente en tu PC (para desarrollo en laptop)
  const LOCAL_API_URL_LAPTOP = "http://localhost:3010/api/produccion-solar";

  // URL de tu API cuando se ejecuta localmente en tu PC (para pruebas desde móvil en la misma LAN)
  // ¡Asegúrate que esta IP sea la IP REAL de tu laptop en tu red Wi-Fi local!
  const LOCAL_API_URL_LAN = "http://192.168.0.252:3010/api/produccion-solar";
  // --- Fin de Configuración de URLs de API ---

  let API_PRODUCCION_FINAL_URL;

  // Lógica para seleccionar la URL de la API basada en el entorno del navegador
  const hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    // Entorno de desarrollo local en la misma laptop
    API_PRODUCCION_FINAL_URL = LOCAL_API_URL_LAPTOP;
    console.log(
      "Entorno detectado: Desarrollo local (laptop). URL API:",
      API_PRODUCCION_FINAL_URL
    );
  } else if (
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    hostname.startsWith("172.")
  ) {
    // Entorno de desarrollo local, accedido por IP en la red de área local (LAN)
    // Esto cubre casos donde el HTML es servido desde la IP local y la API también está en la LAN.
    API_PRODUCCION_FINAL_URL = LOCAL_API_URL_LAN;
    console.log( "Entorno detectado: Desarrollo local (LAN). URL API:", API_PRODUCCION_FINAL_URL );
  } else {
    // Cualquier otro hostname (ej. *.run.app, o un dominio personalizado) se considera producción
    API_PRODUCCION_FINAL_URL = CLOUD_RUN_API_URL;
    console.log(      "Entorno detectado: Producción (Cloud Run). URL API:", API_PRODUCCION_FINAL_URL );
  }

  // 4. Ejecutar solicitud
  fetch(API_PRODUCCION_FINAL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ area, irradiacion, eficiencia }),
  })
    .then((response) => {
      if (!response.ok) {
        // Intenta leer el mensaje de error del cuerpo de la respuesta si no fue exitosa
        return response.text().then((errorMessage) => {
          throw new Error(
            `Error en la solicitud: ${response.status} - ${errorMessage}`
          );
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log("Produccion Solar:", data);
      const resultadoSolar = document.getElementById( "resultadoSolar" );
      // Asegúrate de que 'resultado' o 'produccion_solar' existen en la respuesta
      resultadoSolar.textContent = `Produccion solar calculado: ${
        data.produccion_solar || data.resultado    } Wh`;
      resultadoSolar.style.color = "green";
    })
    .catch((error) => {
      console.error("Error al calcular la produccion solar:", error);
      const resultadoSolar = document.getElementById("resultadoSolar");
      resultadoSolar.textContent = `Error: ${error.message}`;
      resultadoSolar.style.color = "red";
      alert("Error al calcular produccion solar: " + error.message);
    });
});
