const SERVER_KEY = 'YOUR_SERVER_KEY';
console.assert(/^\w{11}:[\w-]{140}$/.test(SERVER_KEY));

(async () => {
  let form = document.querySelector('form');
  let input = document.querySelector('input');
  let button = document.querySelector('button');

  form.addEventListener('submit', async event => {
    event.preventDefault();
    button.disabled = true;
    try {
      let result = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `key=${SERVER_KEY}`
        },
        body: JSON.stringify({
          data: {
            foo: "foo is awsome!",
            bar: "bar is awsome!",
          },
          to: input.value,
        }),
      }).then(response => response.json());
      new Notification('message sent from browser action', {
        body: JSON.stringify(result),
      });
    } catch (e) {
      new Notification('message not sent from browser action', {
        body: e
      });
    } finally {
      button.disabled = false;
    }
  });
  input.value = await new Promise((resolve, reject) => {
    chrome.storage.local.get('token', data => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(data.token);
      }
    })
  });
  button.disabled = false;
})()
