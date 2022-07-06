import "./App.css";
import { useState } from "react";
import TransactionRow from "./components/TransactionRow";
import { calcSimilarity, getText } from "./helper";
import { Transaction } from "./types";
import useLocalStorage from "./hooks/useLocalstorage";
import SankeyPlot from "./components/Plot";
import LandingPage from "./components/LandingPage";

function findSimilarLabel(name: string, transactions: Array<Transaction>) {
  let similarLabel = "";
  let similarity = 0;
  for (let i = 0; i < transactions.length; i++) {
    const transaction = transactions[i];
    const challengingSimilarity = calcSimilarity(name, transaction[5]);
    if (challengingSimilarity > similarity) {
      similarity = challengingSimilarity;
      similarLabel = transaction[11];
    }
  }
  return similarLabel;
}

function updateDefaultLabels(
  transactions: Array<Transaction>,
  withLabel: Array<Transaction>
) {
  // get all transaction with label set

  // compare every transaction to check which of the previous he is closest to
  for (let i = 0; i < transactions.length; i++) {
    const transaction = transactions[i];
    const name = getText(transaction);
    if (transaction[11] === null) {
      transactions[i][12] = findSimilarLabel(name, withLabel);
    }
  }
}

function App() {
  const [transactions, setTransactions] = useState([] as Array<Transaction>);
  const [labeledTransactions, setLabeledTransactions] = useLocalStorage(
    "labeledTransactions",
    [] as Array<Transaction>
  );
  return (
    <div className="App" style={{ padding: "10%" }}>
      <h1>Sparkassen Geldfluss Analyse</h1>
      {transactions.length > 0 ? (
        <SankeyPlot transactions={transactions} />
      ) : (
        <LandingPage
          setTransactions={(transactions) => {
            if (labeledTransactions.length > 0) {
              updateDefaultLabels(transactions, labeledTransactions);
            }
            setTransactions(transactions);
          }}
        />
      )}
      <h2>Deine Daten</h2>
      <p>Klick auf die Emojis rechts, um das Label anzupassen.</p>
      <table style={{ textAlign: "left" }}>
        {transactions.map((transaction: Transaction, i: number) => (
          <TransactionRow
            handleLabelChange={(label: string) => {
              let _transactions = [...transactions];
              _transactions[i][11] = label;
              setLabeledTransactions(
                labeledTransactions.concat([_transactions[i]])
              );
              updateDefaultLabels(
                _transactions,
                labeledTransactions.concat([_transactions[i]])
              );
              setTransactions(_transactions);
            }}
            transaction={transaction}
          />
        ))}
      </table>
    </div>
  );
}

export default App;
