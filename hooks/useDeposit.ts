import {
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "@web3modal/react";
import useCommunity from "./useCommunity";

const abi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

const useDeposit = (communityAddress: string) => {
  const { data } = useCommunity(communityAddress);
  const { chain } = useNetwork();
  const {
    error,
    write,
    data: writeData,
  } = useContractWrite({
    addressOrName: communityAddress,
    contractInterface: abi,
    functionName: "transfer",
  });
  const { receipt, isWaiting } = useWaitForTransaction({
    hash: writeData?.hash,
  });

  // amount in 10 ** 8
  const deposit = (amount: number) => {
    return write({
      addressOrName: data.tokenAddress,
      contractInterface: abi,
      functionName: "transfer",
      args: [communityAddress, amount * 10 ** 8],
      chainId: chain.id,
    });
  };

  return { deposit, error, receipt, isWaiting };
};

export default useDeposit;
