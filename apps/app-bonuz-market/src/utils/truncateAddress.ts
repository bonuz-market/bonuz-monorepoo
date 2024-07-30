const truncateAddress = (address: string) => {
  const prefix = address.slice(0, 3);
  const suffix = address.slice(-3);

  return `${prefix}...${suffix}`;
};

export default truncateAddress;
