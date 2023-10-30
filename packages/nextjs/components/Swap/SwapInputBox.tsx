import React from "react";
import Image from "next/image";
import { InputBase } from "../scaffold-eth";
import { NUMBER_REGEX, stripWeth } from "./utils";
import type { tokenType } from "./utils";
import { useDarkMode } from "usehooks-ts";
import { useAccount } from "wagmi";
import useIsMounted from "~~/hooks/isMounted";
import { useAccountBalance, useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface Props {
  isInput?: boolean;
  token: tokenType;
  value: string;
  setValue: (value: string) => void;
}

const SwapInputBox: React.FC<Props> = ({ isInput, token, value, setValue }) => {
  const { isDarkMode } = useDarkMode();
  const ticker = token === "Ether" ? "ETH" : "WETH";
  const icon = token === "Ether" ? ETHIcon : WETHIcon;
  const { jsx: Balance } = GetBalances({ token });

  return (
    <div
      className={`${
        isInput ? "bg-primary" : "bg-primary/50"
      } w-full px-4 py-3 border-[1px] border-gray-400 box-shadow-custom rounded-2xl dark:border-gray-700 `}
    >
      <p className="text-[13px] font-[485] ">{token}</p>
      <div className="flex w-full gap-4 my-2">
        <div className="flex items-center justify-center gap-1">
          <Image src={icon} width={24} height={24} alt={`${ticker} Icon`} style={{ height: "24px", width: "24px" }} />
          <span>{ticker}</span>
        </div>
        <InputBase
          placeholder="0"
          darkText={!isDarkMode && !isInput}
          value={value}
          onChange={value => setValue(value)}
          error={Boolean(value) && !NUMBER_REGEX.test(value)}
          disabled={!isInput}
        />
      </div>
      <div className="text-[13px] font-[485] text-[#9b9b9b] flex items-center gap-2">
        <span>Balance:</span> {Balance}
      </div>
    </div>
  );
};

export default SwapInputBox;

export function GetBalances({ token }: { token: tokenType }) {
  const { address } = useAccount();
  const isMounted = useIsMounted();
  const account = isMounted && address ? address : "";
  const { balance, isError, isLoading } = useAccountBalance(account);
  const {
    data,
    isError: isErrorWeth,
    isLoading: isLoadingWeth,
  } = useScaffoldContractRead({ contractName: "WETH9", functionName: "balanceOf", args: [account] });

  let jsxToRender = <span>0.00</span>;
  let balanceData = { ethBalance: 0, wethBalance: 0 };

  if (token === "All")
    balanceData = {
      ethBalance: Number(balance?.toFixed(4) as string),
      wethBalance: stripWeth(data),
    };
  else if (token === "Wrapped Ether") {
    if (isLoadingWeth) jsxToRender = <span className="inline-flex w-8 h-4 rounded-sm animate-pulse bg-primary/40" />;
    if (isErrorWeth) jsxToRender = <span>Error</span>;
    jsxToRender = <span> {data !== undefined ? stripWeth(data) : "0"}</span>;
  } else {
    if (isLoading) jsxToRender = <span className="inline-flex w-8 h-4 rounded-sm animate-pulse bg-primary/40" />;
    if (isError) jsxToRender = <span>Error</span>;
    jsxToRender = <span>{balance ? balance.toFixed(4) : "0"}</span>;
  }
  return { jsx: jsxToRender, data: balanceData };
}

const ETHIcon = "https://tokens-data.1inch.io/images/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png";
const WETHIcon = "https://tokens-data.1inch.io/images/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png";
