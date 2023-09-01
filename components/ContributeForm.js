import React, { useState } from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { useRouter } from "next/router";

const ContributeForm = ({ address }) => {
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    const campaign = Campaign(address);
    setErrorMessage("");
    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(value, "ether"),
      });
      router.replace(`/campaigns/${address}`);
    } catch (err) {
      setErrorMessage(err.message);
    }
    setLoading(false);
    setValue("");
  };
  return (
    <Form onSubmit={onSubmit} error={!!errorMessage}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input
          label="ether"
          labelPosition="right"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Form.Field>
      <Message error header="Oops" content={errorMessage} />
      <Button loading={loading} primary>
        Contribute!
      </Button>
    </Form>
  );
};

export default ContributeForm;
