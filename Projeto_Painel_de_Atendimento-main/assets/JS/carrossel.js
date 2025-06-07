document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.getElementById('carousel-container');
    const placeholderHtml = carouselContainer.innerHTML;
    // NOVO: Chaves para o localStorage
    const listKey = 'videoCarouselList';
    const indexKey = 'videoCarouselIndex';
    let videos = [];
    let currentIndex = 0;
    let carouselInterval;

    const getYouTubeID = (url) => {
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname === "youtu.be") return urlObj.pathname.slice(1);
            if (urlObj.hostname.includes("youtube.com")) return urlObj.searchParams.get("v");
        } catch (e) { /* Ignora URLs inválidas */ }
        return null;
    };

    // Função para renderizar o carrossel
    const renderCarousel = () => {
        clearInterval(carouselInterval);
        carouselContainer.innerHTML = ''; 

        if (videos.length === 0) {
            carouselContainer.innerHTML = placeholderHtml;
            return;
        }

        videos.forEach((url, index) => {
            const videoId = getYouTubeID(url);
            if (videoId) {
                const slide = document.createElement('div');
                slide.className = 'carousel-slide';
                const iframeSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0`;
                slide.innerHTML = `<iframe src="${iframeSrc}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
                carouselContainer.appendChild(slide);
            }
        });
        
        // Exibe o slide correto e inicia o timer
        showSlide(currentIndex);
        startCarousel();
    };
    
    // Função para mostrar o slide correto
    const showSlide = (index) => {
        const slides = document.querySelectorAll('.carousel-slide');
        if (slides[index]) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
        }
    };

    // Função para iniciar ou reiniciar o ciclo do carrossel
    const startCarousel = () => {
        clearInterval(carouselInterval); // Limpa o timer anterior
        const slides = document.querySelectorAll('.carousel-slide');
        if (slides.length > 1) {
            carouselInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                showSlide(currentIndex);
                localStorage.setItem(indexKey, currentIndex); // Sincroniza o índice
            }, 15000);
        }
    };
    
    // Função principal para carregar e atualizar
    const loadAndRender = () => {
        const storedVideos = localStorage.getItem(listKey);
        videos = storedVideos ? JSON.parse(storedVideos) : [];
        // Carrega o índice salvo ou começa do zero
        currentIndex = parseInt(localStorage.getItem(indexKey)) || 0;
        renderCarousel();
    };

    // Ouve por mudanças no localStorage feitas por outras abas
    window.addEventListener('storage', (event) => {
        // Se a lista de vídeos mudar, recarrega tudo
        if (event.key === listKey) {
            console.log('Lista de vídeos atualizada. Recarregando...');
            loadAndRender();
        }
        // Se apenas o índice mudar, só troca o slide
        if (event.key === indexKey) {
            console.log('Índice do vídeo atualizado.');
            const newIndex = parseInt(event.newValue) || 0;
            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                showSlide(currentIndex);
                // Reinicia o timer para dar tempo ao novo vídeo
                startCarousel(); 
            }
        }
    });

    // Carga inicial
    loadAndRender();
});