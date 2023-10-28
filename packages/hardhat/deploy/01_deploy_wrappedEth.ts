
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployWETH9: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("WETH9", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    autoMine: true,
  });

};

export default deployWETH9;

deployWETH9.tags = ["WETH9"];
