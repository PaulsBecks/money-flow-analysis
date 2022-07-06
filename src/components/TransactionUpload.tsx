import { Transaction } from "../types";

type TransactionUploadProps = {
  setTransactions(transactions: Array<Transaction>): void;
};

export default function TransactionUpload(props: TransactionUploadProps) {
  const changeHandler = async (event: any) => {
    const reader = new FileReader();
    await reader.readAsText(event.target.files[0]);
    reader.onloadend = () => {
      const result = (reader?.result as string).replaceAll('"', "");
      const arrays = result
        .split("\n")
        .map((line: any) => line.split(";").concat([null, "💰"]));
      props.setTransactions(arrays.slice(1, -1));
    };
  };
  return (
    <div>
      <div style={{ textAlign: "left" }}>
        <h2>Lade deinen Transaktionsverlauf als CSV-Datei hier hoch</h2>
        <p>Du findest den Download Button unter:</p>
        <ol>
          <li>Online Banking</li>
          <li>Umsätze</li>
          <li>Wähle dein Konto aus</li>
          <li>Akutalisieren</li>
          <li>Exportieren</li>
          <li>CSV-MT940-Format</li>
        </ol>
      </div>
      <input
        type="file"
        name="file"
        accept=".csv"
        onChange={changeHandler}
        style={{ display: "block", margin: "10px auto" }}
      />
    </div>
  );
}
