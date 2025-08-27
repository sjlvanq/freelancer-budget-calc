document.addEventListener('DOMContentLoaded', () => {
  const moneyPerDayInput = document.getElementById('moneyPerDay');
  const daysOfWorkInput = document.getElementById('daysOfWork');
  const inputCurrencySelect = document.getElementById('inputCurrency');
  const outputCurrencySelect = document.getElementById('outputCurrency');
  const resultDiv = document.getElementById('result');
  var conversionRate = 1;
  
  const calculateAndSave = () => {
    const moneyPerDay = parseFloat(moneyPerDayInput.value) || 0;
    const daysOfWork = parseFloat(daysOfWorkInput.value) || 0;
    const total = moneyPerDay * daysOfWork * conversionRate;
    resultDiv.textContent = total.toFixed(2);

    chrome.storage.local.set({
      'moneyPerDay': moneyPerDay,
      'daysOfWork': daysOfWork
    });
  };
  
  const changeCurrency = () => {
    const inputCurrency = inputCurrencySelect.value;
    const outputCurrency = outputCurrencySelect.value;
    const url = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/" + inputCurrency + ".min.json";
    fetch(url)
      .then(response => {
          if(!response.ok) {
	        throw new Error(`Response status: ${response.status}`);
	      }
		  return response.json();
	  })
	  .then(data => {
		conversionRate = data[inputCurrency][outputCurrency];
		chrome.storage.local.set({
			'inputCurrency': inputCurrency,
			'outputCurrency': outputCurrency,
			'conversionRate': conversionRate
		});
		calculateAndSave();
	  })
	  .catch(error => console.error(error.message));
  };
  
  chrome.storage.local.get(['moneyPerDay', 'daysOfWork', 'inputCurrency', 'outputCurrency', 'conversionRate'], (result) => {
    if (result.moneyPerDay) {
      moneyPerDayInput.value = result.moneyPerDay;
    }
    if (result.daysOfWork) {
      daysOfWorkInput.value = result.daysOfWork;
    }
    if (result.inputCurrency) {
		inputCurrencySelect.value = result.inputCurrency;
    }
    if (result.outputCurrency) {
		outputCurrencySelect.value = result.outputCurrency;
    }
    if (result.conversionRate) {
		conversionRate = result.conversionRate;
	}
	calculateAndSave();
  });
  
  moneyPerDayInput.addEventListener('input', calculateAndSave);
  daysOfWorkInput.addEventListener('input', calculateAndSave);
  inputCurrencySelect.addEventListener('change', changeCurrency);
  outputCurrencySelect.addEventListener('change', changeCurrency);
  
});
