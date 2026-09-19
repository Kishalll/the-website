// Official VIT Timetable Slot Definitions, Matrix, and Clash Utilities

export const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

export const MORNING_THEORY_HOURS = [
  { start: '08:00 AM', end: '08:50 AM' },
  { start: '08:55 AM', end: '09:45 AM' },
  { start: '09:50 AM', end: '10:40 AM' },
  { start: '10:45 AM', end: '11:35 AM' },
  { start: '11:40 AM', end: '12:30 PM' },
];

export const MORNING_LAB_HOURS = [
  { start: '08:00 AM', end: '08:50 AM' },
  { start: '08:50 AM', end: '09:40 AM' },
  { start: '09:50 AM', end: '10:40 AM' },
  { start: '10:40 AM', end: '11:30 AM' },
  { start: '11:40 AM', end: '12:30 PM' },
  { start: '12:30 PM', end: '01:20 PM' },
];

export const AFTERNOON_THEORY_HOURS = [
  { start: '02:00 PM', end: '02:50 PM' },
  { start: '02:55 PM', end: '03:45 PM' },
  { start: '03:50 PM', end: '04:40 PM' },
  { start: '04:45 PM', end: '05:35 PM' },
  { start: '05:40 PM', end: '06:30 PM' },
];

export const AFTERNOON_LAB_HOURS = [
  { start: '02:00 PM', end: '02:50 PM' },
  { start: '02:50 PM', end: '03:40 PM' },
  { start: '03:50 PM', end: '04:40 PM' },
  { start: '04:40 PM', end: '05:30 PM' },
  { start: '05:40 PM', end: '06:30 PM' },
  { start: '06:30 PM', end: '07:20 PM' },
];

