function debounce(func, delay) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    // Riferimenti agli elementi DOM
    const wrapper = document.querySelector('.horizontal-scroll-wrapper');
    const stickyContainer = document.querySelector('.horizontal-scroll-container');
    
    // Controlla se gli elementi necessari sono presenti
    if (!wrapper || !stickyContainer) {
        // console.warn("Elementi di scrolling orizzontale non trovati.");
        return; 
    }

    // ✨ Inizializzazione Swiper.js ✨
    const swiper = new Swiper(".mySwiper", {
        effect: "coverflow",
        centeredSlides: true,
        slidesPerView: 1, 
        loop: false, 
        allowTouchMove: false, 
        
        coverflowEffect: {
            rotate: 95, 
            stretch: 0, 
            depth: 500, 
            modifier: 1,
            slideShadows: true,
        },
    });

    let numSlides = swiper.slides.length;
    let wrapperStart = 0;
    let maxScrollDistance = 1; // Previene divisione per zero

    // Funzione per calcolare/ricalcolare le metriche del layout
    const updateMetrics = () => {
        wrapperStart = wrapper.offsetTop; 
        // offsetHeight è l'altezza totale (300vh), window.innerHeight è l'altezza viewport (100vh)
        maxScrollDistance = wrapper.offsetHeight - window.innerHeight; 
        
        // Assicura che maxScrollDistance sia almeno 1
        if (maxScrollDistance <= 0) {
            maxScrollDistance = 1; 
        }
    };
    
    // Inizializza le metriche all'avvio
    updateMetrics();

    // 2. Logica di Mappatura dello Scorrimento ottimizzata con RAF
    let isTicking = false;
    let lastScrollY = window.scrollY;

    const mapScrollToSwiper = () => {
        const currentScroll = lastScrollY;
        
        // Calcola la distanza di scroll all'interno del wrapper
        let scrollInsideWrapper = currentScroll - wrapperStart;
        
        // Limita l'intervallo tra 0 e maxScrollDistance
        scrollInsideWrapper = Math.max(0, Math.min(scrollInsideWrapper, maxScrollDistance));
        
        // Calcola il progresso (da 0 a 1)
        const scrollProgress = scrollInsideWrapper / maxScrollDistance; 
        
        // Mappa il progresso all'indice della slide
        const targetSlideIndex = Math.round(scrollProgress * (numSlides - 1));
        
        // Aggiorna l'indice di Swiper solo se è necessario
        if (swiper.activeIndex !== targetSlideIndex) {
            // Usa swiper.slideTo con tempo di transizione 0 per cambio immediato
            swiper.slideTo(targetSlideIndex, 0); 
        }
        
        isTicking = false;
    };

    const handleScroll = () => {
        lastScrollY = window.scrollY;

        if (!isTicking) {
            window.requestAnimationFrame(mapScrollToSwiper);
            isTicking = true;
        }
    };

    window.addEventListener('scroll', handleScroll); 
        
    // 3. Gestione del Ridimensionamento
    // Ricalcola le metriche e aggiorna la slide in caso di ridimensionamento della finestra
    const handleResize = debounce(() => {
        updateMetrics();
        // Forziamo un aggiornamento immediato della slide dopo il ridimensionamento
        mapScrollToSwiper(); 
    }, 150); // Debounce di 150ms

    window.addEventListener('resize', handleResize);

    // 4. Abilitare la rotellina del mouse solo sul blocco sticky (funzionalità mantenuta)
    // Questo permette di scorrere la pagina verticalmente quando il mouse è sopra il carosello sticky.
    stickyContainer.addEventListener('wheel', (event) => {
        event.preventDefault(); 
        window.scrollBy(0, event.deltaY > 0 ? 50 : -50);
    });
});