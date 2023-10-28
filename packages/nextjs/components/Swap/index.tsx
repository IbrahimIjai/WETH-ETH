import { useState } from "react";
import Arrow from "../assets/Arrow";
import GasStation from "../assets/GasStation";
import SwapButton from "./SwapButton";
import SwapFee from "./SwapFee";
import SwapInputBox from "./SwapInputBox";
import { parseEther } from "viem";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const NUMBER_REGEX = /^\.?\d+\.?\d*$/;

const Swap = () => {
  const [action, setAction] = useState<"Wrap" | "Unwrap">("Wrap");
  const [value, setValue] = useState("");
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

  return (
    <section className="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 w-[480px] max-w-full">
      <p className="ml-3 mb-2">{action}</p>
      <SwapInputBox
        isTop={true}
        token={action === "Wrap" ? "Ether" : "Wrapped Ether"}
        value={value}
        setValue={setValue}
      />
      <div className="w-full relative my-1">
        <Arrow
          onClick={() => setAction(action === "Wrap" ? "Unwrap" : "Wrap")}
          className="p-2 rounded-lg bg-blue-950 w-[35px] h-[35px] cursor-pointer border-[#243c5a] border-[3px] m-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:rotate-180"
        />
      </div>
      <SwapInputBox
        isTop={false}
        token={action === "Unwrap" ? "Ether" : "Wrapped Ether"}
        value={value}
        setValue={setValue}
      />
      <div className="flex justify-end items-center gap-1 my-2">
        <GasStation /> <SwapFee />
      </div>
      <SwapButton
        action={action}
        value={value}
        swap={action === "Wrap" ? depositETH : withdrawETH}
        isLoading={action === "Wrap" ? isLoading : isLoadingWeth}
      />
    </section>
  );
};

export default Swap;
