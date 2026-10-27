document.addEventListener('DOMContentLoaded', () => {
    const launchDateInput = document.getElementById('launch-date');
    const checklistGrid = document.getElementById('checklist');
    const saveMessage = document.getElementById('save-message');
    const clearBtn = document.getElementById('clear-data');
    const today = new Date();
    const todayStr = formatYYYYMMDD(today);
    const defaultLaunch = addDays(today, 30);

    let appState = loadAppState();

    function renderChecklist(launchDateStr) {
        if (!launchDateStr || !appState) return;
        const launchDate = parseDateInput(launchDateStr);
        const items = getChecklistWithDates(launchDate);
        checklistGrid.innerHTML = '';
        items.forEach((item, index) => {
            const isDone = isItemCompleted(appState, item.id);
            const card = document.createElement('div');
            card.className = 'checklist-item';
            card.setAttribute('data-item-id', item.id);
            card.innerHTML =
                `<div class="item-header">
                    <span class="item-day">${item.dayName}</span>
                    <span class="item-date">${formatLong(item.date)}</span>
                </div>
                <h3 class="item-title">${item.title}</h3>
                <p class="item-description">${item.description}</p>
                <div class="item-relation">
                    <span class="relation-label">${item.offsetDays === -1 ? 'Launch Day — 1 day' : `Launch Day — ${Math.abs(item.offsetDays)} days`}</span>
                </div>
                <button class="complete-btn ${isDone ? 'done' : ''}" type="button" aria-pressed="${isDone}">
                    <span class="btn-text">${isDone ? 'Mark incomplete' : 'Mark complete'}</span>
                </button>`;
            checklistGrid.appendChild(card);
            const btn = card.querySelector('.complete-btn');
            btn.addEventListener('click', () => {
                appState = toggleCompleted(appState, item.id);
                saveAppState(appState);
                renderChecklist(launchDateStr);
                showSaveMessage('Progress saved.');
            });
        });
    }

    function showSaveMessage(msg) {
        saveMessage.textContent = msg;
        saveMessage.classList.add('visible');
        setTimeout(() => {
            saveMessage.classList.remove('visible');
        }, 2000);
    }

    function loadStateFromStorage() {
        appState = loadAppState();
        if (appState) {
            const savedDate = appState.launchDate;
            if (savedDate) {
                launchDateInput.value = savedDate;
                renderChecklist(savedDate);
                return true;
            }
        }
        return false;
    }

    function setDefaultLaunch() {
        launchDateInput.value = formatYYYYMMDD(defaultLaunch);
        appState = createDefaultState(defaultLaunch);
        saveAppState(appState);
        renderChecklist(formatYYYYMMDD(defaultLaunch));
    }

    launchDateInput.addEventListener('change', () => {
        const value = launchDateInput.value;
        try {
            const date = parseDateInput(value);
            appState = updateLaunchDate(appState || { completedItems: [] }, date);
            saveAppState(appState);
            renderChecklist(value);
            showSaveMessage('Launch date saved.');
        } catch (e) {
            showSaveMessage('Please select a valid date.');
        }
    });

    clearBtn.addEventListener('click', () => {
        if (confirm('Remove all saved data? This cannot be undone.')) {
            clearAppState();
            appState = null;
            launchDateInput.value = '';
            checklistGrid.innerHTML = '';
            showSaveMessage('All data cleared.');
        }
    });

    if (!loadStateFromStorage()) {
        setDefaultLaunch();
    }
});
