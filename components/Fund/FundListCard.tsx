import Link from "next/link";
import CommunityItem from "../Community/CommunityItem";
import Card from "../Layout/Card";

interface FundListCardProps {
  funds: string[];
  title: string;
  defaultUrl: string;
  baseUrl: string;
}

const FundListCard = ({
  funds,
  title,
  defaultUrl,
  baseUrl,
}: FundListCardProps) => {
  if (funds.length === 0) {
    return (
      <Card title={title} className="mt-0">
        <div>
          <p>No funds found :(</p>
          <Link href={defaultUrl} passHref>
            <a className="link">Click here to see a default fund</a>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card title={title} className="mt-0">
      <ul className="list-disc list-inside">
        {funds.map((community) => (
          <CommunityItem
            key={community}
            address={community}
            baseURL={baseUrl}
          />
        ))}
      </ul>
    </Card>
  );
};

export default FundListCard;
