// utils/appLog.ts
const isDebug = __DEV__; //React Native ka built-in flag

/**
 * Custom app logger — sirf debug mode me active
 * @param screenName (optional) screen ya function ka naam
 * @param message  jo log karna hai
 * @param data (optional) koi extra object ya value
 */
export const appLog = (screenName: string, message: string, data?: any) => {
  if (!isDebug) return; // 🚫 Release build me kuch mat dikhao

  const time = new Date().toLocaleTimeString(); //timestamp
  const tag = screenName ? `[${screenName}]` : '';
  const formattedMessage = `🟢 ${time} ${tag} → ${message} ===>>>>`;

  if (data !== undefined) {
    console.log(formattedMessage, data);
  } else {
    console.log(formattedMessage);
  }
};
