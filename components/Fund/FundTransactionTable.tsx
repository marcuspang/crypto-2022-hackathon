import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { useProvider } from "@web3modal/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CommunityEvent } from "../../pages/api/events";
import truncateEthAddress from "../../utils/truncateEthAddress";
import Pagination from "../Layout/Pagination";
import Spinner from "../Layout/Spinner";

export interface FundTransactionRow extends CommunityEvent {
  date: Date;
  method: "Deposit" | "Withdrawal";
}

interface FundTransactionTableProps {
  data: FundTransactionRow[];
}

const FundTransactionTable = ({ data }: FundTransactionTableProps) => {
  const provider = useProvider();
  const [pageIndex, setPageIndex] = useState(0);
  const [rows, setRows] = useState(data);
  // no. of transactions in each page
  const PAGE_SIZE = 10;
  // no. of pages to display at any point of time
  const PAGE_COUNT = Math.ceil(data.length / PAGE_SIZE);

  useEffect(() => {
    const updateRows = async () => {
      if (provider && rows.length !== 0) {
        // @ts-ignore
        // FIXME: need to convert block number to date
        setRows((prev) =>
          Promise.all(
            prev.map(async (row) => {
              const block = await provider.getBlock(row.blockNumber);
              return { ...row, date: new Date(block.timestamp * 1000) };
            })
          )
        );
      }
    };
    updateRows();
  }, [data, provider]);

  return (
    <>
      <div className="overflow-x-auto relative shadow sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                Account
              </th>
              <th scope="col" className="py-3 px-6">
                Date
              </th>
              <th scope="col" className="py-3 px-6">
                Method
              </th>
              <th scope="col" className="py-3 px-6">
                Amount
              </th>
              <th scope="col">View Tx</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length !== 0 ? (
              data
                .slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE)
                .map((transaction, index) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    key={index}
                  >
                    <td
                      scope="row"
                      className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <Link
                        href={
                          "https://goerli.etherscan.io/address/" +
                          transaction.from
                        }
                        passHref
                      >
                        <a className="link" target={"_blank"} rel="noopener">
                          {truncateEthAddress(transaction.from)}
                          <ArrowTopRightOnSquareIcon
                            height={16}
                            width={16}
                            className="inline-block ml-1 mb-1"
                          />
                        </a>
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      {(transaction.date || new Date()).toLocaleDateString()}
                    </td>
                    <td
                      className={`py-4 px-6 font-bold ${
                        transaction.method === "Deposit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.method}
                    </td>
                    <td className="py-4 px-6">{transaction.value}</td>
                    <td className="text-left">
                      <Link
                        href={
                          "https://goerli.etherscan.io/tx/" +
                          transaction.address
                        }
                        passHref
                      >
                        <a className="link" target={"_blank"} rel="noopener">
                          <ArrowTopRightOnSquareIcon
                            height={16}
                            width={16}
                            className="inline-block ml-1 mb-1"
                          />
                        </a>
                      </Link>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td>
                  <div className="flex p-2">
                    <Spinner />
                  </div>
                </td>
                <td>
                  <div className="flex p-2">
                    <Spinner />
                  </div>
                </td>
                <td>
                  <div className="flex p-2">
                    <Spinner />
                  </div>
                </td>
                <td>
                  <div className="flex p-2">
                    <Spinner />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        data={data}
        pageCount={PAGE_COUNT}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        pageSize={PAGE_SIZE}
      />
    </>
  );
};

export default FundTransactionTable;
