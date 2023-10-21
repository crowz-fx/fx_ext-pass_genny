chrome.runtime.onMessage.addListener((payload) => {
  const { event, data } = payload;

  switch (event) {
    case 'save':
      handleSave(data)
      break;
    case 'reset':
      handleReset()
      break;
    default:
      break;
  }
});

const handleSave = (data) => {
  console.log("Update Defaults Triggered: ", data);
  chrome.storage.local.set(data);
}

const handleReset = () => {
  console.log("Reset Defaults Triggered");
  chrome.storage.local.set({
    includeSymbols: false,
    mixedCase: false,
    similarCharacters: false
  })
}