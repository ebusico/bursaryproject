import CryptoJS from "react-native-crypto-js";

const codes = {

    staff : CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"),
    trainee : '3FJSei8zPx',
    staffPass  : 'c9nMaacr2Y',
    iv    : CryptoJS.enc.Hex.parse("00000000000000000000000000000000"),
    message : 'This site or third-party tools used by this site make use of cookies necessary for the operation and useful for the purposes outlined in the cookie policy. To learn more or opt out, see the cookie policy. By accepting, you consent to the use of cookies'
  
  };


export { codes };