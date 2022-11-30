export const toRecepientId = (phoneNumber: string, toGroup = false) => {
  if (!phoneNumber) throw Error("Phone number must be provided");

  // Remove all space; some case user input phone number like 0878 0862 2222
  phoneNumber = String(phoneNumber).replace(/ /g, "");

  const isValidRecepientId = phoneNumber.includes("@");
  if (isValidRecepientId) return phoneNumber;

  let number = phoneNumber;
  if (!toGroup && number.startsWith("0")) number = "62" + number.substring(1);

  const suffix = toGroup ? "@g.us" : "@s.whatsapp.net";
  const recepientId = number + suffix;

  return recepientId;
};
