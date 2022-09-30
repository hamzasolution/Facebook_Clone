exports.validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^([a-z\d\.~]+)@([a-z\d~]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/);
};
exports.validateLength = (text, min, max) => {
  if (text.length < min || text.length > max) {
    return false;
  } else {
    return true;
  }
};

// exports.validateUsername = async (username) => {
//   let a = false;
//   do {
//     let check = await User.findOne({ username });
//     if (check) {
//       username += (new Date() * Math.random()).toString().substring(0, 5);
//     } else {
//       a = true;
//     }
//   } while (a == false);
//   return username;
// };
