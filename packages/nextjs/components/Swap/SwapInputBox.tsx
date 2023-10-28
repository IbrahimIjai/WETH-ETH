import React from "react";
import Image from "next/image";
import { NUMBER_REGEX } from ".";
import { InputBase } from "../scaffold-eth";
import { useAccount } from "wagmi";
import useIsMounted from "~~/hooks/isMounted";
import { useAccountBalance, useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface Props {
  isTop: boolean;
  token: "Wrapped Ether" | "Ether";
  value: string;
  setValue: (value: string) => void;
}

const SwapInputBox: React.FC<Props> = props => {
  const { address } = useAccount();
  const isMounted = useIsMounted();
  const account = isMounted && address ? address : "";
  const { isTop, token, value, setValue } = props;
  const ticker = token === "Ether" ? "ETH" : "WETH";
  const icon = token === "Ether" ? ETHIcon : WETHIcon;

  return (
    <div
      className="px-4 py-3 w-full box-shadow-custom rounded-2xl border-2 border-gray-200 dark:border-gray-700"
      style={{ background: isTop ? "#000" : "" }}
    >
      <p className="text-[13px] font-[485] text-[#9b9b9b]">{token}</p>
      <div className="my-2 w-full flex gap-4">
        <div className="flex items-center justify-center gap-1">
          <Image src={icon} width={24} height={24} alt={`${ticker} Icon`} style={{ height: "24px", width: "24px" }} />
          <span>{ticker}</span>
        </div>
        <InputBase
          placeholder="0"
          value={value}
          onChange={value => setValue(value)}
          error={Boolean(value) && !NUMBER_REGEX.test(value)}
          disabled={!isTop}
        />
      </div>
      <p className="text-[13px] font-[485] text-[#9b9b9b]">
        Balance: <GetBalances address={account} token={token} />
      </p>
    </div>
  );
};

export default SwapInputBox;

function GetBalances({ address, token }: { address: string; token: string }) {
  const { balance, isError, isLoading } = useAccountBalance(address);
  const {
    data,
    isError: isErrorWeth,
    isLoading: isLoadingWeth,
  } = useScaffoldContractRead({ contractName: "WETH9", functionName: "balanceOf", args: [address] });
  if (token === "Wrapped Ether") {
    if (isLoadingWeth) return <span>Loading...</span>;
    if (isErrorWeth) return <span>Error</span>;
    return <span>{data?.toString()}</span>;
  } else {
    if (isLoading) return <span>Loading...</span>;
    if (isError) return <span>Error</span>;
    return <span>{balance}</span>;
  }
}

const ETHIcon = "https://tokens-data.1inch.io/images/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png";
const WETHIcon = "https://tokens-data.1inch.io/images/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png";
