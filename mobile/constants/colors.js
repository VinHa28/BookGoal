const hexToRgba = (hex, opacity) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const colors = {
  primary: "#5265FF",
  secondary: "#4B4DED",
  dark: "#131629",
  background: "#FFFFFF",
  text: "#09101D",
  accent: "#ECF1F4",
  subtleText: "#8C8CA1",
  tertiaryBrand: "#FE7474",

  // Status corlor:
  pedding: "#FFC107",
  confirmed: "#28A745",
  cancelled: "#DC3545",
  requestCancel: "#FE7474",
  completed: "#17A2B8",
};

export { hexToRgba };
export default colors;
