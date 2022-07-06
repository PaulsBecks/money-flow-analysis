import Picker, { IEmojiData } from "emoji-picker-react";
import { useEffect, useState } from "react";
import { getLabel, getText } from "../helper";
import {Transaction} from '../types';

type TransactionRowProps = {
  transaction: Transaction
  handleLabelChange: Function
}

export default function TransactionRow(props:TransactionRowProps) {
  const [chosenEmoji, setChosenEmoji] = useState({emoji: getLabel(props.transaction)} as IEmojiData);
  const [isPickerActive, setIsPickerActive] = useState(false)
  useEffect(()=>{
    setChosenEmoji({emoji:getLabel(props.transaction)} as IEmojiData)
  }, [props]) 
  const onEmojiClick = (_:any, emojiObject:IEmojiData) => {
    props.handleLabelChange(emojiObject.emoji)
    setChosenEmoji(emojiObject);
    setIsPickerActive(false)
  };
  return (
    <tr>
      <td>{getText(props.transaction)}</td>
      <td>{props.transaction[8]}</td>
      <td>{chosenEmoji ? (
        <span style={{cursor:"pointer"}}onClick={()=>setIsPickerActive(true)}>{chosenEmoji.emoji}</span>
      ) : (
        <span>No emoji Chosen</span>
      )}
      {isPickerActive ? <Picker onEmojiClick={onEmojiClick} /> : <></>}
      </td>
    </tr>
  );
}
