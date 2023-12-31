import React from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const RequestRow = ({ id, request, approversCount, address }) => {
  const { Row, Cell } = Table;
  const readyToFinalize =
    parseFloat(request.approvalCount) > parseFloat(approversCount) / 2;

  const onApprove = async () => {
    const campaign = Campaign(address);
    const accounts = await web3.eth.getAccounts();

    console.log(campaign);

    await campaign.methods.approveRequest(id).send({
      from: accounts[0],
    });
  };

  const onFinalize = async () => {
    const campaign = Campaign(address);
    const accounts = await web3.eth.getAccounts();

    await campaign.methods.finalizeRequest(id).send({
      from: accounts[0],
    });
  };

  return (
    <Row
      disabled={request.complete}
      positive={readyToFinalize && !request.complete}
    >
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>{`${request.approvalCount}/${approversCount}`}</Cell>
      <Cell>
        {request.complete ? null : (
          <Button color="green" basic onClick={onApprove}>
            Approve
          </Button>
        )}
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button color="teal" basic onClick={onFinalize}>
            Finalize
          </Button>
        )}
      </Cell>
    </Row>
  );
};

export default RequestRow;
