// Script para el e-book devocional Mujer Virtuosa

document.addEventListener('DOMContentLoaded', function() {
    // Animación suave para elementos al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar todas las páginas
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.opacity = '0';
        page.style.transform = 'translateY(30px)';
        page.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(page);
    });

    // Funcionalidad para las líneas de anotaciones (hacer clickeable para escribir)
    const lines = document.querySelectorAll('.line');
    lines.forEach(line => {
        line.addEventListener('click', function() {
            // Crear un input temporal para simular escritura
            const input = document.createElement('input');
            input.type = 'text';
            input.style.width = '100%';
            input.style.border = 'none';
            input.style.borderBottom = '1px solid #a5c4a5';
            input.style.background = 'transparent';
            input.style.fontFamily = 'Georgia, serif';
            input.style.fontSize = '1rem';
            input.style.color = '#5a5a5a';
            input.style.outline = 'none';
            input.placeholder = 'Escribe aquí tus pensamientos...';
            
            // Reemplazar la línea con el input
            line.style.display = 'none';
            line.parentNode.insertBefore(input, line);
            input.focus();
            
            // Volver a la línea cuando se pierde el foco
            input.addEventListener('blur', function() {
                if (input.value.trim() !== '') {
                    // Si hay texto, crear un span con el texto
                    const textSpan = document.createElement('span');
                    textSpan.textContent = input.value;
                    textSpan.style.fontFamily = 'Georgia, serif';
                    textSpan.style.fontSize = '1rem';
                    textSpan.style.color = '#5a5a5a';
                    textSpan.style.borderBottom = '1px solid #a5c4a5';
                    textSpan.style.display = 'block';
                    textSpan.style.paddingBottom = '5px';
                    textSpan.style.cursor = 'pointer';
                    
                    // Permitir editar al hacer click en el texto
                    textSpan.addEventListener('click', function() {
                        const newInput = document.createElement('input');
                        newInput.type = 'text';
                        newInput.value = textSpan.textContent;
                        newInput.style.width = '100%';
                        newInput.style.border = 'none';
                        newInput.style.borderBottom = '1px solid #a5c4a5';
                        newInput.style.background = 'transparent';
                        newInput.style.fontFamily = 'Georgia, serif';
                        newInput.style.fontSize = '1rem';
                        newInput.style.color = '#5a5a5a';
                        newInput.style.outline = 'none';
                        
                        textSpan.parentNode.insertBefore(newInput, textSpan);
                        textSpan.remove();
                        newInput.focus();
                        
                        newInput.addEventListener('blur', function() {
                            if (newInput.value.trim() !== '') {
                                textSpan.textContent = newInput.value;
                                newInput.parentNode.insertBefore(textSpan, newInput);
                            } else {
                                newInput.parentNode.insertBefore(line, newInput);
                                line.style.display = 'block';
                            }
                            newInput.remove();
                        });
                    });
                    
                    input.parentNode.insertBefore(textSpan, input);
                } else {
                    line.style.display = 'block';
                }
                input.remove();
            });
            
            // También manejar Enter
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    input.blur();
                }
            });
        });
    });

    // Efecto de hover en elementos interactivos
    const interactiveElements = document.querySelectorAll('.handwritten-note, .bible-reading, .daily-message');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Navegación suave entre páginas (si se implementa navegación)
    function smoothScrollTo(targetId) {
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Función para imprimir página específica
    function printPage(pageId) {
        const page = document.getElementById(pageId);
        if (page) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Mujer Virtuosa - ${pageId}</title>
                    <link rel="stylesheet" href="css/styles.css">
                </head>
                <body>
                    ${page.outerHTML}
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    }

    // Hacer las funciones disponibles globalmente
    window.smoothScrollTo = smoothScrollTo;
    window.printPage = printPage;

    // Mensaje de bienvenida en consola
    console.log('📖 Mujer Virtuosa: 365 Propósitos de Dios para tu vida');
    console.log('✨ E-book devocional cargado correctamente');
});

// Función para guardar progreso en localStorage
function saveProgress(day, notes) {
    const progress = JSON.parse(localStorage.getItem('mujerVirtuosaProgress') || '{}');
    progress[day] = notes;
    localStorage.setItem('mujerVirtuosaProgress', JSON.stringify(progress));
}

// Función para cargar progreso desde localStorage
function loadProgress() {
    const progress = JSON.parse(localStorage.getItem('mujerVirtuosaProgress') || '{}');
    return progress;
}

