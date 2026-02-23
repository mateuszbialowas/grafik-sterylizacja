// Default seed data for demo/first load
// Feb 2026: 28 days, 20 working days, norm = 151:40 (9100 min)
// Each employee's shifts sum to exactly 151:40 so the sun emoji appears

export const DEFAULT_EMPLOYEES = [
  { id: 1, name: "Anna Kowalska" },
  { id: 2, name: "Jan Nowak" },
  { id: 3, name: "Maria Wiśniewska" },
  { id: 4, name: "Piotr Zieliński" },
  { id: 5, name: "Katarzyna Wójcik" },
];

// Weekdays: 2-6, 9-13, 16-20, 23-27
// Weekends: 1,7,8,14,15,21,22,28

// Pattern A: 10D + 4R + C:07:00-08:20 (80min) = 9100
// Pattern B: 8D + 7R + C:07:00-09:35 (155min) = 9100
// Pattern C: 5D + 2D* + 8R + C:07:00-14:00 (420min) = 9100
// Pattern D: 12D + C:07:00-14:40 (460min) = 9100

export const DEFAULT_MONTH_DATA = {
  shifts: {
    // Anna: Pattern A — 10D + 4R + C:07:00-08:20
    1: {
      2: "D", 3: "D", 4: "R", 5: "D", 6: "D",
      9: "R", 10: "D", 11: "D", 12: "R", 13: "D",
      16: "D", 17: "D", 19: "R", 20: "D",
      23: "C:07:00-08:20",
    },
    // Jan: Pattern B — 8D + 7R + C:07:00-09:35
    2: {
      2: "R", 3: "D", 4: "D", 5: "R", 6: "D",
      9: "D", 10: "R", 11: "D", 12: "D", 13: "R",
      16: "R", 17: "D", 18: "R", 19: "D",
      23: "R", 24: "C:07:00-09:35",
    },
    // Maria: Pattern C — 5D + 2D* + 8R + C:07:00-14:00
    3: {
      2: "R", 3: "R", 4: "D", 5: "D*", 6: "R",
      9: "D", 10: "R", 11: "D*", 12: "R", 13: "D",
      16: "R", 17: "D", 18: "R", 19: "D", 20: "R",
      24: "C:07:00-14:00",
    },
    // Piotr: Pattern D — 12D + C:07:00-14:40
    4: {
      2: "D", 3: "D", 5: "D", 6: "D",
      9: "D", 10: "D", 12: "D", 13: "D",
      16: "D", 17: "D", 19: "D", 20: "D",
      23: "C:07:00-14:40",
    },
    // Katarzyna: Pattern A variant — 10D + 4R + C:07:00-08:20
    5: {
      2: "D", 3: "R", 4: "D", 5: "D", 6: "R",
      9: "D", 10: "D", 11: "R", 12: "D", 13: "D",
      16: "R", 17: "D", 18: "D", 19: "D",
      24: "C:07:00-08:20",
    },
  },
  overtime: {
    1: { 7: "15:00-19:00", 21: "19:00-23:00" },
    3: { 14: "14:00-18:00" },
  },
  requests: {
    2: { 27: "Urlop wypoczynkowy" },
    4: { 4: "Szkolenie BHP", 11: "Szkolenie BHP", 18: "Szkolenie BHP" },
  },
  workingDaysOverride: null,
  normOverrides: {},
};
