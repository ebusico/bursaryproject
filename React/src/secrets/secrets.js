import CryptoJS from "react-native-crypto-js";

const codes = {

    staff : CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"),
    trainee : '3FJSei8zPx',
    staffPass  : 'c9nMaacr2Y',
    iv    : CryptoJS.enc.Hex.parse("00000000000000000000000000000000"),
  
  };


export { codes };