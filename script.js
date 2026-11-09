const inputPais = document.getElementById("pais");
const botonBuscar = document.getElementById("buttonPais");
const contenedorResultado = document.getElementById("resultado");

botonBuscar.addEventListener("click", searchCountry);
inputPais.addEventListener("keypress", function (event) {
  if (event.key === "Enter") searchCountry();
});

async function searchCountry() {
  const paisBuscado = inputPais.value.trim();
  if (!paisBuscado) {
    contenedorResultado.innerHTML =
      "<p class='error'>Por favor, ingresa el nombre de un país.</p>";
    return;
  }

  contenedorResultado.innerHTML = "<p class='loading'>Buscando país...</p>";

  const apiKey = "rc_live_fae8698b9e8943859c9f3f667bf94e37";

  const apiUrl = `https://api.restcountries.com/countries/v5?q=${encodeURIComponent(paisBuscado)}&limit=1&api-key=${apiKey}`;

  const urlProxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;

  try {
    const respuesta = await fetch(urlProxy);

    if (!respuesta.ok) {
      throw new Error(`Código HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json();

    const listaPaises =
      datos.data && datos.data.objects ? datos.data.objects : [];

    if (listaPaises.length === 0) {
      throw new Error("No se encontró información para este país.");
    }

    const pais = listaPaises[0];

    const nombre = pais.names ? pais.names.common : "No disponible";

    let capital = "No disponible";
    if (pais.capitals && pais.capitals.length > 0) {
      capital = pais.capitals[0].name || pais.capitals[0];
    } else if (pais.capital && pais.capital.length > 0) {
      capital = pais.capital[0];
    }

    const poblacion = pais.population
      ? pais.population.toLocaleString("es-ES")
      : "No disponible";

    let banderaUrl = "";
    if (pais.flag) {
      banderaUrl = pais.flag.url_png || pais.flag.url_svg;
    }

    let idiomas = "No disponible";
    if (pais.languages && pais.languages.length > 0) {
      idiomas = pais.languages
        .map((idioma) => idioma.name || idioma)
        .join(", ");
    }

    mostrarEnPantalla(nombre, capital, poblacion, banderaUrl, idiomas);
  } catch (error) {
    console.error("Error detallado:", error);

    contenedorResultado.innerHTML = `<p class="error"><strong>No se pudo conectar:</strong> ${error.message}</p>`;
  }
}

function mostrarEnPantalla(nombre, capital, poblacion, banderaUrl, idiomas) {
  contenedorResultado.innerHTML = `
        <div class="pais-card">
            <img src="${banderaUrl}" alt="Bandera de ${nombre}" class="bandera">
            <h2>${nombre}</h2>
            <ul>
                <li><strong>Capital:</strong> ${capital}</li>
                <li><strong>Población:</strong> ${poblacion} habitantes</li>
                <li><strong>Idioma(s):</strong> ${idiomas}</li>
            </ul>
        </div>
    `;
}