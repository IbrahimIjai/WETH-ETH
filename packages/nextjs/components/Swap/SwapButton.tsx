import React from "react";
import { GetBalances } from "./SwapInputBox";
import { NUMBER_REGEX } from "./utils";
import type { actionType } from "./utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { scroll } from "viem/chains";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

type SwapButtonProps = {
  action: actionType;
  swap: () => void;
  isLoading: boolean;
  value: string;
};

const SwapButton: React.FC<SwapButtonProps> = ({ action, swap, isLoading, value }) => {
  const { isConnected, isConnecting } = useAccount();
  const { chain: connectedChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { openConnectModal } = useConnectModal();
  const { data: Balances } = GetBalances({ token: "All" });
  const inSufficientFunds =
    action === "Wrap" ? Balances.ethBalance < Number(value) : Balances.wethBalance < Number(value);

  return (
    <>
      {isConnected && connectedChain ? (
        <button
          className="w-full py-2 text-center rounded-lg cursor-pointer btn btn-secondary"
          onClick={() => swap()}
          disabled={isLoading || !NUMBER_REGEX.test(value) || inSufficientFunds || value === ""}
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
