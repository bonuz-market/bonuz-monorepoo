/* eslint-disable @typescript-eslint/ban-ts-comment */
export const isWalletAddress = (handle: string): boolean =>
  handle.startsWith('0x') && handle.length === 42;

// -------------------------------------------------
// function hasNonEmptyLink(messengers: Record<string, { link: string }>) {
//   return Object.values(messengers).some((messenger) => messenger.link !== '');
// }

export function hasNonEmptyLink(data: any) {
  if (!data) return false;
  const values = Object.values(data);
  // @ts-ignore
  return values.some((platform) => platform.link !== '');
}
