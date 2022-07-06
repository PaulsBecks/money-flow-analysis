import { Transaction } from "../types";
import TransactionUpload from "./TransactionUpload";

type LandingPageProps = {
  setTransactions: (transactions: Array<Transaction>) => void;
};
export default function LandingPage(props: LandingPageProps) {
  return (
    <>
      <TransactionUpload setTransactions={props.setTransactions} />
      <br />
      <h2>Charts</h2>
      <div>
        <p>
          Nachdem du deine Datei hochgeladen hast, kannst du die Transaktionen
          mit Emojis kennzeichnen.
        </p>
        <p>
          Aus diesen Informationen werden dann Grafen ähnlich zu diesen
          erstellt:
        </p>
      </div>
      <img
        alt="Beispiel Sankey Diagram"
        src="/img/sankey_chart.png"
        style={{ maxHeight: "50%", maxWidth: "100%" }}
      />
      <img
        alt="Beispiel Balkendiagram"
        src="/img/bar_chart.png"
        style={{ maxHeight: "50%", maxWidth: "100%" }}
      />
    </>
  );
}
