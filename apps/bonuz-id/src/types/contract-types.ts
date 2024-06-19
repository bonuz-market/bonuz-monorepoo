// "VOUCHER";
// "POA";
// "LOYALTY";
// "CERTIFICATE";
// "MEMBERSHIP";

export enum ProgramType {
  VOUCHER = 'VOUCHER', // ==> createVoucherProgram
  POA = 'POA', // ==> createEvent
  LOYALTY = 'LOYALTY', // ==> createLoyaltyProgram
  CERTIFICATE = 'CERTIFICATE', // ==> createCourse
  MEMBERSHIP = 'MEMBERSHIP', // ==> createCommunity
}

export enum ProgramCategory {
  VOUCHER_PROGRAM = 'VoucherProgram',
  EVENT = 'Event',
  COURSE = 'Course',
  LOYALTY_PROGRAM = 'LoyaltyProgram',
  COMMUNITY = 'Community',
}

// type hyGraphCategory = 'Vouchers' | 'Loyalty_Programs' | 'Events' | 'Certificates' | 'Memberships'
export const attributeToTabMap: Record<string, ProgramCategory> = {
  Vouchers: ProgramCategory.VOUCHER_PROGRAM,
  Loyalty_Programs: ProgramCategory.LOYALTY_PROGRAM,
  Events: ProgramCategory.EVENT,
  Certificates: ProgramCategory.COURSE,
  Memberships: ProgramCategory.COMMUNITY,
};

export const programWriteFunctionMap: { [key in ProgramType]: string } = {
  [ProgramType.VOUCHER]: 'createVoucherProgram',
  [ProgramType.POA]: 'createEvent',
  [ProgramType.LOYALTY]: 'createLoyaltyProgram',
  [ProgramType.CERTIFICATE]: 'createCourse',
  [ProgramType.MEMBERSHIP]: 'createCommunity',
};

export const programReadFunctionMap: { [key in ProgramType]: string } = {
  [ProgramType.VOUCHER]: 'getVoucherPrograms',
  [ProgramType.POA]: 'getEvents',
  [ProgramType.LOYALTY]: 'getLoyaltyPrograms',
  [ProgramType.CERTIFICATE]: 'getCourses',
  [ProgramType.MEMBERSHIP]: 'getCommunities',
};
