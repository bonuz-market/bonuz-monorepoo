const truncateAddress = (address: string) => {
  const prefix = address.slice(0, 6);
  const suffix = address.slice(-8);

  return `${prefix}...${suffix}`;
};

export default truncateAddress;
