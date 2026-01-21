const slotMappingFreshers = {
  Lunch: [
    { time: '13:10-14:00' },
  ],
  
  A1: [
    { day: 'TUE', time: '09:00-09:50' },
    { day: 'THU', time: '11:00-11:50' },
    { day: 'FRI', time: '10:00-10:50' }
  ],
  A2: [
    { day: 'TUE', time: '15:00-15:50' },
    { day: 'THU', time: '16:00-16:50' },
    { day: 'FRI', time: '16:00-16:50' }
  ],
  B1: [
    { day: 'TUE', time: '10:00-10:50' },
    { day: 'WED', time: '12:00-12:50' },
    { day: 'FRI', time: '09:00-09:50' }
  ],
  B2: [
    { day: 'TUE', time: '16:00-16:50' },
    { day: 'WED', time: '16:00-16:50' },
    { day: 'FRI', time: '15:00-15:50' }
  ],
  C1: [
    { day: 'TUE', time: '11:00-11:50' },
    { day: 'THU', time: '09:00-09:50' },
    { day: 'SAT', time: '09:00-09:50' }
  ],
  C2: [
    { day: 'TUE', time: '17:00-17:50' },
    { day: 'THU', time: '15:00-15:50' },
    { day: 'SAT', time: '17:00-17:50' }
  ],
  D1: [
    { day: 'TUE', time: '12:00-12:50' },
    { day: 'WED', time: '09:00-09:50' },
    { day: 'THU', time: '10:00-10:50' }
  ],
  D2: [
    { day: 'WED', time: '14:00-14:50' },
    { day: 'THU', time: '17:00-17:50' },
    { day: 'SAT', time: '15:00-15:50' }
  ],
  E1: [
    { day: 'MON', time: '11:00-11:50' },
    { day: 'MON', time: '12:00-12:50' },
    { day: 'FRI', time: '12:00-12:50' }
  ],
  E2: [
    { day: 'MON', time: '17:00-17:50' },
    { day: 'MON', time: '16:00-16:50' },
    { day: 'THU', time: '14:00-14:50' }
  ],
  F1: [
    { day: 'WED', time: '10:00-10:50' },
    { day: 'THU', time: '12:00-12:50' },
    { day: 'SAT', time: '10:00-10:50' }
  ],
  F2: [
    { day: 'TUE', time: '14:00-14:50' },
    { day: 'WED', time: '15:00-15:50' },
    { day: 'SAT', time: '16:00-16:50' }
  ],
  G1: [
    { day: 'WED', time: '11:00-11:50' },
    { day: 'FRI', time: '11:00-11:50' },
    { day: 'SAT', time: '11:00-11:50' }
  ],
  G2: [
    { day: 'WED', time: '17:00-17:50' },
    { day: 'FRI', time: '17:00-17:50' },
    { day: 'SAT', time: '14:00-14:50' }
  ],

  TA1: [{ day: 'MON', time: '09:00-09:50' }],
  TA2: [{ day: 'MON', time: '14:00-14:50' }],
  TB1: [{ day: 'MON', time: '10:00-10:50' }],
  TB2: [{ day: 'MON', time: '15:00-15:50' }],
  TC1: [{ day: 'SAT', time: '08:00-08:50' }],
  TC2: [{ day: 'FRI', time: '14:00-14:50' }],
  TD1: [{ day: 'SAT', time: '11:00-11:50' }],
  TD2: [{ day: 'SAT', time: '14:00-14:50' }],
  TE1: [{ day: 'WED', time: '11:00-11:50' }],
  TE2: [{ day: 'WED', time: '17:00-17:50' }],
  TF1: [{ day: 'FRI', time: '11:00-11:50' }],
  TF2: [{ day: 'FRI', time: '17:00-17:50' }],
  TG1: [{ day: 'THU', time: '08:00-08:50' }],
  TG2: [{ day: 'WED', time: '18:00-18:50' }],
  TDD1: [{ day: 'FRI', time: '08:00-08:50' }],
  TDD2: [{ day: 'TUE', time: '18:00-18:50' }],
  TEE1: [{ day: 'WED', time: '08:00-08:50' }],
  TEE2: [{ day: 'FRI', time: '18:00-18:50' }],
  TFF1: [{ day: 'TUE', time: '08:00-08:50' }],
  TFF2: [{ day: 'THU', time: '18:00-18:50' }],

  SA1: [{ day: 'FRI', time: '15:00-15:50' }],
  SA2: [{ day: 'FRI', time: '09:00-09:50' }],
  SB1: [{ day: 'THU', time: '16:00-16:50' }],
  SB2: [{ day: 'THU', time: '11:00-11:50' }],
  SC1: [{ day: 'TUE', time: '16:00-16:50' }],
  SC2: [{ day: 'WED', time: '12:00-12:50' }],
  SD1: [{ day: 'WED', time: '16:00-16:50' }],
  SD2: [{ day: 'TUE', time: '10:00-10:50' }],
  SE1: [{ day: 'FRI', time: '16:00-16:50' }],
  SE2: [{ day: 'TUE', time: '09:00-09:50' }],
  SF1: [{ day: 'TUE', time: '15:00-15:50' }],
  SF2: [{ day: 'FRI', time: '10:00-10:50' }],

  L61: [{ day: 'MON', time: '08:00-08:50' }],
  L62: [{ day: 'MON', time: '08:50-09:40' }],
  L63: [{ day: 'MON', time: '09:50-10:40' }],
  L64: [{ day: 'MON', time: '10:40-11:30' }],
  L65: [{ day: 'MON', time: '11:40-12:30' }],
  L66: [{ day: 'MON', time: '12:30-13:10' }],
  L67: [{ day: 'MON', time: '14:00-14:50' }],
  L68: [{ day: 'MON', time: '14:50-15:40' }],
  L69: [{ day: 'MON', time: '15:50-16:40' }],
  L70: [{ day: 'MON', time: '16:40-17:30' }],
  L71: [{ day: 'MON', time: '17:40-18:30' }],
  L72: [{ day: 'MON', time: '18:30-19:10' }],

  L1: [{ day: 'TUE', time: '08:00-08:50' }],
  L2: [{ day: 'TUE', time: '08:50-09:40' }],
  L3: [{ day: 'TUE', time: '09:50-10:40' }],
  L4: [{ day: 'TUE', time: '10:40-11:30' }],
  L5: [{ day: 'TUE', time: '11:40-12:30' }],
  L6: [{ day: 'TUE', time: '12:30-13:10' }],
  L31: [{ day: 'TUE', time: '14:00-14:50' }],
  L32: [{ day: 'TUE', time: '14:50-15:40' }],
  L33: [{ day: 'TUE', time: '15:50-16:40' }],
  L34: [{ day: 'TUE', time: '16:40-17:30' }],
  L35: [{ day: 'TUE', time: '17:40-18:30' }],
  L36: [{ day: 'TUE', time: '18:30-19:10' }],

  L7: [{ day: 'WED', time: '08:00-08:50' }],
  L8: [{ day: 'WED', time: '08:50-09:40' }],
  L9: [{ day: 'WED', time: '09:50-10:40' }],
  L10: [{ day: 'WED', time: '10:40-11:30' }],
  L11: [{ day: 'WED', time: '11:40-12:30' }],
  L12: [{ day: 'WED', time: '12:30-13:10' }],
  L37: [{ day: 'WED', time: '14:00-14:50' }],
  L38: [{ day: 'WED', time: '14:50-15:40' }],
  L39: [{ day: 'WED', time: '15:50-16:40' }],
  L40: [{ day: 'WED', time: '16:40-17:30' }],
  L41: [{ day: 'WED', time: '17:40-18:30' }],
  L42: [{ day: 'WED', time: '18:30-19:10' }],

  L13: [{ day: 'THU', time: '08:00-08:50' }],
  L14: [{ day: 'THU', time: '08:50-09:40' }],
  L15: [{ day: 'THU', time: '09:50-10:40' }],
  L16: [{ day: 'THU', time: '10:40-11:30' }],
  L17: [{ day: 'THU', time: '11:40-12:30' }],
  L18: [{ day: 'THU', time: '12:30-13:10' }],
  L43: [{ day: 'THU', time: '14:00-14:50' }],
  L44: [{ day: 'THU', time: '14:50-15:40' }],
  L45: [{ day: 'THU', time: '15:50-16:40' }],
  L46: [{ day: 'THU', time: '16:40-17:30' }],
  L47: [{ day: 'THU', time: '17:40-18:30' }],
  L48: [{ day: 'THU', time: '18:30-19:10' }],

  L19: [{ day: 'FRI', time: '08:00-08:50' }],
  L20: [{ day: 'FRI', time: '08:50-09:40' }],
  L21: [{ day: 'FRI', time: '09:50-10:40' }],
  L22: [{ day: 'FRI', time: '10:40-11:30' }],
  L23: [{ day: 'FRI', time: '11:40-12:30' }],
  L24: [{ day: 'FRI', time: '12:30-13:10' }],
  L49: [{ day: 'FRI', time: '14:00-14:50' }],
  L50: [{ day: 'FRI', time: '14:50-15:40' }],
  L51: [{ day: 'FRI', time: '15:50-16:40' }],
  L52: [{ day: 'FRI', time: '16:40-17:30' }],
  L53: [{ day: 'FRI', time: '17:40-18:30' }],
  L54: [{ day: 'FRI', time: '18:30-19:10' }],

  L25: [{ day: 'SAT', time: '08:00-08:50' }],
  L26: [{ day: 'SAT', time: '08:50-09:40' }],
  L27: [{ day: 'SAT', time: '09:50-10:40' }],
  L28: [{ day: 'SAT', time: '10:40-11:30' }],
  L29: [{ day: 'SAT', time: '11:40-12:30' }],
  L30: [{ day: 'SAT', time: '12:30-13:10' }],
  L55: [{ day: 'SAT', time: '14:00-14:50' }],
  L56: [{ day: 'SAT', time: '14:50-15:40' }],
  L57: [{ day: 'SAT', time: '15:50-16:40' }],
  L58: [{ day: 'SAT', time: '16:40-17:30' }],
  L59: [{ day: 'SAT', time: '17:40-18:30' }],
  L60: [{ day: 'SAT', time: '18:30-19:10' }]
};

export default slotMappingFreshers;