// Función para exportar notas como texto
function exportNotes() {
    const progress = loadProgress();
    let exportText = 'Mis Notas - Mujer Virtuosa: 365 Propósitos de Dios\n';
    exportText += '='.repeat(50) + '\n\n';
    
    for (const [day, notes] of Object.entries(progress)) {
        exportText += `Día ${day}:\n`;
        exportText += notes + '\n\n';
    }
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mis-notas-mujer-virtuosa.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


// Funcionalidade para seguimiento de hábitos múltiples
document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidad para hábitos múltiples
    const habitInputs = document.querySelectorAll('.habit-text-input');
    const dayMinis = document.querySelectorAll('.day-mini');

    // Cargar datos guardados para inputs de hábitos
    habitInputs.forEach(input => {
        const habitNumber = input.dataset.habit;
        const savedText = localStorage.getItem(`habit-text-${habitNumber}`);
        if (savedText) {
            input.value = savedText;
        }

        // Guardar texto del hábito
        input.addEventListener('input', function() {
            localStorage.setItem(`habit-text-${habitNumber}`, this.value);
        });
        
        input.addEventListener('blur', function() {
            localStorage.setItem(`habit-text-${habitNumber}`, this.value);
        });
    });

    // Funcionalidad para marcar días completados
    dayMinis.forEach(day => {
        const dayNumber = day.dataset.day;
        const habitNumber = day.dataset.habit;
        const storageKey = `habit-${habitNumber}-day-${dayNumber}`;
        
        // Cargar estado guardado
        if (localStorage.getItem(storageKey) === 'completed') {
            day.classList.add('completed');
        }

        // Toggle completado al hacer clic
        day.addEventListener('click', function() {
            this.classList.toggle('completed');
            
            if (this.classList.contains('completed')) {
                localStorage.setItem(storageKey, 'completed');
            } else {
                localStorage.removeItem(storageKey);
            }
        });
    });
    
    // Spiritual assessment functionality (mantener funcionalidad existente)
    const segments = document.querySelectorAll('.segment');
    
    segments.forEach(segment => {
        segment.addEventListener('click', function() {
            const category = this.closest('.category');
            const categoryLabel = category.querySelector('label').textContent;
            const value = parseInt(this.getAttribute('data-value'));
            const allSegments = category.querySelectorAll('.segment');
            
            // Clear all segments in this category
            allSegments.forEach(seg => seg.classList.remove('filled'));
            
            // Fill segments up to clicked value
            for (let i = 0; i < value; i++) {
                allSegments[i].classList.add('filled');
            }
            
            // Save state to localStorage
            localStorage.setItem(`assessment-${categoryLabel}`, value);
        });
        
        // Load saved state
        const category = segment.closest('.category');
        if (category) {
            const categoryLabel = category.querySelector('label').textContent;
            const savedValue = localStorage.getItem(`assessment-${categoryLabel}`);
            
            if (savedValue) {
                const value = parseInt(savedValue);
                const allSegments = category.querySelectorAll('.segment');
                
                for (let i = 0; i < value; i++) {
                    allSegments[i].classList.add('filled');
                }
            }
        }
    });
});



// Funções de navegação para o índice
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Navegação suave para todos os links do índice
document.addEventListener('DOMContentLoaded', function() {
    // Manejar todos os links de navegação
    const indexLinks = document.querySelectorAll('.index-link, .day-link');
    
    indexLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Adicionar efeito de hover aos links do índice
    const dayLinks = document.querySelectorAll('.day-link');
    dayLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Botão flutuante para voltar ao índice
    createFloatingIndexButton();
});

// Criar botão flutuante para voltar ao índice
function createFloatingIndexButton() {
    const floatingButton = document.createElement('div');
    floatingButton.className = 'floating-index-button';
    floatingButton.innerHTML = `
        <span class="floating-icon">📑</span>
        <span class="floating-text">Índice</span>
    `;
    
    floatingButton.addEventListener('click', function() {
        scrollToSection('indice');
    });
    
    document.body.appendChild(floatingButton);
    
    // Mostrar/ocultar botão baseado no scroll
    window.addEventListener('scroll', function() {
        const indexSection = document.getElementById('indice');
        if (indexSection) {
            const indexRect = indexSection.getBoundingClientRect();
            const isIndexVisible = indexRect.top < window.innerHeight && indexRect.bottom > 0;
            
            if (isIndexVisible) {
                floatingButton.style.opacity = '0';
                floatingButton.style.pointerEvents = 'none';
            } else {
                floatingButton.style.opacity = '1';
                floatingButton.style.pointerEvents = 'auto';
            }
        }
    });
}

