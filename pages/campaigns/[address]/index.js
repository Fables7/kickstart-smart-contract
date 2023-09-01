import React from "react";
import Campaign from "../../../ethereum/campaign";
import { Card, Grid, Button } from "semantic-ui-react";
import web3 from "../../../ethereum/web3";
import ContributeForm from "../../../components/ContributeForm";
import Link from "next/link";

const CampaignShow = ({
  balance,
  manager,
  requestsCount,
  approversCount,
  minimumContribution,
  address,
}) => {
  const items = [
    {
      header: manager,
      meta: "Address of Manager",
      description:
        "The manager created this campaign and can create requests to withdraw money",
      style: { overflowWrap: "break-word" },
    },
    {
      header: minimumContribution,
      meta: "Minimum Contribution (wei)",
      description:
        "You must contribute at least this much wei to become an approver",
    },
    {
      header: requestsCount,
      meta: "Number of Requests",
      description:
        "A request tries to withdraw money from the contract. Requests must be approved by approvers",
    },
    {
      header: approversCount,
      meta: "Number of Approvers",
      description: "Number of people who have already donated to this campaign",
    },
    {
      header: web3.utils.fromWei(balance, "ether"),
      meta: "Campaign Balance (ether)",
      description:
        "The balance is how much money this campaign has left to spend.",
    },
  ];
  return (
    <>
      <h3>Campaign Show!</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group items={items} />
          </Grid.Column>

          <Grid.Column width={6}>
            <ContributeForm address={address} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${address}/requests`}>
              <Button primary>View Requests</Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};

CampaignShow.getInitialProps = async (props) => {
  const campaign = Campaign(props.query.address);

  const summary = await campaign.methods.getSummary().call();

  return {
    address: props.query.address,
    minimumContribution: BigInt(summary[0]).toString(),
    balance: BigInt(summary[1]).toString(),
    requestsCount: BigInt(summary[2]).toString(),
    approversCount: BigInt(summary[3]).toString(),
    manager: summary[4],
  };
};

export default CampaignShow;
