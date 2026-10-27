const test = require('node:test');
const assert = require('node:assert');
const {
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
} = require('../js/date-utils.js');

test('addDays adds positive days', () => {
    const d = new Date(2026, 9, 27);
    const result = addDays(d, 3);
    assert.strictEqual(result.getDate(), 30);
    assert.strictEqual(result.getMonth(), 9);
});

test('addDays subtracts with negative days', () => {
    const d = new Date(2026, 9, 27);
    const result = addDays(d, -1);
    assert.strictEqual(result.getDate(), 26);
    assert.strictEqual(result.getMonth(), 9);
});

test('addDays crosses month boundary forward', () => {
    const d = new Date(2026, 9, 31);
    const result = addDays(d, 1);
    assert.strictEqual(result.getDate(), 1);
    assert.strictEqual(result.getMonth(), 10);
});

test('addDays crosses month boundary backward', () => {
    const d = new Date(2026, 10, 1);
    const result = addDays(d, -1);
    assert.strictEqual(result.getDate(), 31);
    assert.strictEqual(result.getMonth(), 9);
});

test('addDays crosses year boundary', () => {
    const d = new Date(2025, 11, 31);
    const result = addDays(d, 1);
    assert.strictEqual(result.getDate(), 1);
    assert.strictEqual(result.getMonth(), 0);
    assert.strictEqual(result.getFullYear(), 2026);
});

test('addDays does not mutate original date', () => {
    const d = new Date(2026, 9, 27);
    const original = new Date(d);
    addDays(d, 5);
    assert.deepStrictEqual(d, original);
});

test('addWeeks multiplies by 7', () => {
    const d = new Date(2026, 9, 27);
    const result = addWeeks(d, 1);
    assert.strictEqual(daysBetween(d, result), 7);
});

test('addWeeks with negative weeks', () => {
    const d = new Date(2026, 9, 27);
    const result = addWeeks(d, -2);
    assert.strictEqual(daysBetween(result, d), 14);
});

test('formatYYYYMMDD zero-pads single-digit month and day', () => {
    const d = new Date(2026, 0, 5);
    assert.strictEqual(formatYYYYMMDD(d), '2026-01-05');
});

test('formatYYYYMMDD handles double-digit values', () => {
    const d = new Date(2026, 9, 27);
    assert.strictEqual(formatYYYYMMDD(d), '2026-10-27');
});

test('daysBetween counts days forward', () => {
    const a = new Date(2026, 9, 27);
    const b = new Date(2026, 10, 3);
    assert.strictEqual(daysBetween(a, b), 7);
});

test('daysBetween is symmetric', () => {
    const a = new Date(2026, 9, 27);
    const b = new Date(2026, 10, 3);
    assert.strictEqual(daysBetween(a, b), -daysBetween(b, a));
});

test('daysBetween across year boundary', () => {
    const a = new Date(2025, 11, 25);
    const b = new Date(2026, 0, 5);
    assert.strictEqual(daysBetween(a, b), 11);
});

test('isWeekend returns true for Saturday', () => {
    const sat = new Date(2026, 9, 31);
    assert.strictEqual(isWeekend(sat), true);
});

test('isWeekend returns true for Sunday', () => {
    const sun = new Date(2026, 10, 1);
    assert.strictEqual(isWeekend(sun), true);
});

test('isWeekend returns false for weekday', () => {
    const wed = new Date(2026, 9, 28);
    assert.strictEqual(isWeekend(wed), false);
});

test('parseDateInput parses valid YYYY-MM-DD', () => {
    const d = parseDateInput('2026-11-15');
    assert.strictEqual(d.getFullYear(), 2026);
    assert.strictEqual(d.getMonth(), 10);
    assert.strictEqual(d.getDate(), 15);
});

test('parseDateInput throws on invalid month', () => {
    assert.throws(() => parseDateInput('2026-13-01'), /Invalid/);
});

test('parseDateInput throws on invalid day', () => {
    assert.throws(() => parseDateInput('2026-02-30'), /Invalid/);
});

test('parseDateInput throws on wrong format', () => {
    assert.throws(() => parseDateInput('11/15/2026'), /Invalid/);
});

