function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function addWeeks(date, weeks) {
    return addDays(date, weeks * 7);
}

function formatYYYYMMDD(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function formatLong(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
    });
}

function daysBetween(startDate, endDate) {
    const msPerDay = 24 * 60 * 60 * 1000;
    const utc1 = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const utc2 = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    return Math.round((utc2 - utc1) / msPerDay);
}

function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
}

function parseDateInput(dateStr) {
    const parts = dateStr.split('-').map(Number);
    if (parts.length !== 3) {
        throw new Error('Invalid date format. Expected YYYY-MM-DD.');
    }
    const [year, month, day] = parts;
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
        throw new Error('Invalid date values.');
    }
    return date;
}

function dayOfWeek(date) {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
}

const CHECKLIST_ITEMS = [
    {
        id: 'arc-readers',
        title: 'Send ARC copies to readers',
        description: 'Distribute complimentary review copies to beta readers so you gather early reviews before launch.',
        offsetDays: -42,
    },
    {
        id: 'preorder',
        title: 'Set up preorder on KDP',
        description: 'Enable preorder on your publishing platform so readers can reserve their copy ahead of launch day.',
        offsetDays: -28,
    },
    {
        id: 'ads',
        title: 'Launch ad campaign',
        description: 'Start your targeted ad campaign to build momentum toward your launch date.',
        offsetDays: -14,
    },
    {
        id: 'newsletter',
        title: 'Send newsletter announcement',
        description: 'Email your subscriber list about the upcoming launch and preorder opportunity.',
        offsetDays: -7,
    },
    {
        id: 'final-check',
        title: 'Final pre-launch checklist',
        description: 'Verify preorder is live, ads are running, and everything is ready for launch day.',
        offsetDays: -1,
    },
];

function getChecklistWithDates(launchDate) {
    return CHECKLIST_ITEMS.map((item) => {
        const computedDate = addDays(launchDate, item.offsetDays);
        return {
            ...item,
            date: computedDate,
            dateStr: formatYYYYMMDD(computedDate),
            dateLong: formatLong(computedDate),
            dayName: dayOfWeek(computedDate),
            daysFromLaunch: item.offsetDays,
            isPastDue: computedDate < new Date() && computedDate.toDateString() !== new Date().toDateString(),
        };
    }).sort((a, b) => a.date - b.date);
}

function getChecklistItems() {
    return CHECKLIST_ITEMS.map((item) => ({ ...item }));
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addDays,
        addWeeks,
        formatYYYYMMDD,
        formatLong,
        daysBetween,
        isWeekend,
        parseDateInput,
        dayOfWeek,
        CHECKLIST_ITEMS,
        getChecklistItems,
        getChecklistWithDates,
    };
}
