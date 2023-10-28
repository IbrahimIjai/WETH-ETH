import { useFeeData } from "wagmi";

function SwapFee() {
  const { data, isError, isLoading } = useFeeData({
    watch: true,
  });

  if (isLoading) return <span className="text-[12px] font-[485] text-[#9b9b9b]">~$0.00</span>;
  if (isError) return <div>Error fetching fee data</div>;
  const gasPrice = Number(data?.formatted.gasPrice);
  return <span className="text-[12px] font-[485] text-[#9b9b9b]">~${gasPrice.toFixed(3)}</span>;
}

export default SwapFee;
