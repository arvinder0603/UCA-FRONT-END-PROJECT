

//Function Calling ->  data -> display -> SaveToLocalStorage -> pdataShow ->  deleteItemByName





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





//this code is used  for Dom function scrollview this help us when we click on 
//........watch button present on top of page this take to part of website where data from local storage is present
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('watchButton').addEventListener('click', function () {
        document.getElementById('Pdivs').scrollIntoView({
            behavior: 'smooth'
        });
    });
});



//Same goes with this fuction it takes us from bottom of page to top of the page
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('top').addEventListener('click', function () {
        document.getElementById('main').scrollIntoView({
            behavior: 'smooth'
        });
    });
});







// IN this function we create html elemments and give them class name and assign them value using map function 
// we have a button in this function at last to add element to our local storage to lock the prices of coins.

function display(data) {
    const mainDiv = document.getElementById('block');

    data.forEach((coin,indx) => {

      
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
                PersonalData.push({
                    "Name": coin.name,
                    "Price": coin.price,
                    "Rank": coin.rank,
                    "MarketCap": coin.marketCap,
                    "IconUrl": coin.iconUrl
                });

                saveToLocalStorage(PersonalData); // Save to localStorage
               
                pdataShow(PersonalData);
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

        const button = document.createElement("button");
        button.innerHTML = "Remove";
        button.classList.add('Btn');

        button.addEventListener('click', () => {
            deleteItemByName(coin.Name);

        })

        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(price);
        card.appendChild(rank);
        card.appendChild(Mcap);
        card.appendChild(button)

        Pdiv.appendChild(card);
    });
}







//this function used button showpdata from front end and onclick render data from local storage
document.addEventListener('DOMContentLoaded', () => {
    PersonalData = getFromLocalStorage();

    // Get the button element
    const showPersonalDataButton = document.getElementById('showPersonalDataButton');

    // Add a click event listener to the button
    showPersonalDataButton.addEventListener('click', () => {
        // Call the function to display personal data
        pdataShow(PersonalData);
    });
});





// In this function we fetch data and use our display function to render data
const data = async () => {
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        corpus = result.data.coins;
        display(corpus);
    } catch (error) {
        console.error(error);
    }
}




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




//this function help us to delete data from our personalData or lock data from local storage
function deleteItemByName(name) {

    PersonalData = PersonalData.filter(item => item.Name !== name);
    saveToLocalStorage(PersonalData);

    pdataShow(PersonalData)
}


// Main function call which after fetching data render data on front-end
data();