// Grid definition: 5 rows (Days), each row has morning slots (columns 0..5) and afternoon slots (columns 6..11)
// Cell object format:
// { day: 'MON', col: 0, session: 'morning', theorySlot: 'A1', labSlot: 'L1', isExtramural: false }
export const TIMETABLE_GRID = [
  {
    day: 'MON',
    slots: [
      { col: 0, session: 'morning', theorySlot: 'A1', labSlot: 'L1' },
      { col: 1, session: 'morning', theorySlot: 'F1', labSlot: 'L2' },
      { col: 2, session: 'morning', theorySlot: 'D1', labSlot: 'L3' },
      { col: 3, session: 'morning', theorySlot: 'TB1', labSlot: 'L4' },
      { col: 4, session: 'morning', theorySlot: 'TG1', labSlot: 'L5' },
      { col: 5, session: 'morning', theorySlot: null, labSlot: 'L6' },
      { col: 6, session: 'afternoon', theorySlot: 'A2', labSlot: 'L31' },
      { col: 7, session: 'afternoon', theorySlot: 'F2', labSlot: 'L32' },
      { col: 8, session: 'afternoon', theorySlot: 'D2', labSlot: 'L33' },
      { col: 9, session: 'afternoon', theorySlot: 'TB2', labSlot: 'L34' },
      { col: 10, session: 'afternoon', theorySlot: 'TG2', labSlot: 'L35' },
      { col: 11, session: 'afternoon', theorySlot: null, labSlot: 'L36' },
    ],
  },
  {
    day: 'TUE',
    slots: [
      { col: 0, session: 'morning', theorySlot: 'B1', labSlot: 'L7' },
      { col: 1, session: 'morning', theorySlot: 'G1', labSlot: 'L8' },
      { col: 2, session: 'morning', theorySlot: 'E1', labSlot: 'L9' },
      { col: 3, session: 'morning', theorySlot: 'TC1', labSlot: 'L10' },
      { col: 4, session: 'morning', theorySlot: 'TAA1', labSlot: 'L11' },
      { col: 5, session: 'morning', theorySlot: null, labSlot: 'L12' },
      { col: 6, session: 'afternoon', theorySlot: 'B2', labSlot: 'L37' },
      { col: 7, session: 'afternoon', theorySlot: 'G2', labSlot: 'L38' },
      { col: 8, session: 'afternoon', theorySlot: 'E2', labSlot: 'L39' },
      { col: 9, session: 'afternoon', theorySlot: 'TC2', labSlot: 'L40' },
      { col: 10, session: 'afternoon', theorySlot: 'TAA2', labSlot: 'L41' },
      { col: 11, session: 'afternoon', theorySlot: null, labSlot: 'L42' },
    ],
  },
  {
    day: 'WED',
    slots: [
      { col: 0, session: 'morning', theorySlot: 'C1', labSlot: 'L13' },
      { col: 1, session: 'morning', theorySlot: 'A1', labSlot: 'L14' },
      { col: 2, session: 'morning', theorySlot: 'F1', labSlot: 'L15' },
      { col: 3, session: 'morning', theorySlot: 'TD1', labSlot: 'L16' },
      { col: 4, session: 'morning', theorySlot: null, labSlot: 'L17+L18', isExtramural: true, colSpan: 2 },
      { col: 6, session: 'afternoon', theorySlot: 'C2', labSlot: 'L43' },
      { col: 7, session: 'afternoon', theorySlot: 'A2', labSlot: 'L44' },
      { col: 8, session: 'afternoon', theorySlot: 'F2', labSlot: 'L45' },
      { col: 9, session: 'afternoon', theorySlot: 'TD2', labSlot: 'L46' },
      { col: 10, session: 'afternoon', theorySlot: 'TBB2', labSlot: 'L47' },
      { col: 11, session: 'afternoon', theorySlot: null, labSlot: 'L48' },
    ],
  },
  {
    day: 'THU',
    slots: [
      { col: 0, session: 'morning', theorySlot: 'D1', labSlot: 'L19' },
      { col: 1, session: 'morning', theorySlot: 'B1', labSlot: 'L20' },
      { col: 2, session: 'morning', theorySlot: 'G1', labSlot: 'L21' },
      { col: 3, session: 'morning', theorySlot: 'TE1', labSlot: 'L22' },
      { col: 4, session: 'morning', theorySlot: 'TCC1', labSlot: 'L23' },
      { col: 5, session: 'morning', theorySlot: null, labSlot: 'L24' },
      { col: 6, session: 'afternoon', theorySlot: 'D2', labSlot: 'L49' },
      { col: 7, session: 'afternoon', theorySlot: 'B2', labSlot: 'L50' },
      { col: 8, session: 'afternoon', theorySlot: 'G2', labSlot: 'L51' },
      { col: 9, session: 'afternoon', theorySlot: 'TE2', labSlot: 'L52' },
      { col: 10, session: 'afternoon', theorySlot: 'TCC2', labSlot: 'L53' },
      { col: 11, session: 'afternoon', theorySlot: null, labSlot: 'L54' },
    ],
  },
  {
    day: 'FRI',
    slots: [
      { col: 0, session: 'morning', theorySlot: 'E1', labSlot: 'L25' },
      { col: 1, session: 'morning', theorySlot: 'C1', labSlot: 'L26' },
      { col: 2, session: 'morning', theorySlot: 'TA1', labSlot: 'L27' },
      { col: 3, session: 'morning', theorySlot: 'TF1', labSlot: 'L28' },
      { col: 4, session: 'morning', theorySlot: 'TDD1', labSlot: 'L29' },
      { col: 5, session: 'morning', theorySlot: null, labSlot: 'L30' },
      { col: 6, session: 'afternoon', theorySlot: 'E2', labSlot: 'L55' },
      { col: 7, session: 'afternoon', theorySlot: 'C2', labSlot: 'L56' },
      { col: 8, session: 'afternoon', theorySlot: 'TA2', labSlot: 'L57' },
      { col: 9, session: 'afternoon', theorySlot: 'TF2', labSlot: 'L58' },
      { col: 10, session: 'afternoon', theorySlot: 'TDD2', labSlot: 'L59' },
      { col: 11, session: 'afternoon', theorySlot: null, labSlot: 'L60' },
    ],
  },
];

// Map of each unique slot name to its exact occurrences on the grid: [{ day, col }]
export const SLOT_OCCURRENCES = {};
TIMETABLE_GRID.forEach(row => {
  row.slots.forEach(slotItem => {
    if (slotItem.theorySlot) {
      if (!SLOT_OCCURRENCES[slotItem.theorySlot]) {
        SLOT_OCCURRENCES[slotItem.theorySlot] = [];
      }
      SLOT_OCCURRENCES[slotItem.theorySlot].push({ day: row.day, col: slotItem.col });
    }
    if (slotItem.labSlot && !slotItem.isExtramural) {
      if (!SLOT_OCCURRENCES[slotItem.labSlot]) {
        SLOT_OCCURRENCES[slotItem.labSlot] = [];
      }
      SLOT_OCCURRENCES[slotItem.labSlot].push({ day: row.day, col: slotItem.col });
    }
  });
});

