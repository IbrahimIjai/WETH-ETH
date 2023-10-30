import { useState } from "react";
import Arrow from "../assets/Arrow";
import GasStation from "../assets/GasStation";
import SwapButton from "./SwapButton";
import SwapFee from "./SwapFee";
import SwapInputBox from "./SwapInputBox";
import type { actionType } from "./utils";
import { NUMBER_REGEX } from "./utils";
import { parseEther } from "viem";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const Swap = () => {
  const [action, setAction] = useState<actionType>("Wrap");
  const [value, setValue] = useState("");

  // Blockcalls
  const { writeAsync: depositETH, isLoading: isWrapping } = useScaffoldContractWrite({
    contractName: "WETH9",
    functionName: "deposit",
    value: NUMBER_REGEX.test(value) ? parseEther(value) : undefined,
  });
  const { writeAsync: withdrawETH, isLoading: isUnwrapping } = useScaffoldContractWrite({
    contractName: "WETH9",
    functionName: "withdraw",
    args: [NUMBER_REGEX.test(value) ? parseEther(value) : undefined],
  });

  return (
    <section className="rounded-lg bg-base-100 border border-gray-400 dark:border-gray-700 p-2 lg:w-[480px] max-w-full">
      <p className="mb-2 ml-3">{action}</p>
      <SwapInputBox isInput token={action === "Wrap" ? "Ether" : "Wrapped Ether"} value={value} setValue={setValue} />
      <div className="relative w-full my-1">
        <Arrow
          onClick={() => setAction(action === "Wrap" ? "Unwrap" : "Wrap")}
          className="p-2 rounded-lg bg-secondary w-[35px] h-[35px] cursor-pointer border-[#243c5a] border-[3px] m-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:rotate-180"
        />
      </div>
      <SwapInputBox token={action === "Wrap" ? "Wrapped Ether" : "Ether"} value={value} setValue={setValue} />
      <div className="flex items-center justify-end gap-1 my-2">
        <GasStation /> <SwapFee />
      </div>
      <SwapButton
        action={action}
        value={value}
        swap={action === "Wrap" ? depositETH : withdrawETH}
        isLoading={action === "Wrap" ? isWrapping : isUnwrapping}
      />
    </section>
  );
};

export default Swap;
