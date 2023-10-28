import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import Swap from "~~/components/Swap";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <main className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 space-y-6">
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold">Scroll 📜</span>
          </h1>
          <Swap />
        </div>
      </main>
    </>
  );
};

export default Home;
