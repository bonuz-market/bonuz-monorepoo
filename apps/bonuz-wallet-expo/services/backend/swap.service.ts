export const getTokenDataByChainId = async (
  chainId: number,
  setSwapToken: any,
  setSwapDesToken: any,
  swapTokenType: string,
) => {
  if (chainId === undefined) return [];
  const res = await fetch(
    `https://aggregator-api.xy.finance/v1/recommendedTokens?chainId=${chainId}`,
    {
      method: 'GET',
      headers: {},
    },
  );
  const data = await res.json();
  if (swapTokenType === 'sourceSwapToken') setSwapToken(data.recommendedTokens[0]);
  if (swapTokenType === 'desSwapToken') setSwapDesToken(data.recommendedTokens[0]);
  return data.recommendedTokens;
};
