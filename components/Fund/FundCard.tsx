import { ReactNode } from "react";

interface FundCardProps {
  title?: string;
  amount?: number;
  symbol?: string;
  description?: string; // description of person who performed last transaction
  children?: ReactNode;
}

const FundCard = ({
  amount,
  title,
  symbol = "ETH",
  description,
  children,
}: FundCardProps) => {
  return (
    <div className="pt-4 px-4 pb-6 bg-white rounded shadow w-full m-2 mt-1">
      {title && (
        <h3 className="font-semibold text-xl text-gray-600 mb-2">{title}</h3>
      )}
      {amount && symbol && (
        <span className="font-bold text-3xl">
          {amount} {symbol}
        </span>
      )}
      {description && <p className="text-blue-700">{description}</p>}
      {children}
    </div>
  );
};

export default FundCard;