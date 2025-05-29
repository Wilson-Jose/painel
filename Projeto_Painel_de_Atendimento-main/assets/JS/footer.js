function DataHora() {
  const agora = new Date();

  const data = agora.toLocaleDateString("pt-BR", {
    // weekday: 'long',
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const hora = agora.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  document.getElementById("dataHora").textContent = `${hora} ${data}`;
  // document.getElementById('hora').textContent = `${hora}`;
}
setInterval(DataHora, 1000);
DataHora();

// Buscar clima usando OpenWeather
async function buscarClima() {
  const apiKey = "1cc74e49bdf9f9a0b65fcfc199bf0685"; // key de API do OpenWeather
  const cidade = "São Paulo"; // Cidade para buscar o clima
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&lang=pt_br&units=metric`;

  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();
    const temperatura = dados.main.temp;
    const descricao = dados.weather[0].description;
    document.getElementById(
      "clima"
    ).textContent = `${cidade}: ${temperatura.toFixed(1)}°C\n${descricao}`;
  } catch (erro) {
    document.getElementById("clima").textContent =
      "Não foi possível carregar o clima.";
  }
}

buscarClima();