test('dayOfWeek returns correct names', () => {
    assert.strictEqual(dayOfWeek(new Date(2026, 9, 27)), 'Tuesday');
    assert.strictEqual(dayOfWeek(new Date(2026, 10, 1)), 'Sunday');
});

test('getChecklistWithDates returns all items', () => {
    const launch = new Date(2026, 10, 15);
    const items = getChecklistWithDates(launch);
    assert.strictEqual(items.length, CHECKLIST_ITEMS.length);
    assert.strictEqual(items.length, 5);
});

test('getChecklistWithDates returns items sorted earliest first', () => {
    const launch = new Date(2026, 10, 15);
    const items = getChecklistWithDates(launch);
    for (let i = 1; i < items.length; i++) {
        assert.ok(items[i - 1].date <= items[i].date, 'Items should be sorted chronologically');
    }
});

test('getChecklistWithDates computes correct ARC date (6 weeks before)', () => {
    const launch = new Date(2026, 10, 15);
    const items = getChecklistWithDates(launch);
    const arc = items.find((i) => i.id === 'arc-readers');
    assert.strictEqual(arc.dateStr, '2026-10-04');
});

test('getChecklistWithDates computes correct preorder date (4 weeks before)', () => {
    const launch = new Date(2026, 10, 15);
    const items = getChecklistWithDates(launch);
    const preorder = items.find((i) => i.id === 'preorder');
    assert.strictEqual(preorder.dateStr, '2026-10-18');
});

test('getChecklistWithDates computes correct ads date (2 weeks before)', () => {
    const launch = new Date(2026, 10, 15);
    const items = getChecklistWithDates(launch);
    const ads = items.find((i) => i.id === 'ads');
    assert.strictEqual(ads.dateStr, '2026-11-01');
});

test('getChecklistWithDates computes correct newsletter date (1 week before)', () => {
    const launch = new Date(2026, 10, 15);
    const items = getChecklistWithDates(launch);
    const newsletter = items.find((i) => i.id === 'newsletter');
    assert.strictEqual(newsletter.dateStr, '2026-11-08');
});

test('getChecklistWithDates computes correct final-check date (1 day before)', () => {
    const launch = new Date(2026, 10, 15);
    const items = getChecklistWithDates(launch);
    const check = items.find((i) => i.id === 'final-check');
    assert.strictEqual(check.dateStr, '2026-11-14');
});

test('getChecklistWithDates offset equals daysBetween from launch', () => {
    const launch = new Date(2026, 10, 15);
    const items = getChecklistWithDates(launch);
    items.forEach((item) => {
        assert.strictEqual(Math.abs(daysBetween(item.date, launch)), Math.abs(item.offsetDays));
    });
});

test('getChecklistWithDates handles leap year Feb 29', () => {
    const launch = new Date(2024, 1, 29);
    const items = getChecklistWithDates(launch);
    const check = items.find((i) => i.id === 'final-check');
    assert.strictEqual(check.date.getDate(), 28);
    assert.strictEqual(check.date.getMonth(), 1);
});

test('getChecklistWithDates handles Feb 29 launch with 6-week offset', () => {
    const launch = new Date(2024, 1, 29);
    const items = getChecklistWithDates(launch);
    const arc = items.find((i) => i.id === 'arc-readers');
    assert.strictEqual(arc.dateStr, '2024-01-18');
});

test('getChecklistItems returns independent copies', () => {
    const items1 = getChecklistItems();
    const items2 = getChecklistItems();
    assert.deepStrictEqual(items1, items2);
    assert.notStrictEqual(items1[0], items2[0]);
});

test('CHECKLIST_ITEMS all have required fields', () => {
    CHECKLIST_ITEMS.forEach((item) => {
        assert.ok(typeof item.id === 'string', 'id should be a string');
        assert.ok(typeof item.title === 'string', 'title should be a string');
        assert.ok(typeof item.description === 'string', 'description should be a string');
        assert.ok(typeof item.offsetDays === 'number', 'offsetDays should be a number');
        assert.ok(item.offsetDays < 0, 'offsetDays should be negative (before launch)');
    });
});

test('CHECKLIST_ITEMS are unique by id', () => {
    const ids = CHECKLIST_ITEMS.map((i) => i.id);
    const unique = new Set(ids);
    assert.strictEqual(unique.size, ids.length, 'All checklist item IDs should be unique');
});
