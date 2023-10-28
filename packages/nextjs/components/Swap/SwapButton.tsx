import React from "react";
import { NUMBER_REGEX } from ".";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { hardhat, scroll } from "viem/chains";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

type SwapButtonProps = {
  action: "Wrap" | "Unwrap";
  swap: () => void;
  isLoading: boolean;
  value: string;
};

const SwapButton: React.FC<SwapButtonProps> = ({ action, swap, isLoading, value }) => {
  const { isConnected, isConnecting } = useAccount();
  const { chain: connectedChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { openConnectModal } = useConnectModal();
  /* 
      <div className="w-full py-2 bg-blue-950 text-center rounded-lg cursor-pointer">Swap</div>
 */
  console.log(scroll);

  return (
    <>
      {isConnected && connectedChain && connectedChain.id === hardhat.id ? (
        <button
          className="w-full py-2 bg-blue-950 text-center rounded-lg cursor-pointer"
          onClick={() => swap()}
          disabled={isLoading || !NUMBER_REGEX.test(value)}
        >
          {isLoading ? <span className="loading loading-spinner loading-sm"></span> : <span>{action}</span>}
        </button>
      ) : connectedChain ? (
        <button
          className="w-full py-2 bg-blue-950 text-center rounded-lg cursor-pointer flex items-center justify-center gap-2"
          type="button"
          onClick={() => switchNetwork?.(hardhat.id)}
        >
          <ArrowsRightLeftIcon className="h-6 w-4 ml-2 sm:ml-0" />
          <span className="whitespace-nowrap">Switch to Scroll</span>
        </button>
      ) : (
        <button
          onClick={openConnectModal}
          disabled={isConnecting}
          className="w-full py-2 bg-blue-950 text-center rounded-lg cursor-pointer"
        >
          {isConnecting && <span className="loading loading-spinner loading-sm"></span>}
          <span>Connect Wallet</span>
        </button>
      )}
    </>
  );
};

export default SwapButton;
