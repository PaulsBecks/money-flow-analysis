import { useEffect, useState } from "react";
import { bigger, getAmount, getLabel, getWindowDimensions } from "../helper";
import { Transaction } from "../types";
import Plotly from "react-plotlyjs-ts";

type SankeyPlotProps = {
  transactions: Array<Transaction>;
};

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

export default function SankeyPlot(props: SankeyPlotProps) {
  const { height, width } = useWindowDimensions();

  const incomeByLabel = props.transactions
    .filter((transaction) => getAmount(transaction) > 0)
    .reduce((total: any, transaction) => {
      const label = getLabel(transaction);
      const amount = getAmount(transaction);
      total[label] = total[label] ? total[label] + amount : amount;
      return total;
    }, {});
  const expensesByLabel = props.transactions
    .filter((transaction) => getAmount(transaction) < 0)
    .reduce((total: any, transaction) => {
      const label = getLabel(transaction);
      const amount = getAmount(transaction);
      total[label] = total[label] ? total[label] + amount : amount;
      return total;
    }, {});
  const expenseKeysOrder = Object.keys(expensesByLabel).sort(bigger);
  const incomeKeysOrder = Object.keys(incomeByLabel).sort(bigger);
  const sankeyData = [
    {
      type: "sankey",
      orientation: "h",
      node: {
        pad: 15,
        thickness: 30,
        line: {
          color: "black",
          width: 0.5,
        },
        label: ["Konto"].concat(incomeKeysOrder).concat(expenseKeysOrder),
        color: ["blue"]
          .concat(incomeKeysOrder.map((_) => "green"))
          .concat(expenseKeysOrder.map((_) => "red")),
      },

      link: {
        source: incomeKeysOrder
          .map((_, i) => i + 1)
          .concat(expenseKeysOrder.map((_) => 0)),
        target: incomeKeysOrder
          .map((_) => 0)
          .concat(
            expenseKeysOrder.map((_, i) => i + 1 + incomeKeysOrder.length)
          ),
        value: incomeKeysOrder
          .map((label) => incomeByLabel[label])
          .concat(expenseKeysOrder.map((label) => -expensesByLabel[label])),
      },
    },
  ];

  const barData = [
    {
      type: "bar",
      orientation: "h",
      y: expenseKeysOrder.sort(
        (labelA, labelB) => expensesByLabel[labelB] - expensesByLabel[labelA]
      ),
      x: expenseKeysOrder
        .sort(
          (labelA, labelB) => expensesByLabel[labelB] - expensesByLabel[labelA]
        )
        .map((label) => -expensesByLabel[label]),
    },
  ];
  return (
    <>
      <Plotly
        data={sankeyData}
        layout={{
          width: width * 0.8,
          height: height * 0.8,
          title: "Sankey Diagram",
        }}
      />
      <Plotly
        data={barData}
        layout={{
          width: width * 0.8,
          height: height * 0.8,
          title: "Ausgaben gruppiert nach Label",
        }}
      />
    </>
  );
}
