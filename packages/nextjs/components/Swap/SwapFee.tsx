import { useFeeData } from "wagmi";
import useIsMounted from "~~/hooks/isMounted";

function SwapFee() {
  const isMouted = useIsMounted();
  //fix hydration error
  const { data, isError, isLoading } = useFeeData({
    watch: true,
  });

  if (isMouted && isLoading) return <span className="text-[12px] font-[485] text-[#9b9b9b]">~$0.00</span>;
  if (isMouted && isError) return <div>Error fetching fee data</div>;
  // const gasPrice = Number(data?.formatted.gasPrice);
  if (isMouted && data)
    return (
      <span className="text-[12px] font-[485] text-[#9b9b9b]">~${Number(data?.formatted.gasPrice).toFixed(3)}</span>
    );
}

export default SwapFee;
