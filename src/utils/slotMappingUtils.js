import slotMappingWinterFall from '../data/slotMappingWinterFall';
import slotMappingFreshers from '../data/slotMappingFreshers';
import slotMappingSummer from '../data/slotMappingSummer';
import slotMappingLongSummer from '../data/slotMappingLongSummer';

export const getSlotMappingForSemester = (semester) => {
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
      return slotMappingWinterFall; // fallback to winter/fall mapping
  }
};