// All official lab slot pairs (must be taken in pairs)
export const LAB_PAIRS = [
  // Morning Session 1
  'L1+L2', 'L3+L4', 'L5+L6',
  'L7+L8', 'L9+L10', 'L11+L12',
  'L13+L14', 'L15+L16',
  'L19+L20', 'L21+L22', 'L23+L24',
  'L25+L26', 'L27+L28', 'L29+L30',
  // Afternoon Session 2
  'L31+L32', 'L33+L34', 'L35+L36',
  'L37+L38', 'L39+L40', 'L41+L42',
  'L43+L44', 'L45+L46', 'L47+L48',
  'L49+L50', 'L51+L52', 'L53+L54',
  'L55+L56', 'L57+L58', 'L59+L60',
];

// Helper to expand a slot string or combo into constituent atomic slots
// e.g. "A1+TA1+TAA1" => ['A1', 'TA1', 'TAA1']
// e.g. "L1+L2" => ['L1', 'L2']
export const parseSlotString = (slotStr) => {
  if (!slotStr) return [];
  return slotStr.split('+').map(s => s.trim()).filter(Boolean);
};

// Given a list of atomic slots (e.g. ['A1', 'TA1']), find all {day, col} grid positions they cover
export const getGridPositionsForSlots = (slots) => {
  const positions = [];
  slots.forEach(slot => {
    const occs = SLOT_OCCURRENCES[slot] || [];
    occs.forEach(occ => {
      if (!positions.some(p => p.day === occ.day && p.col === occ.col)) {
        positions.push(occ);
      }
    });
  });
  return positions;
};

// Find the cell at given { day, col }
export const getCellAt = (day, col) => {
  const row = TIMETABLE_GRID.find(r => r.day === day);
  if (!row) return null;
  return row.slots.find(s => s.col === col) || null;
};

// Official Theory Groups and their valid combinations according to VIT timetable
// Group definitions:
// A1: A1, TA1, TAA1 (A1+TA1+TAA1, A1+TA1, A1, TA1, TAA1)
// B1: B1, TB1 (B1+TB1, B1, TB1) -> note TB1 exists on Mon, no TBB1 in morning
// C1: C1, TC1 (C1+TC1, C1, TC1)
// D1: D1, TD1 (D1+TD1, D1, TD1)
// E1: E1, TE1 (E1+TE1, E1, TE1)
// F1: F1, TF1 (F1+TF1, F1, TF1)
// G1: G1, TG1 (G1+TG1, G1, TG1)
// Afternoon Session 2:
// A2: A2, TA2, TAA2 (A2+TA2+TAA2, A2+TA2, A2, TA2, TAA2)
// B2: B2, TB2, TBB2 (B2+TB2+TBB2, B2+TB2, B2, TB2, TBB2)
// C2: C2, TC2, TCC2 (C2+TC2+TCC2, C2+TC2, C2, TC2, TCC2)
// D2: D2, TD2, TDD2 (D2+TD2+TDD2, D2+TD2, D2, TD2, TDD2)
// E2: E2, TE2 (E2+TE2, E2, TE2)
// F2: F2, TF2 (F2+TF2, F2, TF2)
// G2: G2, TG2 (G2+TG2, G2, TG2)
// Other standalone slots present in grid:
// TCC1 (Thu 5), TDD1 (Fri 5)
export const THEORY_SLOT_GROUPS = {
  // Morning 1
  A1: ['A1+TA1+TAA1', 'A1+TA1', 'A1', 'TA1', 'TAA1'],
  B1: ['B1+TB1', 'B1', 'TB1'],
  C1: ['C1+TC1+TCC1', 'C1+TC1', 'C1', 'TC1', 'TCC1'],
  D1: ['D1+TD1+TDD1', 'D1+TD1', 'D1', 'TD1', 'TDD1'],
  E1: ['E1+TE1', 'E1', 'TE1'],
  F1: ['F1+TF1', 'F1', 'TF1'],
  G1: ['G1+TG1', 'G1', 'TG1'],

  // Afternoon 2
  A2: ['A2+TA2+TAA2', 'A2+TA2', 'A2', 'TA2', 'TAA2'],
  B2: ['B2+TB2+TBB2', 'B2+TB2', 'B2', 'TB2', 'TBB2'],
  C2: ['C2+TC2+TCC2', 'C2+TC2', 'C2', 'TC2', 'TCC2'],
  D2: ['D2+TD2+TDD2', 'D2+TD2', 'D2', 'TD2', 'TDD2'],
  E2: ['E2+TE2', 'E2', 'TE2'],
  F2: ['F2+TF2', 'F2', 'TF2'],
  G2: ['G2+TG2', 'G2', 'TG2'],
};

