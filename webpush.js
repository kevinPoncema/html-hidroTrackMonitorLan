const webpush = require("web-push");
const { PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY } = process.env;

webpush.setVapidDetails(
  "mailto:test@faztweb.com",
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

console.log("privada",process.env.PRIVATE_VAPID_KEY)
console.log("publica",process.env.PUBLIC_VAPID_KEY)


module.exports = webpush;