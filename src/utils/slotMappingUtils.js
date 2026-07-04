import slotMappingWinterFall from '../data/slotMappingWinterFall';
import slotMappingFreshers from '../data/slotMappingFreshers';
import slotMappingSummer from '../data/slotMappingSummer';
import slotMappingLongSummer from '../data/slotMappingLongSummer';

const customKey = (semester) => `customSlotMapping_${semester}`;

export const getSlotMappingForSemester = (semester) => {
  try {
    const custom = localStorage.getItem(customKey(semester));
    if (custom) return JSON.parse(custom);
  } catch {
    // fall through to built-in mapping
  }
  switch (semester) {
    case 'win':
    case 'fall':
      return slotMappingWinterFall;
    case 'win_freshers':
    case 'fall_freshers':
      return slotMappingFreshers;
    case 'summ1':
    case 'summ2':
      return slotMappingSummer;
    case 'long-summ':
      return slotMappingLongSummer;
    default:
      return slotMappingWinterFall;
  }
};

export const saveCustomSlotMapping = (semester, mapping) =>
  localStorage.setItem(customKey(semester), JSON.stringify(mapping));

export const hasCustomSlotMapping = (semester) => !!localStorage.getItem(customKey(semester));

export const clearCustomSlotMapping = (semester) => localStorage.removeItem(customKey(semester));
