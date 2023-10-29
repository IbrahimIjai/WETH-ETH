import { useEffect, useState } from "react";
import Arrow from "../assets/Arrow";
import GasStation from "../assets/GasStation";
import SwapButton from "./SwapButton";
import SwapFee from "./SwapFee";
import SwapInputBox from "./SwapInputBox";
import type { currencies } from "./utils";
import { NUMBER_REGEX } from "./utils";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useAccountBalance, useScaffoldContractRead } from "~~/hooks/scaffold-eth";

// export const NUMBER_REGEX = /^\.?\d+\.?\d*$/;

const Swap = () => {
  const { address } = useAccount();
  const [action, setAction] = useState<"Wrap" | "Unwrap">("Wrap");
  const [value, setValue] = useState("");
  const [outPutCurValue, setoutPutCurValue] = useState("");
  const [inputCur, setInputCur] = useState<currencies>("NATIVE");
  const [outPutCur, setOutPutCur] = useState<currencies>("WETH9");

  const { writeAsync: depositETH, isLoading } = useScaffoldContractWrite({
    contractName: "WETH9",
    functionName: "deposit",
    value: NUMBER_REGEX.test(value) ? parseEther(value) : undefined,
  });
  const { writeAsync: withdrawETH, isLoading: isLoadingWeth } = useScaffoldContractWrite({
    contractName: "WETH9",
    functionName: "withdraw",
    args: [NUMBER_REGEX.test(value) ? parseEther(value) : undefined],
  });

  const flip = () => {
    setAction(action === "Wrap" ? "Unwrap" : "Wrap");
    console.log("new action", action);
  };

  const { balance: balanceETH, isError: isErrorEthBal, isLoading: isLoadingEthBal } = useAccountBalance(address);
  const {
    data: balanceWETH,
    isError: isErrorWethBal,
    isLoading: isLoadingWethBal,
  } = useScaffoldContractRead({ contractName: "WETH9", functionName: "balanceOf", args: [address] });

  const balanceLoading = isLoadingEthBal && isLoadingWethBal;
  const isBalanceFetchingError = isErrorEthBal && isErrorWethBal;
  useEffect(() => {
    // ()=>{
    setoutPutCurValue(value);
    // console.log("this is value", value);
    // console.log("this is outputcur", outPutCurValue);
    if (action === "Wrap") {
      setInputCur("NATIVE");
      setOutPutCur("WETH9");
    } else {
      setInputCur("WETH9");
      setOutPutCur("NATIVE");
    }
    // }
  }, [value, action]);

  return (
    <section className="rounded-lg bg-base-100 border border-gray-400 dark:border-gray-700 p-2 lg:w-[480px] max-w-full">
      <p className="mb-2 ml-3">{action}</p>
      <SwapInputBox
        // isTop={true}
        isInput
        // token={action === "Wrap" ? "Ether" : "Wrapped Ether"}
        token={inputCur}
        value={value}
        setValue={setValue}
      />
      <div className="relative w-full my-1">
        <Arrow
          onClick={flip}
          className="p-2 rounded-lg bg-secondary w-[35px] h-[35px] cursor-pointer border-[#243c5a] border-[3px] m-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:rotate-180"
        />
      </div>
      <SwapInputBox
        token={outPutCur}
        value={outPutCurValue}
        setValue={setValue}
      />
      <div className="flex items-center justify-end gap-1 my-2">
        <GasStation /> <SwapFee />
      </div>
      <SwapButton
        inputCur={inputCur}
        action={action}
        value={value}
        swap={action === "Wrap" ? depositETH : withdrawETH}
        isLoading={action === "Wrap" ? isLoading : isLoadingWeth}
        isBalanceLoading={balanceLoading}
        wethBalance={Number(balanceWETH)}
        ethBalance={Number(balanceETH)}
        isBalanceFetchingError={isBalanceFetchingError}
      />
    </section>
  );
};

export default Swap;
