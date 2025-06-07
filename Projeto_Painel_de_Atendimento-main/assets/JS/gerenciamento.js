document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add-video-btn');
    const urlInput = document.getElementById('video-url-input');
    const videoListUl = document.getElementById('video-list');
    // NOVO: Referência aos botões de navegação
    const prevBtn = document.getElementById('prev-video-btn');
    const nextBtn = document.getElementById('next-video-btn');
    
    // NOVO: Chaves para o localStorage
    const listKey = 'videoCarouselList';
    const indexKey = 'videoCarouselIndex';

    // Função para renderizar a lista de vídeos no painel de controle
    const renderControlList = () => {
        const videos = JSON.parse(localStorage.getItem(listKey)) || [];
        
        videoListUl.innerHTML = '';

        if (videos.length === 0) {
            videoListUl.innerHTML = '<li>Nenhum vídeo na lista.</li>';
            return;
        }
        
        videos.forEach((url, index) => {
            const li = document.createElement('li');
            const textSpan = document.createElement('span');
            textSpan.textContent = url;
            li.appendChild(textSpan);
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remover';
            removeBtn.className = 'remove-btn';
            removeBtn.onclick = () => removeVideo(index);
            li.appendChild(removeBtn);
            videoListUl.appendChild(li);
        });
    };

    // Função para adicionar um vídeo
    const addVideo = () => {
        const newUrl = urlInput.value.trim();
        if (newUrl) {
            const videos = JSON.parse(localStorage.getItem(listKey)) || [];
            videos.push(newUrl);
            localStorage.setItem(listKey, JSON.stringify(videos));
            urlInput.value = '';
            renderControlList();
        }
    };

    // Função para remover um vídeo
    const removeVideo = (indexToRemove) => {
        const videos = JSON.parse(localStorage.getItem(listKey)) || [];
        videos.splice(indexToRemove, 1);
        localStorage.setItem(listKey, JSON.stringify(videos));
        // Ao remover, reseta o índice para o primeiro vídeo
        localStorage.setItem(indexKey, '0'); 
        renderControlList();
    };

    // NOVO: Função para navegar entre os vídeos
    const navigate = (direction) => {
        const videos = JSON.parse(localStorage.getItem(listKey)) || [];
        if (videos.length < 2) return; // Não faz nada se tiver menos de 2 vídeos

        let currentIndex = parseInt(localStorage.getItem(indexKey)) || 0;

        if (direction === 'next') {
            currentIndex = (currentIndex + 1) % videos.length;
        } else if (direction === 'prev') {
            currentIndex = (currentIndex - 1 + videos.length) % videos.length;
        }

        // Salva o novo índice no localStorage para o carrossel "ouvir"
        localStorage.setItem(indexKey, currentIndex);
    };

    // Adiciona evento de clique aos botões
    addBtn.addEventListener('click', addVideo);
    urlInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') addVideo();
    });
    // NOVO: Adiciona eventos aos botões de navegação
    prevBtn.addEventListener('click', () => navigate('prev'));
    nextBtn.addEventListener('click', () => navigate('next'));

    // Carga inicial
    renderControlList();
});