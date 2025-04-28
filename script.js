document.addEventListener('DOMContentLoaded', function() {
    const amountInput = document.getElementById('amount');
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const convertBtn = document.getElementById('convert-btn');
    const resultDiv = document.getElementById('result');
    const swapBtn = document.getElementById('swap');
    
    // List of common currencies
    const currencies = {
        "USD": "United States Dollar",
        "EUR": "Euro",
        "GBP": "British Pound",
        "JPY": "Japanese Yen",
        "AUD": "Australian Dollar",
        "CAD": "Canadian Dollar",
        "CHF": "Swiss Franc",
        "CNY": "Chinese Yuan",
        "INR": "Indian Rupee",
        "PKR": "Pakistani Rupee",
        "MXN": "Mexican Peso",
        "SGD": "Singapore Dollar",
        "NZD": "New Zealand Dollar",
        "HKD": "Hong Kong Dollar",
        "SEK": "Swedish Krona",
        "KRW": "South Korean Won",
        "ZAR": "South African Rand",
        "RUB": "Russian Ruble",
        "BRL": "Brazilian Real"
    };
    
    // Populate currency dropdowns
    function populateCurrencyDropdowns() {
        for (const code in currencies) {
            const fromOption = document.createElement('option');
            fromOption.value = code;
            fromOption.textContent = `${code} - ${currencies[code]}`;
            fromCurrency.appendChild(fromOption);
            
            const toOption = document.createElement('option');
            toOption.value = code;
            toOption.textContent = `${code} - ${currencies[code]}`;
            toCurrency.appendChild(toOption);
        }
        
        // Set default values
        fromCurrency.value = 'USD';
        toCurrency.value = 'EUR';
    }
    
    // Fetch exchange rates from API
    async function getExchangeRate(from, to) {
        try {
            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
            const data = await response.json();
            return data.rates[to];
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
            return null;
        }
    }
    
    // Convert currency
    async function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        const from = fromCurrency.value;
        const to = toCurrency.value;
        
        if (isNaN(amount)) {
            resultDiv.innerHTML = '<p class="error">Please enter a valid amount</p>';
            return;
        }
        
        resultDiv.innerHTML = '<p>Converting...</p>';
        
        const rate = await getExchangeRate(from, to);
        
        if (rate === null) {
            resultDiv.innerHTML = '<p class="error">Failed to get exchange rate. Please try again later.</p>';
            return;
        }
        
        const convertedAmount = (amount * rate).toFixed(2);
        resultDiv.innerHTML = `
            <p>${amount} ${from} = ${convertedAmount} ${to}</p>
            <p class="rate">1 ${from} = ${rate.toFixed(6)} ${to}</p>
        `;
    }
    
    // Swap currencies
    function swapCurrencies() {
        const temp = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = temp;
        convertCurrency();
    }
    
    // Event listeners
    convertBtn.addEventListener('click', convertCurrency);
    swapBtn.addEventListener('click', swapCurrencies);
    
    // Initialize
    populateCurrencyDropdowns();
    convertCurrency();
});