// Adicionar estilos para o botão flutuante via JavaScript
const floatingButtonStyles = `
.floating-index-button {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: linear-gradient(135deg, var(--accent-sage), var(--accent-lavender));
    color: white;
    padding: 15px 20px;
    border-radius: 50px;
    cursor: pointer;
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: Georgia, serif;
    font-size: 0.9rem;
    font-weight: 500;
    opacity: 0;
    pointer-events: none;
}

.floating-index-button:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 12px 35px rgba(0,0,0,0.25);
}

.floating-icon {
    font-size: 1.2rem;
}

.floating-text {
    font-size: 0.9rem;
}

@media (max-width: 768px) {
    .floating-index-button {
        bottom: 20px;
        right: 20px;
        padding: 12px 16px;
    }
    
    .floating-text {
        display: none;
    }
}
`;

// Adicionar estilos ao head
const styleSheet = document.createElement('style');
styleSheet.textContent = floatingButtonStyles;
document.head.appendChild(styleSheet);


// Funcionalidades PWA Avançadas

// Notificações Push para recordatorios diários
class DevotionalNotifications {
    constructor() {
        this.permission = 'default';
        this.init();
    }

    async init() {
        if ('Notification' in window) {
            this.permission = await Notification.requestPermission();
        }
    }

    async scheduleDaily() {
        if (this.permission === 'granted' && 'serviceWorker' in navigator) {
            // Programar notificação diária às 7:00 AM
            const registration = await navigator.serviceWorker.ready;
            
            // Calcular próximo 7:00 AM
            const now = new Date();
            const tomorrow7AM = new Date();
            tomorrow7AM.setHours(7, 0, 0, 0);
            
            if (now.getHours() >= 7) {
                tomorrow7AM.setDate(tomorrow7AM.getDate() + 1);
            }
            
            const delay = tomorrow7AM.getTime() - now.getTime();
            
            setTimeout(() => {
                this.showDailyReminder();
                // Programar para o próximo dia
                setInterval(() => {
                    this.showDailyReminder();
                }, 24 * 60 * 60 * 1000); // 24 horas
            }, delay);
        }
    }

    showDailyReminder() {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification('Mujer Virtuosa 🙏', {
                    body: `Es hora de tu devocional del día ${dayOfYear}`,
                    icon: '/icons/icon-192x192.png',
                    badge: '/icons/icon-72x72.png',
                    vibrate: [100, 50, 100],
                    data: {
                        url: `/#dia-${Math.min(dayOfYear, 7)}` // Limitado a los 7 días disponibles
                    },
                    actions: [
                        {
                            action: 'read',
                            title: 'Leer Ahora',
                            icon: '/icons/icon-96x96.png'
                        },
                        {
                            action: 'later',
                            title: 'Más Tarde',
                            icon: '/icons/icon-96x96.png'
                        }
                    ]
                });
            });
        }
    }

    async enableNotifications() {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            this.permission = 'granted';
            this.scheduleDaily();
            this.showConfirmation('¡Notificaciones activadas! Te recordaremos cada día a las 7:00 AM 🙏');
        } else {
            this.showConfirmation('Las notificaciones están desactivadas. Puedes activarlas desde la configuración del navegador.');
        }
    }

    showConfirmation(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--accent-sage), var(--accent-lavender));
            color: white;
            padding: 15px 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10001;
            text-align: center;
            font-family: Georgia, serif;
            animation: slideDown 0.5s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }
}

// Sincronização offline
class OfflineSync {
    constructor() {
        this.syncData = this.loadSyncData();
        this.init();
    }

    init() {
        // Detectar quando volta online
        window.addEventListener('online', () => {
            this.syncWhenOnline();
        });

        // Salvar dados periodicamente
        setInterval(() => {
            this.saveProgress();
        }, 30000); // A cada 30 segundos
    }

    loadSyncData() {
        return JSON.parse(localStorage.getItem('devotional-sync-data') || '{}');
    }

    saveSyncData() {
        localStorage.setItem('devotional-sync-data', JSON.stringify(this.syncData));
    }

