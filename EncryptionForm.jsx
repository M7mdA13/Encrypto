import { useState } from "react";
import {
  caesarEncrypt,
  caesarDecrypt,
  playfairEncrypt,
  playfairDecrypt,
  aesEncrypt,
  aesDecrypt,
} from "./algo";

function EncryptionForm({ EncryptOrDecrypt, Algo }) {
  const [plainText, setPlainText] = useState("");
  const [key, setKey] = useState("");
  const [resultText, setResultText] = useState("");

  const handleTextChange = (e) => setPlainText(e.target.value);
  const handleKeyChange = (e) => setKey(e.target.value);

  const handleSubmit = async () => {
    try {
      if (EncryptOrDecrypt && Algo === 1) {
        setResultText(caesarEncrypt(plainText, parseInt(key)));
      } else if (!EncryptOrDecrypt && Algo === 1) {
        setResultText(caesarDecrypt(plainText, parseInt(key)));
      } else if (EncryptOrDecrypt && Algo === 2) {
        setResultText(playfairEncrypt(plainText, key));
      } else if (!EncryptOrDecrypt && Algo === 2) {
        setResultText(playfairDecrypt(plainText, key));
      } else if (EncryptOrDecrypt && Algo === 3) {
        const encrypted = await aesEncrypt(plainText, key);
        setResultText(encrypted);
      } else if (!EncryptOrDecrypt && Algo === 3) {
        const decrypted = await aesDecrypt(plainText, key);
        setResultText(decrypted);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="form-container">
      <label className="form-label">
        {EncryptOrDecrypt ? "Text to Encrypt:" : "Text to Decrypt:"}
      </label>
      <input
        type="text"
        value={plainText}
        onChange={handleTextChange}
        placeholder="Enter your text here..."
        className="form-input"
      />
      <>
        <label className="form-label">
          {Algo === 1 && "Key(0-25 for A-Z):"}
          {Algo === 2 && "Key:"}
          {Algo === 3 && "Key(16 Characters - 128 bits):"}
        </label>
        <input
          type="text"
          value={key}
          onChange={handleKeyChange}
          placeholder="Enter the key..."
          className="form-input"
        />

        <button className="submit-button" onClick={handleSubmit}>
          {EncryptOrDecrypt ? "Encrypt" : "Decrypt"}
        </button>

        <label className="form-label">
          {EncryptOrDecrypt ? "Encrypted Text:" : "Decrypted Text"}
        </label>
        <textarea
          readOnly
          value={resultText}
          className="form-input result-textarea"
          placeholder="Your Result will be here..."
        />
      </>
    </div>
  );
}

export default EncryptionForm;
