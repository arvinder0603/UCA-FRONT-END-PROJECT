const url = 'https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers%5B0%5D=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'df4f4523femshf6b54f426093886p14eec8jsn17840ae4b6c0',
		'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
	}
};


function display(data) {
    const mainDiv = document.getElementById('block');

    data.forEach(coin => {
        const name = coin.name;
        const heading = document.createElement("h1");
        heading.innerHTML = name;
        mainDiv.appendChild(heading);
    });
}

let corpus = [];

const data = async () => {
	try {
		const response = await fetch(url, options);
		const result = await response.json();
		corpus = [...result.data.coins];
		console.log(corpus);
		display(corpus)
	} catch (error) {
		console.error(error);
	}
}

data();



