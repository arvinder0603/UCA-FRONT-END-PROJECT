// Function to save PersonalData to localStorage
function saveToLocalStorage(data) {
    localStorage.setItem('PersonalData', JSON.stringify(data));
}

// Function to retrieve PersonalData from localStorage
function getFromLocalStorage() {
    const data = localStorage.getItem('PersonalData');
    return data ? JSON.parse(data) : [];
}

// Load PersonalData from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    PersonalData = getFromLocalStorage();
});


let PersonalData=[]
let corpus=[]

//this is main function used for fetching data from rapid api 
//Fetch method is used in this part for data fetching 
const url = 'https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers%5B0%5D=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0';
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'df4f4523femshf6b54f426093886p14eec8jsn17840ae4b6c0',
        'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
    }
};

// IN this function we create html elemments and give them class name and assign them value using map function 
// we have a button in this function at last to add element to our local storage to lock the prices of coins.
function display(data) {
    const mainDiv = document.getElementById('block');

    data.forEach((coin, indx) => {
        const card = document.createElement("div");
        card.classList.add('card');

        const image = document.createElement("img");
        image.classList.add('coin-image');
        image.src = coin.iconUrl;

        const name = document.createElement("h1");
        name.innerHTML = coin.name;
        name.classList.add('name');

        const price = document.createElement("h1");
        price.innerHTML = `Price: $ ${coin.price}`;
        price.classList.add('price');

        const rank = document.createElement("h1");
        rank.innerHTML = ` Rank: ${coin.rank}`;
        rank.classList.add('rank');

        const Mcap = document.createElement("h1");
        Mcap.innerHTML = ` Market cap: ${coin.marketCap}`;
        Mcap.classList.add('Mcap');

        const button = document.createElement("button");
        button.innerHTML = "Add to watch";
        button.classList.add('button');


        button.addEventListener('click', () => {
            const exists = PersonalData.some(item => item.Name === coin.name);
            if (!exists) {
                const d = new Date(); // Get the current date and time
                PersonalData.push({
                    "Name": coin.name,
                    "Price": coin.price,
                    "Rank": coin.rank,
                    "MarketCap": coin.marketCap,
                    "IconUrl": coin.iconUrl,
                    "Day": d.toLocaleDateString(),
                    "Time": d.toLocaleTimeString() // Add the local time
                });
        
                saveToLocalStorage(PersonalData); // Save to localStorage
               
                pdataShow(PersonalData);
        
                // Change button color for 1 second
                button.style.backgroundColor = 'black';
        
                setTimeout(function() {
                    button.style.backgroundColor = ''; // Reset to default color
                }, 100);
            }
        });
        
        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(price);
        card.appendChild(Mcap);
        card.appendChild(rank);
        card.appendChild(button);

        mainDiv.appendChild(card);
    });
}

//This function works similar as display function this function take data from local storage and render it on front-end
function pdataShow(data) {
    const Pdiv = document.getElementById('Pdivs');
    Pdiv.innerHTML = ""; // Clear the content before displaying updated data

    data.forEach(coin => {
        const card = document.createElement("div");
        card.classList.add("Pcard");

        const image = document.createElement("img");
        image.classList.add('coin-image');
        image.src = coin.IconUrl;

        const name = document.createElement("h1");
        name.innerHTML = coin.Name;

        const price = document.createElement("h1");
        price.innerHTML = `Booked Price : $ ${coin.Price}`;

        const rank = document.createElement("h1");
        rank.innerHTML = `Booked Rank: ${coin.Rank}`;

        const Mcap = document.createElement("h1");
        Mcap.innerHTML = ` Market cap: ${coin.MarketCap}`;

        const dayBook = document.createElement("h1");
        dayBook.innerHTML = `Day Booked: ${coin.Day}`;

        const timeBook = document.createElement("h1");
        timeBook.innerHTML = `Time Booked: ${coin.Time}`;

        const button = document.createElement("button");
        button.innerHTML = "Remove";
        button.classList.add('Btn');

        button.addEventListener('click', () => {
            deleteItemByName(coin.Name);

        });

        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(price);
        card.appendChild(rank);
        card.appendChild(Mcap);
        card.appendChild(dayBook); // Add dayBook element
        card.appendChild(timeBook); // Add timeBook element
        card.appendChild(button);

        Pdiv.appendChild(card);
    });
}

// Function to delete data from PersonalData or lock data from local storage
function deleteItemByName(name) {
    PersonalData = PersonalData.filter(item => item.Name !== name);
    saveToLocalStorage(PersonalData);
    pdataShow(PersonalData);
}

// Main function call which after fetching data render data on front-end
async function data() {
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        corpus = result.data.coins;
        display(corpus);
    } catch (error) {
        console.error(error);
    }
}

// Function to scroll to Pdivs
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('watchButton').addEventListener('click', function () {
        document.getElementById('Pdivs').scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Function to scroll to top
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('top').addEventListener('click', function () {
        document.getElementById('main').scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Function to show PersonalData
document.addEventListener('DOMContentLoaded', () => {
    PersonalData = getFromLocalStorage();
    const showPersonalDataButton = document.getElementById('showPersonalDataButton');
    showPersonalDataButton.addEventListener('click', () => {
        pdataShow(PersonalData);
    });
});

// Function to fetch data and display it
data();
