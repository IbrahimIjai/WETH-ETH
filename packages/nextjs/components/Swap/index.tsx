import { useState } from "react";
import Arrow from "../assets/Arrow";
import GasStation from "../assets/GasStation";
import SwapInputBox from "./SwapInputBox";

const Swap = () => {
  const [action, setAction] = useState<"Wrap" | "Unwrap">("Wrap");
  const [value, setValue] = useState("");

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
        <GasStation /> <span className="text-[12px] font-[485] text-[#9b9b9b]">~$0.00</span>
      </div>
      <div className="w-full py-2 bg-blue-950 text-center rounded-lg cursor-pointer">Swap</div>
    </section>
  );
};

export default Swap;
