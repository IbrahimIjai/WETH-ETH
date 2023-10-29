import React, { useEffect, useState } from "react";
import { NUMBER_REGEX } from "./utils";
import type { currencies } from "./utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { scroll } from "viem/chains";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

type SwapButtonProps = {
  action: "Wrap" | "Unwrap";
  swap: () => void;
  isLoading: boolean;
  value: string;
  inputCur?: currencies;
  wethBalance: number | null;
  ethBalance: number | null;
  isBalanceLoading?: boolean;
  isBalanceFetchingError?: boolean;
};

const SwapButton: React.FC<SwapButtonProps> = ({
  action,
  swap,
  isLoading,
  value,
  inputCur,
  ethBalance,
  wethBalance,
}) => {
  const { isConnected, isConnecting } = useAccount();
  const { chain: connectedChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { openConnectModal } = useConnectModal();
  const [inSufficientFunds, setInSufficientFunds] = useState(false);

  // console.log("this is currency type Input", inputCur);
  useEffect(() => {
    if (inputCur === "NATIVE" && ethBalance !== null) {
      if (Number(value) > ethBalance) {
        console.log("INSUFFICIENT FUNDS");
        setInSufficientFunds(true);
        console.log(inSufficientFunds);
      } else {
        setInSufficientFunds(false);
      }
    } else if (inputCur === "WETH9" && wethBalance !== null) {
      if (Number(value) > wethBalance) {
        console.log("INSUFFICIENT FUNDS");
        setInSufficientFunds(true);
        console.log(inSufficientFunds);
      } else {
        setInSufficientFunds(false);
      }
    }
  }, [value, inputCur, ethBalance, wethBalance]);

  return (
    <>
      {isConnected && connectedChain ? (
        <button
          className="w-full py-2 text-center rounded-lg cursor-pointer btn btn-secondary"
          onClick={() => swap()}
          disabled={isLoading || !NUMBER_REGEX.test(value) || inSufficientFunds || value==""}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : !value ? (
            <span>Enter Amount</span>
          ) : (
            <span>{inSufficientFunds ? "Insufficient Balance" : action}</span>
          )}
        </button>
      ) : connectedChain && connectedChain?.id !== scroll.id ? (
        <button
          className="flex items-center justify-center w-full gap-2 py-2 text-center rounded-lg btn btn-secondary"
          type="button"
          onClick={() => switchNetwork?.(scroll.id)}
        >
          <ArrowsRightLeftIcon className="w-4 h-6 ml-2 sm:ml-0" />
          <span className="whitespace-nowrap">Switch to Scroll</span>
        </button>
      ) : (
        <button
          onClick={openConnectModal}
          disabled={isConnecting}
          className="w-full py-2 text-center rounded-lg cursor-pointer btn btn-secondary"
        >
          {isConnecting && <span className="loading loading-spinner loading-sm"></span>}
          <span>Connect Wallet</span>
        </button>
      )}
    </>
  );
};

export default SwapButton;
