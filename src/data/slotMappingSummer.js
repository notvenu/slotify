const slotMappingSummer = {
  // ================= LUNCH =================
  Lunch: [
    { time: '12:50-14:00' }
  ],

  // ================= THEORY (2 CREDIT) =================
  A:  [{ day: 'WED', time: '11:00-11:50' }, { day: 'THU', time: '14:00-14:50' }],
  A1: [{ day: 'WED', time: '12:00-12:50' }, { day: 'THU', time: '15:00-15:50' }],

  B:  [{ day: 'WED', time: '09:00-09:50' }, { day: 'THU', time: '11:00-11:50' }],
  B1: [{ day: 'WED', time: '10:00-10:50' }, { day: 'THU', time: '12:00-12:50' }],

  C:  [{ day: 'THU', time: '09:00-09:50' }, { day: 'WED', time: '14:00-14:50' }],
  C1: [{ day: 'THU', time: '10:00-10:50' }, { day: 'WED', time: '15:00-15:50' }],

  D:  [
    { day: 'TUE', time: '16:00-16:50' },
    { day: 'WED', time: '16:00-16:50' },
    { day: 'THU', time: '16:00-16:50' },
    { day: 'FRI', time: '16:00-16:50' }
  ],
  D1: [
    { day: 'TUE', time: '17:00-17:50' },
    { day: 'WED', time: '17:00-17:50' },
    { day: 'THU', time: '17:00-17:50' },
    { day: 'FRI', time: '17:00-17:50' }
  ],

  // ================= THEORY (1 CREDIT / TUTORIAL) =================
  TA:  [{ day: 'TUE', time: '11:00-11:50' }, { day: 'FRI', time: '09:00-09:50' }],
  TA1: [{ day: 'TUE', time: '12:00-12:50' }, { day: 'FRI', time: '10:00-10:50' }],

  TB:  [{ day: 'TUE', time: '14:00-14:50' }, { day: 'FRI', time: '14:00-14:50' }],
  TB1: [{ day: 'TUE', time: '15:00-15:50' }, { day: 'FRI', time: '15:00-15:50' }],

  TC:  [{ day: 'TUE', time: '09:00-09:50' }, { day: 'FRI', time: '11:00-11:50' }],
  TC1: [{ day: 'TUE', time: '10:00-10:50' }, { day: 'FRI', time: '12:00-12:50' }],

  TD:  [{ day: 'MON', time: '16:00-16:50' }, { day: 'SAT', time: '16:00-16:50' }],
  TD1: [{ day: 'MON', time: '17:00-17:50' }, { day: 'SAT', time: '17:00-17:50' }],

  TAA:  [{ day: 'MON', time: '09:00-09:50' }, { day: 'SAT', time: '11:00-11:50' }],
  TAA1: [{ day: 'MON', time: '10:00-10:50' }, { day: 'SAT', time: '12:00-12:50' }],

  TBB:  [{ day: 'MON', time: '11:00-11:50' }, { day: 'SAT', time: '09:00-09:50' }],
  TBB1: [{ day: 'MON', time: '12:00-12:50' }, { day: 'SAT', time: '10:00-10:50' }],

  TCC:  [{ day: 'MON', time: '14:00-14:50' }, { day: 'SAT', time: '14:00-14:50' }],
  TCC1: [{ day: 'MON', time: '15:00-15:50' }, { day: 'SAT', time: '15:00-15:50' }],

  // ================= LAB SLOTS (RED) =================
  // Pattern: 09:00-09:50 | 09:50-10:40 | 11:00-11:50 | 11:50-12:40
  //          14:00-14:50 | 14:50-15:40 | 16:00-16:50 | 16:50-17:40
  //          18:00-18:50 | 18:50-19:40

  // MON
  L1:  [{ day: 'MON', time: '09:00-09:50' }],
  L2:  [{ day: 'MON', time: '09:50-10:40' }],
  L3:  [{ day: 'MON', time: '11:00-11:50' }],
  L4:  [{ day: 'MON', time: '11:50-12:40' }],
  L25: [{ day: 'MON', time: '14:00-14:50' }],
  L26: [{ day: 'MON', time: '14:50-15:40' }],
  L27: [{ day: 'MON', time: '16:00-16:50' }],
  L28: [{ day: 'MON', time: '16:50-17:40' }],
  L49: [{ day: 'MON', time: '18:00-18:50' }],
  L50: [{ day: 'MON', time: '18:50-19:40' }],

  // TUE
  L5:  [{ day: 'TUE', time: '09:00-09:50' }],
  L6:  [{ day: 'TUE', time: '09:50-10:40' }],
  L7:  [{ day: 'TUE', time: '11:00-11:50' }],
  L8:  [{ day: 'TUE', time: '11:50-12:40' }],
  L29: [{ day: 'TUE', time: '14:00-14:50' }],
  L30: [{ day: 'TUE', time: '14:50-15:40' }],
  L31: [{ day: 'TUE', time: '16:00-16:50' }],
  L32: [{ day: 'TUE', time: '16:50-17:40' }],
  L51: [{ day: 'TUE', time: '18:00-18:50' }],
  L52: [{ day: 'TUE', time: '18:50-19:40' }],

  // WED
  L9:  [{ day: 'WED', time: '09:00-09:50' }],
  L10: [{ day: 'WED', time: '09:50-10:40' }],
  L11: [{ day: 'WED', time: '11:00-11:50' }],
  L12: [{ day: 'WED', time: '11:50-12:40' }],
  L33: [{ day: 'WED', time: '14:00-14:50' }],
  L34: [{ day: 'WED', time: '14:50-15:40' }],
  L35: [{ day: 'WED', time: '16:00-16:50' }],
  L36: [{ day: 'WED', time: '16:50-17:40' }],
  L53: [{ day: 'WED', time: '18:00-18:50' }],
  L54: [{ day: 'WED', time: '18:50-19:40' }],

  // THU
  L13: [{ day: 'THU', time: '09:00-09:50' }],
  L14: [{ day: 'THU', time: '09:50-10:40' }],
  L15: [{ day: 'THU', time: '11:00-11:50' }],
  L16: [{ day: 'THU', time: '11:50-12:40' }],
  L37: [{ day: 'THU', time: '14:00-14:50' }],
  L38: [{ day: 'THU', time: '14:50-15:40' }],
  L39: [{ day: 'THU', time: '16:00-16:50' }],
  L40: [{ day: 'THU', time: '16:50-17:40' }],
  L55: [{ day: 'THU', time: '18:00-18:50' }],
  L56: [{ day: 'THU', time: '18:50-19:40' }],

  // FRI
  L17: [{ day: 'FRI', time: '09:00-09:50' }],
  L18: [{ day: 'FRI', time: '09:50-10:40' }],
  L19: [{ day: 'FRI', time: '11:00-11:50' }],
  L20: [{ day: 'FRI', time: '11:50-12:40' }],
  L41: [{ day: 'FRI', time: '14:00-14:50' }],
  L42: [{ day: 'FRI', time: '14:50-15:40' }],
  L43: [{ day: 'FRI', time: '16:00-16:50' }],
  L44: [{ day: 'FRI', time: '16:50-17:40' }],
  L57: [{ day: 'FRI', time: '18:00-18:50' }],
  L58: [{ day: 'FRI', time: '18:50-19:40' }],

  // SAT
  L21: [{ day: 'SAT', time: '09:00-09:50' }],
  L22: [{ day: 'SAT', time: '09:50-10:40' }],
  L23: [{ day: 'SAT', time: '11:00-11:50' }],
  L24: [{ day: 'SAT', time: '11:50-12:40' }],
  L45: [{ day: 'SAT', time: '14:00-14:50' }],
  L46: [{ day: 'SAT', time: '14:50-15:40' }],
  L47: [{ day: 'SAT', time: '16:00-16:50' }],
  L48: [{ day: 'SAT', time: '16:50-17:40' }],
  L59: [{ day: 'SAT', time: '18:00-18:50' }],
  L60: [{ day: 'SAT', time: '18:50-19:40' }]
};

export default slotMappingSummer;
