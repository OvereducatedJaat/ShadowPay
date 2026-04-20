import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import chalk from "chalk";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { fhenixjs, ethers } = hre;
  const { deploy } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();

  console.log(chalk.blue(`Deploying ShadowPay from ${deployer}`));

  // Tax Authority is an arbitrary address for testing
  const taxAuthority = ethers.Wallet.createRandom().address;

  const shadowPay = await deploy("ShadowPay", {
    from: deployer,
    args: [taxAuthority],
    log: true,
    skipIfAlreadyDeployed: false,
  });

  console.log(`ShadowPay deployed to: ${shadowPay.address}`);
  console.log(`Tax Authority address set to: ${taxAuthority}`);
  console.log("Ready to interact with Fhenix FHE contracts!");
};

export default func;
func.id = "deploy_shadowpay";
func.tags = ["ShadowPay"];
