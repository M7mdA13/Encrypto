import "./App.css";
import { useState } from "react";
import EncryptionForm from "./EncryptionForm";

function HomePage() {
  const [EncryptOrDecrypt, setState] = useState(1);
  const [Algo, setAlgo] = useState(1);
  return (
    <div className="container">
      <header id="header">
        <h1 className="heading1">Encrypto</h1>
      </header>
      <div className="toggle">
        <button
          className={EncryptOrDecrypt ? "toggled" : "btn"}
          onClick={() => setState(1)}
        >
          Encrypt
        </button>
        <button
          className={!EncryptOrDecrypt ? "toggled" : "btn"}
          onClick={() => setState(0)}
        >
          Decrypt
        </button>
      </div>
      <span className="choose">
        Choose your {EncryptOrDecrypt ? "Encryption" : "Decryption"} Algorithm:
      </span>
      <div class="algorithm-buttons">
        <button
          className={Algo === 1 ? "toggled" : "algorithm-button"}
          onClick={() => setAlgo(1)}
        >
          Caesar Cipher
        </button>
        <button
          className={Algo === 2 ? "toggled" : "algorithm-button"}
          onClick={() => setAlgo(2)}
        >
          Playfair Cipher
        </button>
        <button
          className={Algo === 3 ? "toggled" : "algorithm-button"}
          onClick={() => setAlgo(3)}
        >
          AES Encryption (10 Rounds)
        </button>
      </div>
      <span className="disc">
        {Algo === 1 &&
          "A simple substitution cipher where each letter in the plaintext is shifted by a fixed number of positions in the alphabet. Ideal for basic encryption but easily cracked with modern methods."}
        {Algo === 2 &&
          "The Playfair cipher is a classical encryption technique that encrypts pairs of letters (digraphs) using a 5×5 matrix built from a keyword, making it more secure than simple substitution ciphers by hiding letter frequencies. It replaces each pair according to specific matrix rules based on their position."}
        {Algo === 3 &&
          "A symmetric key encryption algorithm that encrypts data in fixed-size blocks. AES is widely used for securing sensitive data and is considered highly secure with key sizes of 128, 192, or 256 bits."}
      </span>
        <EncryptionForm EncryptOrDecrypt={EncryptOrDecrypt} Algo={Algo} />
    </div>
  );
}
export default HomePage;
