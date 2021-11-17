const totp = require("totp-generator");
const randomString = require("./randomString");

async function sendOTP(phone, collection) {
  const OTP = totp(randomString(16), {
    digits: 4,
    algorithm: "SHA-512",
    period: 60,
    timestamp: 1465324707000,
  });
  if (!(await collection.findOne({ phone }))) {
    await collection.insertOne({ phone, OTP });
    setTimeout(async () => {
      try {
        await collection.findOneAndDelete({ phone });
      } catch (error) {
        throw new Error(error);
      }
    }, 60000);
  } else {
    throw new Error("OTP Already Sent.");
  }
}

async function resendOTP(phone, collection) {
  const OTP_TOKEN = totp(randomString(16), {
    digits: 4,
    algorithm: "SHA-512",
    period: 60,
    timestamp: 1465324707000,
  });
  const OTP = await collection.findOne({ phone });
  if (!OTP) {
    await collection.insertOne({ phone, OTP: OTP_TOKEN });
    setTimeout(async () => {
      try {
        await collection.findOneAndDelete({ phone });
      } catch (error) {
        throw new Error(error);
      }
    }, 60000);
  } else {
    throw new Error("OTP Already Sent, Wait Sixty Seconds");
  }
}

async function verifyOTP(phone, OTP_TOKEN, collection) {
  const OTP = await collection.findOne({ phone });
  if (OTP) {
    if (OTP.OTP === OTP_TOKEN) {
      return true;
    }
  }
  throw new Error("Could not find the code, resend OTP");
}

module.exports = { sendOTP, resendOTP, verifyOTP };
