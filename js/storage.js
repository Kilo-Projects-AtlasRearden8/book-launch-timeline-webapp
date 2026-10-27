const STORAGE_KEY = 'book-launch-checklist';

function loadAppState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

function saveAppState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        return true;
    } catch (e) {
        return false;
    }
}

function clearAppState() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (e) {
        return false;
    }
}

function createDefaultState(launchDate) {
    return {
        launchDate: formatYYYYMMDD(launchDate),
        completedItems: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

function updateLaunchDate(state, launchDate) {
    return {
        ...state,
        launchDate: formatYYYYMMDD(launchDate),
        updatedAt: new Date().toISOString(),
    };
}

function toggleCompleted(state, itemId) {
    const completed = state.completedItems || [];
    const newCompleted = completed.includes(itemId)
        ? completed.filter((id) => id !== itemId)
        : [...completed, itemId];
    return {
        ...state,
        completedItems: newCompleted,
        updatedAt: new Date().toISOString(),
    };
}

function isItemCompleted(state, itemId) {
    return (state.completedItems || []).includes(itemId);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        STORAGE_KEY,
        loadAppState,
        saveAppState,
        clearAppState,
        createDefaultState,
        updateLaunchDate,
        toggleCompleted,
        isItemCompleted,
    };
}
