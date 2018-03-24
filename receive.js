const SENDER_ID = 'YOUR_SENDER_ID';
console.assert(/^\d{12}$/.test(SENDER_ID));

new Notification('Event page loaded');

const refreshToken = async () => {
  const tokenParams = {
    authorizedEntity: SENDER_ID,
    scope: 'GCM'
  };
  let token = await new Promise((resolve, reject) => {
    let r = chrome.instanceID.getToken(tokenParams, token => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(token);
      }
    });
  });
  await new Promise((resolve, reject) => {
    chrome.storage.local.set({ token }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    })
  });
  new Notification('token', {
    body: token,
  });
};
chrome.runtime.onInstalled.addListener(details => {
  new Notification('"onInstalled" event fired', {
    body: JSON.stringify(details),
  });
  refreshToken();
});
chrome.instanceID.onTokenRefresh.addListener(() => {
  new Notification('"onTokenRefresh" event fired');
  refreshToken();
});
chrome.gcm.onMessage.addListener(message => {
  new Notification('"onMessage" event fired', {
    body: JSON.stringify(message),
  });
});