// All permitted valid slot strings
export const ALL_VALID_SLOTS = (() => {
  const list = new Set();
  Object.values(THEORY_SLOT_GROUPS).forEach(combos => {
    combos.forEach(c => list.add(c));
  });
  LAB_PAIRS.forEach(pair => list.add(pair));
  return Array.from(list);
})();

// Validate if a slot input is officially valid
export const validateSlotString = (slotStr) => {
  if (!slotStr) return { isValid: false, message: 'Slot cannot be empty.' };
  const normalized = slotStr.trim().toUpperCase();

  // If starts with L or contains L, must be an adjacent pair in LAB_PAIRS
  if (normalized.startsWith('L') || normalized.includes('L')) {
    if (!LAB_PAIRS.includes(normalized)) {
      return {
        isValid: false,
        message: `Invalid lab slot '${normalized}'. Labs must be chosen as official adjacent pairs (e.g., L1+L2, L3+L4, L13+L14, etc.).`,
      };
    }
    return { isValid: true, normalized };
  }

  // Otherwise it's a theory slot/combo
  if (!ALL_VALID_SLOTS.includes(normalized)) {
    return {
      isValid: false,
      message: `Invalid slot combination '${normalized}'. Only official slots and combinations are allowed (e.g., A1, A1+TA1, A1+TA1+TAA1, etc.).`,
    };
  }

  return { isValid: true, normalized };
};

// Given a clicked theory and lab slot from a cell, return smart suggested slot options for the modal
export const getAvailableOptionsForCell = (theorySlot, labSlot) => {
  const options = [];

  // If cell has a theory slot, include all official combinations that contain this slot or its group
  if (theorySlot) {
    Object.entries(THEORY_SLOT_GROUPS).forEach(([baseGroup, combos]) => {
      // If the clicked slot matches the baseGroup or any atomic part in the combos
      const matchesGroup = combos.some(combo => {
        const parts = parseSlotString(combo);
        return parts.includes(theorySlot);
      });

      if (matchesGroup) {
        combos.forEach(combo => {
          if (!options.some(o => o.value === combo)) {
            options.push({ value: combo, label: combo, type: 'Theory' });
          }
        });
      }
    });

    // Also allow standalone if not already listed
    if (!options.some(o => o.value === theorySlot)) {
      options.push({ value: theorySlot, label: theorySlot, type: 'Theory' });
    }
  }

  // Also include the corresponding lab pair for this cell
  if (labSlot) {
    const rawLab = labSlot.replace(/\+.*$/, '');
    LAB_PAIRS.forEach(pair => {
      const parts = parseSlotString(pair);
      if (parts.includes(rawLab) || parts.includes(labSlot)) {
        if (!options.some(o => o.value === pair)) {
          options.push({ value: pair, label: pair, type: 'Lab' });
        }
      }
    });
  }

  return options;
};

// Clash Detection
// Returns { hasClash: boolean, conflicts: Array<{ courseName, slot, day, col }> }
export const checkSlotClash = (newSlotStr, existingCourses, ignoreCourseId = null) => {
  const newSlots = parseSlotString(newSlotStr);
  const newPositions = getGridPositionsForSlots(newSlots);

  const conflicts = [];

  existingCourses.forEach(course => {
    if (ignoreCourseId && course.id === ignoreCourseId) return;

    const courseSlots = parseSlotString(course.slot);
    const coursePositions = getGridPositionsForSlots(courseSlots);

    // Check if any physical { day, col } overlaps
    newPositions.forEach(newPos => {
      const match = coursePositions.find(p => p.day === newPos.day && p.col === newPos.col);
      if (match) {
        conflicts.push({
          courseId: course.id,
          courseName: course.name,
          courseCode: course.code,
          slot: course.slot,
          day: match.day,
          col: match.col,
        });
      }
    });
  });

  return {
    hasClash: conflicts.length > 0,
    conflicts,
  };
};
