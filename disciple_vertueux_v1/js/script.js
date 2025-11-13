// Cores para cada mês
const monthColors = {
    1: '#FFE5E5',   // Janvier - Rosa claro
    2: '#FFE5F0',   // Février - Rosa más claro
    3: '#E5F0FF',   // Mars - Azul claro
    4: '#E5FFE5',   // Avril - Verde claro
    5: '#FFFFE5',   // Mai - Amarillo claro
    6: '#FFE5CC',   // Juin - Naranja claro
    7: '#FFE5E5',   // Juillet - Rosa claro
    8: '#FFE5CC',   // Août - Naranja claro
    9: '#FFFFE5',   // Septembre - Amarillo claro
    10: '#E5FFE5',  // Octobre - Verde claro
    11: '#E5F0FF',  // Novembre - Azul claro
    12: '#FFE5F0'   // Décembre - Rosa más claro
};

const monthNames = {
    1: 'Janvier', 2: 'Février', 3: 'Mars', 4: 'Avril', 5: 'Mai', 6: 'Juin',
    7: 'Juillet', 8: 'Août', 9: 'Septembre', 10: 'Octobre', 11: 'Novembre', 12: 'Décembre'
};

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funcionalidad de anotaciones
    initializeNotes();
    
    // Inicializar colores de fechas
    initializeDateColors();
    
    // Inicializar filtro de meses
    initializeMonthFilter();
    
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

    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.opacity = '0';
        page.style.transform = 'translateY(30px)';
        page.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(page);
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

    // Navegación suave entre páginas
    function smoothScrollTo(targetId) {
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    window.smoothScrollTo = smoothScrollTo;
    window.scrollToSection = scrollToSection;

    console.log('📖 Disciple Vertueux: 365 Propósitos de Dios para tu vida');
    console.log('✨ E-book devocional cargado correctamente');
});

// Inicializar funcionalidad de anotaciones
function initializeNotes() {
    const notesSpaces = document.querySelectorAll('.notes-space');
    
    notesSpaces.forEach(notesSpace => {
        const dailyPage = notesSpace.closest('.daily-page');
        if (!dailyPage) return;
        
        const pageId = dailyPage.id;
        const storageKey = `notes-${pageId}`;
        
        // Crear textarea funcional
        const textarea = document.createElement('textarea');
        textarea.className = 'notes-textarea';
        textarea.placeholder = 'Écrivez vos notes ici...';
        textarea.style.cssText = `
            width: 100%;
            min-height: 200px;
            padding: 10px;
            border: 1px solid #d4a5a5;
            border-radius: 4px;
            font-family: Georgia, serif;
            font-size: 1rem;
            color: #5a5a5a;
            resize: vertical;
            background-color: rgba(255, 255, 255, 0.7);
        `;
        
        // Cargar notas guardadas
        const savedNotes = localStorage.getItem(storageKey);
        if (savedNotes) {
            textarea.value = savedNotes;
        }
        
        // Guardar notas al escribir
        textarea.addEventListener('input', function() {
            localStorage.setItem(storageKey, this.value);
        });
        
        // Reemplazar el contenido de notes-space con el textarea
        notesSpace.innerHTML = '';
        notesSpace.appendChild(textarea);
    });
}

// Inicializar colores de fechas
function initializeDateColors() {
    const dateSquares = document.querySelectorAll('.date-square');
    
    dateSquares.forEach(dateSquare => {
        const dayDate = dateSquare.querySelector('.day-date');
        if (!dayDate) return;
        
        const dateText = dayDate.textContent;
        // Extraer el mes del texto de la fecha (ej: "1 de Janvier")
        const monthMatch = dateText.match(/de ([A-Za-z]+)/);
        if (monthMatch) {
            const monthName = monthMatch[1];
            // Encontrar el número del mes
            for (let i = 1; i <= 12; i++) {
                if (monthNames[i].toLowerCase() === monthName.toLowerCase()) {
                    dateSquare.style.backgroundColor = monthColors[i];
                    break;
                }
            }
        }
    });
}

