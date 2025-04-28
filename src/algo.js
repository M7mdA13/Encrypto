// Algorithms for Enc/Dec

// Caesar Cipher

export function caesarEncrypt(plaintext, shift) {
    if(!Number.isInteger(shift)){
        return "Key must be Integer value..";
    }
  return plaintext
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);

      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + shift) % 26) + 97);
      } else {
        return char;
      }
    })
    .join("");
}

export function caesarDecrypt(ciphertext, shift) {
  return caesarEncrypt(ciphertext, 26 - (shift % 26));
}

//  Playfair Cipher
function generatePlayfairMatrix(key) {
  key = key
    .toUpperCase()
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");
  let matrix = "";
  for (const char of key) {
    if (!matrix.includes(char)) {
      matrix += char;
    }
  }
  for (let i = 0; i < 26; i++) {
    const char = String.fromCharCode(65 + i);
    if (char !== "J" && !matrix.includes(char)) {
      matrix += char;
    }
  }
  const matrixArr = [];
  for (let i = 0; i < 5; i++) {
    matrixArr.push(matrix.slice(i * 5, (i + 1) * 5).split(""));
  }
  return matrixArr;
}

function findPosition(matrix, letter) {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (matrix[row][col] === letter) {
        return { row, col };
      }
    }
  }
}

export function playfairEncrypt(plaintext, key) {
  const matrix = generatePlayfairMatrix(key);
  plaintext = plaintext
    .toUpperCase()
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");
  let pairs = "";

  for (let i = 0; i < plaintext.length; i += 2) {
    let a = plaintext[i];
    let b = plaintext[i + 1] || "X"; // pad with X if odd length

    if (a === b) {
      b = "X";
      i--;
    }

    pairs += a + b;
  }

  let ciphertext = "";
  for (let i = 0; i < pairs.length; i += 2) {
    const { row: row1, col: col1 } = findPosition(matrix, pairs[i]);
    const { row: row2, col: col2 } = findPosition(matrix, pairs[i + 1]);

    if (row1 === row2) {
      // Same row
      ciphertext += matrix[row1][(col1 + 1) % 5];
      ciphertext += matrix[row2][(col2 + 1) % 5];
    } else if (col1 === col2) {
      // Same column
      ciphertext += matrix[(row1 + 1) % 5][col1];
      ciphertext += matrix[(row2 + 1) % 5][col2];
    } else {
      // Rectangle
      ciphertext += matrix[row1][col2];
      ciphertext += matrix[row2][col1];
    }
  }
  return ciphertext;
}

export function playfairDecrypt(ciphertext, key) {
  const matrix = generatePlayfairMatrix(key);
  ciphertext = ciphertext
    .toUpperCase()
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");

  let plaintext = "";
  for (let i = 0; i < ciphertext.length; i += 2) {
    const { row: row1, col: col1 } = findPosition(matrix, ciphertext[i]);
    const { row: row2, col: col2 } = findPosition(matrix, ciphertext[i + 1]);

    if (row1 === row2) {
      // Same row
      plaintext += matrix[row1][(col1 + 4) % 5];
      plaintext += matrix[row2][(col2 + 4) % 5];
    } else if (col1 === col2) {
      // Same column
      plaintext += matrix[(row1 + 4) % 5][col1];
      plaintext += matrix[(row2 + 4) % 5][col2];
    } else {
      // Rectangle
      plaintext += matrix[row1][col2];
      plaintext += matrix[row2][col1];
    }
  }
  return plaintext;
}

// AES-128 CBC using Web Crypto API (strict 16-byte key)

async function getKey(key) {
    if (key.length !== 16) {
      return false;
    }
    const enc = new TextEncoder();
    return await crypto.subtle.importKey(
      "raw",
      enc.encode(key),
      { name: "AES-CBC" },
      false,
      ["encrypt", "decrypt"]
    );
  }
  
  function generateIV() {
    return crypto.getRandomValues(new Uint8Array(16));
  }
  
  export async function aesEncrypt(plaintext, key) {
    const cryptoKey = await getKey(key);
    if(!cryptoKey){
        return "KEY MUST BE 16 Ch's (128-bits)..";
    }
    const iv = generateIV();
    const enc = new TextEncoder();
    const encodedText = enc.encode(plaintext);
  
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-CBC", iv },
      cryptoKey,
      encodedText
    );
  
    const encryptedHex = Array.from(new Uint8Array(encrypted))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  
    const ivHex = Array.from(iv)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  
    return ivHex + ":" + encryptedHex;
  }
  
  export async function aesDecrypt(ciphertext, key) {
    const cryptoKey = await getKey(key);
    const [ivHex, encryptedHex] = ciphertext.split(":");
  
    const iv = new Uint8Array(ivHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    const encryptedBytes = new Uint8Array(encryptedHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
  
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv },
      cryptoKey,
      encryptedBytes
    );
  
    const dec = new TextDecoder();
    return dec.decode(decrypted);
  }
  