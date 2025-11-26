(async () => {

    await loadStarsPreset(tsParticles);
        await tsParticles.load({
            id: "tsparticles",
            options: {
                preset: "stars",
                fullScreen: { enable: true, zIndex: -1 },
                background: {
                    color: { value: "#000000" }
                },

                parallax: {
                    enable: true, // Abilita l'effetto
                    force: 6,     // Forza della reazione (più è alto, più si muove)
                    smooth: 50    // Fluidità del movimento (più è alto, più è lento e liscio)
                },

                // ✨ INIZIO SOVRASCRITTURE PER MIGLIORAMENTO ✨
                particles: {
                    // 1. Varietà di Colore (stelle più "calde" o "fredde")
                    color: {
                        value: ["#ffffff", "#f5f3e6", "#b0c4de", "#ffd700"] // Bianco, crema, blu chiaro, giallo oro
                    },
                    // 2. Profondità e dimensione
                    size: {
                        value: { min: 0.5, max: 2.5 }, // Più varietà di dimensione
                        random: true,
                        anim: {
                            enable: false
                        }
                    },
                    // 3. Movimento Migliorato (Simulazione Warp o Parallasse Veloce)
                    move: {
                        enable: true,
                        speed: { min: 0.5, max: 2 }, // Varia la velocità
                        direction: "none",
                        random: true,
                        straight: false, // Movimento curvo o casuale
                        outMode: "out"
                    },
                    // 4. Opacità (Effetto scintillio)
                    opacity: {
                        value: { min: 0.6, max: 1 },
                        anim: {
                            enable: true,
                            speed: 0.5,
                            opacity_min: 0.1,
                            sync: false
                        }
                    },
                    // 5. Interattività (Opzionale: reazione leggera al mouse)
                    interactivity: {
                        events: {
                            onHover: {
                                enable: true,
                                mode: "bubble" // Le stelle si ingrandiscono leggermente se passi il mouse
                            }
                        },
                        modes: {
                            bubble: {
                                distance: 150,
                                duration: 2,
                                size: 5,
                                opacity: 0.8
                            }
                        }
                    }
                }                
            }
        });
})();