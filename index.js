let isUSD = true;

window.onload = function() {
    let isUSDString = localStorage.getItem("isUSD");
    if(isUSDString === 'true')
        isUSD = true;
    else
        isUSD = false;
    updatingDropDown();

function updatingDropDown() {
    if(isUSD === true) {
        document.getElementById("usd").selected = "true";
    }
    else {
        document.getElementById("inr").selected = "true";
    }
}

const currency = document.getElementById("currency");

const table = document.getElementsByClassName("table")[0];

const url = 'https://crypto-manager-mudrex.herokuapp.com/latest';


const fetchData = async () => {
    try {
        let response = await fetch(url);
        if(response.ok){
            let jsonResponse = await response.json();
            return jsonResponse; 
        }
    }catch(error){
        console.log(error);
    }
}

async function retrieveData(){
    let data = await fetchData();
    data.data.forEach(addingDataToTable);
    if(!isUSD)
        changingCurrency(isUSD);
    addingUIToDom();
}

function addingUIToDom() {
    const table = document.getElementsByClassName("table")[0];
    table.classList.remove("hide");
}

function addingDataToTable(data) {
    const circulatingSupply = data.circulating_supply;
    const token = data.name;
    const symbol = data.symbol;
    const price = parseFloat(data.quote.USD.price).toFixed(3);

    const rowElement = document.createElement("tr");
    rowElement.className = "table-data";
    const pElement1 = document.createElement("p");
    const pElement2 = document.createElement("p");
    const pElement3 = document.createElement("p");
    const cellElement1 = document.createElement("td");
    pElement1.textContent = token + " " + symbol;
    cellElement1.appendChild(pElement1);
    const cellElement2 = document.createElement("td");
    let USD = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    let convertedPriceString = USD.format(price);
    pElement2.textContent = convertedPriceString;
    cellElement2.appendChild(pElement2);
    const cellElement3 = document.createElement("td");
    pElement3.textContent = circulatingSupply;
    cellElement3.appendChild(pElement3);
    cellElement1.className = "table-data1";
    cellElement2.className = "table-data2";
    cellElement3.className = "table-data3";
    rowElement.appendChild(cellElement1);
    rowElement.appendChild(cellElement2);
    rowElement.appendChild(cellElement3);
    table.appendChild(rowElement);
}

retrieveData();

const input = document.getElementById("input");
const searchBtn = document.getElementById("search-btn");

function searchFunction() {
    let filter = input.value.toUpperCase();
    const table = document.getElementsByClassName("table")[0];
    const tableData = table.getElementsByClassName("table-data");
    for(let i=0; i<tableData.length; i++) {
        const td = tableData[i].getElementsByClassName("table-data1")[0];
        if(td) {
            const pTag = td.getElementsByTagName("p")[0].textContent.toUpperCase();
            if(pTag.indexOf(filter) > -1)
                tableData[i].style.display = "";
            else
                tableData[i].style.display = "none";
        }
        
    }
}

function changingCurrency(isUSD) {
    const tableData = table.getElementsByClassName("table-data");
    const th = document.getElementById("table-header2");
    const thTextContent = th.getElementsByTagName("p")[0];
    const conversionRateUSDToINR = 80;
    if(!isUSD) {
        thTextContent.textContent = "PRICE (INR)";
        for(let i=0; i<tableData.length; i++) {
            const td = tableData[i].getElementsByClassName("table-data2")[0];
            if(td) {
                const pTag = td.getElementsByTagName("p")[0];
                const pTagText = pTag.textContent;
                var number = Number(pTagText.replace(/[^0-9.-]+/g,""));
                let price = parseFloat(number);
                let convertedPrice = parseFloat(price * conversionRateUSDToINR).toFixed(3);
                let INR = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'INR',
                });
                let convertedPriceString = INR.format(convertedPrice);
                pTag.textContent = convertedPriceString;
            }
        }
    }
    else {
        thTextContent.textContent = "PRICE (USD)";
        for(let i=0; i<tableData.length; i++) {
            const td = tableData[i].getElementsByClassName("table-data2")[0];
            if(td) {
                const pTag = td.getElementsByTagName("p")[0];
                const pTagText = pTag.textContent;
                var number = Number(pTagText.replace(/[^0-9.-]+/g,""));
                let price = parseFloat(number);
                let convertedPrice = parseFloat(price / conversionRateUSDToINR).toFixed(3);
                let USD = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                });
                let convertedPriceString = USD.format(convertedPrice);
                pTag.textContent = convertedPriceString;
            }
        }
    }
}

const dropdown = document.getElementById('dropdown');

dropdown.addEventListener('change', function handleChange(event) {
    if(event.target.value === "INR"){
        isUSD = false;
        changingCurrency(isUSD);
    }
    else {
        isUSD = true;
        changingCurrency(isUSD);
    }      
});


searchBtn.addEventListener("click", (e) => {
    searchFunction();
})

input.addEventListener("keyup", (e) => {
    searchFunction();
})

}
window.onbeforeunload = function() {
    localStorage.setItem("isUSD", isUSD);
}




