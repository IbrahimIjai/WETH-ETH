import React from "react";
import Image from "next/image";
import { InputBase } from "../scaffold-eth";
import { NUMBER_REGEX } from "./utils";
import type { currencies } from "./utils";
import { useDarkMode } from "usehooks-ts";
import { useAccount } from "wagmi";
import useIsMounted from "~~/hooks/isMounted";
import { useAccountBalance, useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface Props {
  // isTop: boolean;
  isInput?: boolean;
  // token: "Wrapped Ether" | "Ether";
  token: currencies;
  value: string;
  setValue: (value: string) => void;
}

const SwapInputBox: React.FC<Props> = ({ isInput, token, value, setValue }) => {
  const { address } = useAccount();
  const isMounted = useIsMounted();
  const { isDarkMode } = useDarkMode();
  // console.log("this is darkmood", isDarkMode, !isDarkMode && !isInput);
  const account = isMounted && address ? address : "";
  const ticker = token === "NATIVE" ? "ETH" : "WETH";
  const icon = token === "NATIVE" ? ETHIcon : WETHIcon;
  // const isNative = token === "NATIVE";
  // console.log("this is ticker", isNative, token);

  return (
    <div
      className={`${
        isInput ? "bg-primary" : "bg-primary/50"
      } w-full px-4 py-3 border-[1px] border-gray-400 box-shadow-custom rounded-2xl dark:border-gray-700 `}
      // style={{ background: isInput ? "#000" : "" }}
    >
      <p className="text-[13px] font-[485] ">{ticker}</p>
      <div className="flex w-full gap-4 my-2">
        <div className="flex items-center justify-center gap-1">
          <Image src={icon} width={24} height={24} alt={`${ticker} Icon`} style={{ height: "24px", width: "24px" }} />
          <span>{ticker}</span>
        </div>
        <InputBase
          // placeholder={value ? value : "0"}
          darkText={!isDarkMode && !isInput}
          value={value ? value : "0"}
          onChange={value => setValue(value)}
          error={Boolean(value) && !NUMBER_REGEX.test(value)}
          disabled={!isInput}
        />
      </div>
      {address && <div className="text-[13px] font-[485] text-[#9b9b9b] flex items-center gap-2">
        <span>Balance:</span> <GetBalances address={account} token={token} />
      </div>}
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
  // console.log("WETH BALLANCE",  Number(data)/1e18.toFixed(3));
  if (token === "WETH9") {
    if (isLoadingWeth) return <span className="inline-flex w-8 h-4 rounded-sm animate-pulse bg-primary/40" />;
    if (isErrorWeth) return <span>Error</span>;
    return <span> {data !== undefined ? (Number(data) / 1e18).toFixed(6) : "Error fetching balance"}</span>;
  } else {
    if (isLoading) return <span className="inline-flex w-8 h-4 rounded-sm animate-pulse bg-primary/40" />;
    if (isError) return <span>Error</span>;
    return <span>{balance?.toFixed(6)}</span>;
  }
}

const ETHIcon = "https://tokens-data.1inch.io/images/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png";
const WETHIcon = "https://tokens-data.1inch.io/images/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png";
