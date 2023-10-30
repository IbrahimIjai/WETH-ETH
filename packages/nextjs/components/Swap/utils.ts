//TYPES
export type tokenType = "Ether" | "Wrapped Ether" | "All";
export type actionType = "Wrap" | "Unwrap";

// UTILS

export const NUMBER_REGEX = /^\.?\d+\.?\d*$/;
export const stripWeth = (token: bigint | undefined) => {
  let weth = 0;
  if (token !== undefined) {
    const _weth = Number(token) / 1e18;
    _weth === 0 ? (weth = 0) : (weth = _weth).toFixed(4);
  }
  return weth;
};
