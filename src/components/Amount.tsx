import smallNumberDisplay from "../utils/smallNumberDisplay";

const Amount = ({ value }: { value?: number }) => {
  const numAmount = (!value ? 0 : value);
  const amount = numAmount >= 1 ? numAmount.toFixed(2) : smallNumberDisplay(value)//numAmount.toPrecision(4);
  return <span> {amount} BERA</span>;
};

export default Amount;