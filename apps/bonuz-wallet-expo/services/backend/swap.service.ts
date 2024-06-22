export const getTokenDataByChainId = async (
  chainId: number,
  setSwapToken: any,
  setSwapDesToken: any,
  option: string,
) => {
  if (chainId === undefined) return 0;
  console.log('called');
  const res = await fetch(
    `https://aggregator-api.xy.finance/v1/recommendedTokens?chainId=${chainId}`,
    {
      method: 'GET',
      headers: {},
    },
  );
  const data = await res.json();
  console.log('data:', data.recommendedTokens);
  if (option === 'swap') setSwapToken(data.recommendedTokens[0]);
  else setSwapDesToken(data.recommendedTokens[0]);
  return data.recommendedTokens;
};
