const slotMapping = {
    A1: [
    { day: 'TUE', time: '09:00-09:50' },
    { day: 'SAT', time: '12:00-12:50' }
  ],
  A2: [
    { day: 'TUE', time: '15:00-15:50' },
    { day: 'THU', time: '16:00-16:50' }
  ],
  B1: [
    { day: 'TUE', time: '10:00-10:50' },
    { day: 'WED', time: '12:00-12:50' }
  ],
  B2: [
    { day: 'TUE', time: '16:00-16:50' },
    { day: 'WED', time: '17:00-17:50' }
  ],
  C1: [
    { day: 'THU', time: '09:00-09:50' },
    { day: 'SAT', time: '10:00-10:50' }
  ],
  C2: [
    { day: 'THU', time: '15:00-15:50' },
    { day: 'FRI', time: '14:00-14:50' }
  ],
  D1: [
    { day: 'TUE', time: '12:00-12:50' },
    { day: 'WED', time: '09:00-09:50' }
  ],
  D2: [
    { day: 'WED', time: '14:00-14:50' },
    { day: 'SAT', time: '14:00-14:50' }
  ],
  E1: [
    { day: 'WED', time: '11:00-11:50' },
    { day: 'SAT', time: '09:00-09:50' }
  ],
  E2: [
    { day: 'WED', time: '16:00-16:50' },
    { day: 'SAT', time: '15:00-15:50' }
  ],
  F1: [
    { day: 'WED', time: '10:00-10:50' },
    { day: 'FRI', time: '11:00-11:50' }
  ],
  F2: [
    { day: 'TUE', time: '14:00-14:50' },
    { day: 'FRI', time: '17:00-17:50' }
  ],
  G1: [
    { day: 'TUE', time: '11:00-11:50' },
    { day: 'SAT', time: '11:00-11:50' }
  ],
  G2: [
    { day: 'TUE', time: '17:00-17:50' },
    { day: 'WED', time: '15:00-15:50' }
  ],
  
    TA1: [{ day: 'FRI', time: '10:00-10:50' }],
  TA2: [{ day: 'FRI', time: '16:00-16:50' }],
  TB1: [{ day: 'FRI', time: '09:00-09:50' }],
  TB2: [{ day: 'FRI', time: '15:00-15:50' }],
  TC1: [{ day: 'TUE', time: '11:00-11:50' }],
  TC2: [{ day: 'TUE', time: '17:00-17:50' }],
  TD1: [{ day: 'THU', time: '10:00-10:50' }],
  TD2: [{ day: 'THU', time: '17:00-17:50' }],
  TE1: [{ day: 'FRI', time: '12:00-12:50' }],
  TE2: [{ day: 'THU', time: '14:00-14:50' }],
  TF1: [{ day: 'TUE', time: '11:00-11:50' }],
  TF2: [{ day: 'WED', time: '14:00-14:50' }],
  TG1: [{ day: 'THU', time: '10:00-10:50' }],
  TG2: [{ day: 'THU', time: '17:00-17:50' }],
  TAA1: [{ day: 'THU', time: '11:00-11:50' }],
  TAA2: [{ day: 'SAT', time: '16:00-16:50' }],
  TBB1: [{ day: 'THU', time: '12:00-12:50' }],
  TBB2: [{ day: 'SAT', time: '17:00-17:50' }],
  TCC1: [{ day: 'FRI', time: '08:00-08:50' }],
  TCC2: [{ day: 'WED', time: '18:00-18:50' }],
  TDD1: [{ day: 'SAT', time: '08:00-08:50' }],
  TDD2: [{ day: 'TUE', time: '18:00-18:50' }],
  TEE1: [{ day: 'THU', time: '08:00-08:50' }],
  TEE2: [{ day: 'FRI', time: '18:00-18:50' }],
  TFF1: [{ day: 'TUE', time: '08:00-08:50' }],
  TFF2: [{ day: 'SAT', time: '18:00-18:50' }],
  TGG1: [{ day: 'WED', time: '08:00-08:50' }],
  TGG2: [{ day: 'THU', time: '18:00-18:50' }],
  
    SC1: [{ day: 'WED', time: '16:00-16:50' }],
  SC2: [{ day: 'WED', time: '11:00-11:50' }],
  SD1: [{ day: 'SAT', time: '15:00-15:50' }],
  SD2: [{ day: 'FRI', time: '12:00-12:50' }],
  SE1: [{ day: 'THU', time: '14:00-14:50' }],
  SE2: [{ day: 'SAT', time: '09:00-09:50' }],
  
    CLUB: [
    { day: 'THU', time: '12:00-12:50' },
    { day: 'SAT', time: '17:00-17:50' }
  ],
    ECS: [
    { day: 'THU', time: '11:00-11:50' },
    { day: 'SAT', time: '16:00-16:50' }
  ],
  // === Lunch Slots ===
  Lunch: [
    { day: "TUE", time: '13:30-14:00'},
    { day: "WED", time: '13:30-14:00'},
    { day: "THU", time: '13:30-14:00'},
    { day: "FRI", time: '13:30-14:00'},
    { day: "SAT", time: '13:30-14:00'},
  ],
  
    L1:  [{ day: 'TUE', time: '08:00-08:50' }],
  L2:  [{ day: 'TUE', time: '09:00-09:50' }],
  L3:  [{ day: 'TUE', time: '10:00-10:50' }],
  L4:  [{ day: 'TUE', time: '11:00-11:50' }],
  L5:  [{ day: 'TUE', time: '12:00-12:50' }],
  L6:  [{ day: 'TUE', time: '12:50-13:30' }],
  
  L7:  [{ day: 'WED', time: '08:00-08:50' }],
  L8:  [{ day: 'WED', time: '09:00-09:50' }],
  L9:  [{ day: 'WED', time: '10:00-10:50' }],
  L10: [{ day: 'WED', time: '11:00-11:50' }],
  L11: [{ day: 'WED', time: '12:00-12:50' }],
  L12: [{ day: 'WED', time: '12:50-13:30' }],

  L13: [{ day: 'THU', time: '08:00-08:50' }],
  L14: [{ day: 'THU', time: '09:00-09:50' }],
  L15: [{ day: 'THU', time: '10:00-10:50' }],
  L16: [{ day: 'THU', time: '11:00-11:50' }],
  L17: [{ day: 'THU', time: '12:00-12:50' }],
  L18: [{ day: 'THU', time: '12:50-13:30' }],

  L19: [{ day: 'FRI', time: '08:00-08:50' }],
  L20: [{ day: 'FRI', time: '09:00-09:50' }],
  L21: [{ day: 'FRI', time: '10:00-10:50' }],
  L22: [{ day: 'FRI', time: '11:00-11:50' }],
  L23: [{ day: 'FRI', time: '12:00-12:50' }],
  L24: [{ day: 'FRI', time: '12:50-13:30' }],

  L25: [{ day: 'SAT', time: '08:00-08:50' }],
  L26: [{ day: 'SAT', time: '09:00-09:50' }],
  L27: [{ day: 'SAT', time: '10:00-10:50' }],
  L28: [{ day: 'SAT', time: '11:00-11:50' }],
  L29: [{ day: 'SAT', time: '12:00-12:50' }],
  L30: [{ day: 'SAT', time: '12:50-13:30' }],

  L31: [{ day: 'TUE', time: '14:00-14:50' }],
  L32: [{ day: 'TUE', time: '15:00-15:50' }],
  L33: [{ day: 'TUE', time: '16:00-16:50' }],
  L34: [{ day: 'TUE', time: '17:00-17:50' }],
  L35: [{ day: 'TUE', time: '18:00-18:50' }],
  L36: [{ day: 'TUE', time: '19:00-19:30' }],

  L37: [{ day: 'WED', time: '14:00-14:50' }],
  L38: [{ day: 'WED', time: '15:00-15:50' }],
  L39: [{ day: 'WED', time: '16:00-16:50' }],
  L40: [{ day: 'WED', time: '17:00-17:50' }],
  L41: [{ day: 'WED', time: '18:00-18:50' }],
  L42: [{ day: 'WED', time: '19:00-19:30' }],

  L43: [{ day: 'THU', time: '14:00-14:50' }],
  L44: [{ day: 'THU', time: '15:00-15:50' }],
  L45: [{ day: 'THU', time: '16:00-16:50' }],
  L46: [{ day: 'THU', time: '17:00-17:50' }],
  L47: [{ day: 'THU', time: '18:00-18:50' }],
  L48: [{ day: 'THU', time: '19:00-19:30' }],

  L49: [{ day: 'FRI', time: '14:00-14:50' }],
  L50: [{ day: 'FRI', time: '15:00-15:50' }],
  L51: [{ day: 'FRI', time: '16:00-16:50' }],
  L52: [{ day: 'FRI', time: '17:00-17:50' }],
  L53: [{ day: 'FRI', time: '18:00-18:50' }],
  L54: [{ day: 'FRI', time: '19:00-19:30' }],

  L55: [{ day: 'SAT', time: '14:00-14:50' }],
  L56: [{ day: 'SAT', time: '15:00-15:50' }],
  L57: [{ day: 'SAT', time: '16:00-16:50' }],
  L58: [{ day: 'SAT', time: '17:00-17:50' }],
  L59: [{ day: 'SAT', time: '18:00-18:50' }],
  L60: [{ day: 'SAT', time: '19:00-19:30' }],
};

export default slotMapping;