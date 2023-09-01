import React from "react";
import { Button, Table } from "semantic-ui-react";
import Link from "next/link";
import Campaign from "../../../../ethereum/campaign";
import RequestRow from "../../../../components/RequestRow";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const RequestIndex = ({ address, requests, approversCount }) => {
  const { Header, Row, HeaderCell, Body } = Table;

  const renderRows = () => {
    return requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={address}
          approversCount={approversCount}
        />
      );
    });
  };
  return (
    <>
      <h3>Request List</h3>
      <Link href={`/campaigns/${address}/requests/new`}>
        <Button floated="right" style={{ marginBottom: 10 }} primary>
          Add Request
        </Button>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRows()}</Body>
      </Table>
      <div>Found {requests.length} requests.</div>
    </>
  );
};

RequestIndex.getInitialProps = async (props) => {
  const { address } = props.query;
  const campaign = Campaign(address);
  const requestCount = await campaign.methods.getRequestsCount().call();
  const approversCount = await campaign.methods.approversCount().call();
  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );

  return {
    address,
    requests,
    approversCount,
    requestCount,
  };
};

export default RequestIndex;
