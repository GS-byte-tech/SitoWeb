document.addEventListener('DOMContentLoaded', () => {
    
    // Riferimenti DOM
    const loaderOverlay = document.getElementById('loader-overlay');
    const maskCanvas = document.getElementById('revealMask');
    const maskCtx = maskCanvas.getContext('2d');
    const loadingPercentage = document.getElementById('loading-percentage');
    const circularLoader = document.getElementById('circular-loader'); 

    // Configurazione iniziale
    maskCanvas.width = window.innerWidth;
    maskCanvas.height = window.innerHeight;
    maskCtx.fillStyle = '#000000';
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    // --- VARIABILI DI CONTROLLO ---
    let animationFrameId; 
    let assetsLoaded = false; // Indica se window.load è stato attivato
    let startTime = Date.now();
    const MIN_DISPLAY_TIME = 500; // Tempo fittizio lungo (10s) per la simulazione 0-40%

    // Funzione di controllo centrale
    function checkAndReveal() {
        if (assetsLoaded) {
            // Forziamo il 40% e interrompiamo l'animazione FASE 1
            const elapsedTime = Date.now() - startTime;
            const delay = Math.max(0, MIN_DISPLAY_TIME - elapsedTime);

            setTimeout(() => {
                cancelAnimationFrame(animationFrameId); 
                circularLoader.style.setProperty('--progress', '40%');
                loadingPercentage.textContent = '40%';
                startReveal();
            }, delay);
        }
    }

    // CARICAMENTO HYPERSPACE
    (async () => {
        await loadHyperspacePreset(tsParticles);
        await tsParticles.load({
            id: "starfallCanvas",
            options: {
                preset: "hyperspace", 
                fullScreen: { enable: false }, 
                background: { color: { value: "#000000" } }
            }
        });
        
        animateInitialLoad();
    })();

    // FASE 1: Animazione 0% -> 40% (Simulazione)
    function animateInitialLoad() {
        const elapsed = Date.now() - startTime;
        
        // Calcola il progresso su un tempo molto lungo, in modo che non raggiunga il 40% da solo.
        const progressRatio = Math.min(elapsed / MIN_DISPLAY_TIME, 1);
        const progressValue = progressRatio * 40; 
        
        circularLoader.style.setProperty('--progress', progressValue + '%'); 
        loadingPercentage.textContent = Math.round(progressValue) + '%';
        
        animationFrameId = requestAnimationFrame(animateInitialLoad);
    }
    
    // FASE 2: Animazione 40% -> 100% (Rivelazione)
    function startReveal() {
        if (loaderOverlay.classList.contains('revealing')) return;
        loaderOverlay.classList.add('revealing');

        const loaderMessage = document.querySelector('.loader-message');
        if (loaderMessage) loaderMessage.style.display = 'none';
        
        let revealProgress = 0.4; 

        function animateReveal() {
            maskCtx.globalCompositeOperation = 'destination-out'; 
            const revealRadius = revealProgress * Math.max(maskCanvas.width, maskCanvas.height) * 0.8; 
            
            maskCtx.beginPath();
            const gradient = maskCtx.createRadialGradient(maskCanvas.width / 2, maskCanvas.height / 2, revealRadius * 0.1, maskCanvas.width / 2, maskCanvas.height / 2, revealRadius);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); 
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); 

            maskCtx.fillStyle = gradient;
            maskCtx.arc(maskCanvas.width / 2, maskCanvas.height / 2, revealRadius, 0, Math.PI * 2);
            maskCtx.fill();

            revealProgress += 0.015;

            const totalProgress = Math.min(revealProgress * 100 / 1.5, 100);
            circularLoader.style.setProperty('--progress', totalProgress + '%');
            loadingPercentage.textContent = Math.round(totalProgress) + '%';


            if (revealProgress >= 1.5) { 
                cancelAnimationFrame(animationFrameId);
                
                restartAnimations(); 
                
                document.body.classList.add('loaded-page'); 
                loaderOverlay.style.pointerEvents = 'none';
            } else {
                animationFrameId = requestAnimationFrame(animateReveal);
            }  
        }

        animationFrameId = requestAnimationFrame(animateReveal);
    }
    
    // Funzione per forzare il riavvio delle animazioni (dal punto precedente)
    function restartAnimations() {
        const elements = document.querySelectorAll(
            '.div_intestazione, .div_video_presentazione, nav'
        );

        elements.forEach(el => {
            const computedStyle = window.getComputedStyle(el);
            const animationValue = computedStyle.animation;

            if (!animationValue || animationValue.includes('none')) return; 

            el.style.animation = 'none';
            el.style.animation = animationValue;
        });
        
        
        const videoElement = document.querySelector('.div_video_presentazione .video');
        if (videoElement) {
            const computedStyle = window.getComputedStyle(videoElement);
            const animationValue = computedStyle.animation;
            
            if (!animationValue || animationValue.includes('none')) return;

            videoElement.style.animation = 'none';
            void videoElement.offsetWidth;
            videoElement.style.animation = animationValue;
        }
    }
    
    // --- IL PUNTO CRUCIALE: RILEVAZIONE DEL CARICAMENTO EFFETTIVO ---
    window.addEventListener('load', () => {
        assetsLoaded = true;
        checkAndReveal();
    });
});