    saveProgress() {
        // Coletar todos os dados do usuário
        const userData = {
            habits: {},
            assessments: {},
            notes: {},
            lastSync: Date.now()
        };

        // Coletar dados de hábitos
        for (let i = 1; i <= 3; i++) {
            const habitText = localStorage.getItem(`habit-text-${i}`);
            if (habitText) {
                userData.habits[`habit-${i}`] = {
                    text: habitText,
                    days: {}
                };

                // Coletar dias completados
                for (let day = 1; day <= 31; day++) {
                    const completed = localStorage.getItem(`habit-${i}-day-${day}`);
                    if (completed) {
                        userData.habits[`habit-${i}`].days[day] = completed;
                    }
                }
            }
        }

        // Coletar avaliações espirituais
        ['FE', 'DISPOSICIÓN', 'AMOR PROPIO', 'EQUILIBRIO EMOCIONAL'].forEach(category => {
            const value = localStorage.getItem(`assessment-${category}`);
            if (value) {
                userData.assessments[category] = parseInt(value);
            }
        });

        this.syncData = userData;
        this.saveSyncData();
    }

    async syncWhenOnline() {
        if (navigator.onLine && Object.keys(this.syncData).length > 0) {
            console.log('Sincronizando dados...', this.syncData);
            // Aqui você poderia enviar para um servidor
            // await this.sendToServer(this.syncData);
            
            this.showSyncConfirmation('Datos sincronizados correctamente ✅');
        }
    }

    showSyncConfirmation(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: var(--accent-sage);
            color: white;
            padding: 10px 15px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10001;
            font-family: Georgia, serif;
            font-size: 0.9rem;
            animation: slideUp 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// Detecção de instalação e configuração
class PWAManager {
    constructor() {
        this.isInstalled = this.checkIfInstalled();
        this.notifications = new DevotionalNotifications();
        this.offlineSync = new OfflineSync();
        this.init();
    }

    init() {
        // Adicionar botão de notificações se a app estiver instalada
        if (this.isInstalled) {
            this.addNotificationButton();
        }

        // Detectar modo standalone (instalado)
        if (window.matchMedia('(display-mode: standalone)').matches) {
            document.body.classList.add('pwa-installed');
            this.addPWAStyles();
        }
    }

    checkIfInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true;
    }

    addNotificationButton() {
        const notificationBtn = document.createElement('button');
        notificationBtn.innerHTML = `
            <span style="margin-right: 8px;">🔔</span>
            <span>Recordatorios Diarios</span>
        `;
        notificationBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--accent-sage), var(--accent-lavender));
            color: white;
            border: none;
            padding: 12px 18px;
            border-radius: 25px;
            cursor: pointer;
            font-family: Georgia, serif;
            font-size: 0.9rem;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            transition: all 0.3s ease;
        `;

        notificationBtn.addEventListener('click', () => {
            this.notifications.enableNotifications();
        });

        notificationBtn.addEventListener('mouseenter', () => {
            notificationBtn.style.transform = 'translateY(-2px) scale(1.05)';
        });

        notificationBtn.addEventListener('mouseleave', () => {
            notificationBtn.style.transform = 'translateY(0) scale(1)';
        });

        document.body.appendChild(notificationBtn);
    }

    addPWAStyles() {
        const pwaStyles = document.createElement('style');
        pwaStyles.textContent = `
            .pwa-installed .ebook-container {
                margin-top: 20px;
            }
            
            .pwa-installed .floating-index-button {
                bottom: 40px;
            }
            
            @media (max-width: 768px) {
                .pwa-installed .ebook-container {
                    margin-top: 10px;
                }
            }
        `;
        document.head.appendChild(pwaStyles);
    }
}

// Inicializar PWA Manager quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const pwaManager = new PWAManager();
    
    // Adicionar informações de debug no console
    console.log('🙏 Mujer Virtuosa PWA inicializada');
    console.log('📱 Instalada:', pwaManager.isInstalled);
    console.log('🔔 Notificações:', pwaManager.notifications.permission);
    console.log('📡 Online:', navigator.onLine);
});

// Adicionar suporte a gestos touch para navegação
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - próxima página
            navigateNext();
        } else {
            // Swipe right - página anterior
            navigatePrevious();
        }
    }
}

function navigateNext() {
    // Implementar navegação para próxima página
    const currentUrl = window.location.hash;
    // Lógica de navegação baseada na página atual
}

function navigatePrevious() {
    // Implementar navegação para página anterior
    const currentUrl = window.location.hash;
    // Lógica de navegação baseada na página atual
}