// Inicializar filtro de meses
function initializeMonthFilter() {
    // Crear contenedor del filtro si no existe
    let filterContainer = document.getElementById('month-filter');
    if (!filterContainer) {
        filterContainer = document.createElement('div');
        filterContainer.id = 'month-filter';
        filterContainer.style.cssText = `
            position: sticky;
            top: 0;
            background-color: white;
            padding: 15px;
            border-bottom: 2px solid #d4a5a5;
            z-index: 100;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            justify-content: center;
        `;
        
        // Crear botones para cada mes
        const allButton = document.createElement('button');
        allButton.textContent = 'Tous les mois';
        allButton.className = 'month-button active';
        allButton.style.cssText = `
            padding: 8px 15px;
            border: 2px solid #d4a5a5;
            background-color: #d4a5a5;
            color: white;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        `;
        allButton.addEventListener('click', function() {
            showAllDays();
            updateActiveButton(this);
        });
        filterContainer.appendChild(allButton);
        
        for (let i = 1; i <= 12; i++) {
            const button = document.createElement('button');
            button.textContent = monthNames[i];
            button.className = 'month-button';
            button.dataset.month = i;
            button.style.cssText = `
                padding: 8px 15px;
                border: 2px solid ${monthColors[i]};
                background-color: ${monthColors[i]};
                color: #333;
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.3s ease;
            `;
            button.addEventListener('click', function() {
                filterDaysByMonth(i);
                updateActiveButton(this);
            });
            filterContainer.appendChild(button);
        }
        
        // Insertar el filtro al inicio del contenedor principal
        const mainContainer = document.querySelector('.main-container');
        if (mainContainer) {
            mainContainer.insertBefore(filterContainer, mainContainer.firstChild);
        } else {
            document.body.insertBefore(filterContainer, document.body.firstChild);
        }
    }
}

// Mostrar todos los días
function showAllDays() {
    const dailyPages = document.querySelectorAll('.daily-page');
    dailyPages.forEach(page => {
        page.style.display = 'block';
    });
}

// Filtrar días por mes
function filterDaysByMonth(month) {
    const dailyPages = document.querySelectorAll('.daily-page');
    dailyPages.forEach(page => {
        const dayDate = page.querySelector('.day-date');
        if (dayDate) {
            const dateText = dayDate.textContent;
            const monthMatch = dateText.match(/de ([A-Za-z]+)/);
            if (monthMatch) {
                const monthName = monthMatch[1];
                const isCurrentMonth = monthNames[month].toLowerCase() === monthName.toLowerCase();
                page.style.display = isCurrentMonth ? 'block' : 'none';
            }
        }
    });
}

// Actualizar botón activo
function updateActiveButton(activeButton) {
    const buttons = document.querySelectorAll('.month-button');
    buttons.forEach(btn => {
        btn.style.opacity = '0.6';
        btn.style.transform = 'scale(0.95)';
    });
    activeButton.style.opacity = '1';
    activeButton.style.transform = 'scale(1)';
}

// Funciones de navegación
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

// Funciones de progreso (mantener compatibilidad)
function saveProgress(day, notes) {
    const progress = JSON.parse(localStorage.getItem('discipleVirtuousProgress') || '{}');
    progress[day] = notes;
    localStorage.setItem('discipleVirtuousProgress', JSON.stringify(progress));
}

function loadProgress() {
    const progress = JSON.parse(localStorage.getItem('discipleVirtuousProgress') || '{}');
    return progress;
}

function exportNotes() {
    const progress = loadProgress();
    let exportText = 'Mis Notas - Disciple Vertueux: 365 Propósitos de Dios\n';
    exportText += '='.repeat(50) + '\n\n';
    
    for (const [day, notes] of Object.entries(progress)) {
        exportText += `Día ${day}:\n`;
        exportText += notes + '\n\n';
    }
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mis-notas-disciple-vertueux.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

