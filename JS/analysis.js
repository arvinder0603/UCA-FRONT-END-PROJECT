

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

// Load PersonalData from localStorage on page load
let PersonalData = getFromLocalStorage();

// Function to save PersonalData to localStorage
function saveToLocalStorage(data) {
    localStorage.setItem('PersonalData', JSON.stringify(data));
}

// Function to retrieve PersonalData from localStorage
function getFromLocalStorage() {
    const data = localStorage.getItem('PersonalData');
    return data ? JSON.parse(data) : [];
}




//This function is responsible for ->
//  1.) Fetching data live from api and local storage
//  2.) This function filter out coins present in our local storage and live data to make charts for difference
//  3.) creating charts using apax charts
//  4.) Creating a list of names of coins present in our local storage and creating tolip on it


async function data() {
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        corpus = result.data.coins;

        let chartData = corpus
            .filter(coin => PersonalData.some(item => item.Name === coin.name))
            .map(coin => {
                const localCoin = PersonalData.find(item => item.Name === coin.name);
                

                // Calculate Profit and Loss
                const livePrice = coin.price;
                const localPrice = localCoin ? localCoin.Price : null;
                const profit = localPrice ? livePrice - localPrice : null;
                const loss = localPrice ? localPrice - livePrice : null;

                return {
                    Name: coin.name,
                    LivePrice: livePrice,
                    LocalPrice: localPrice,
                    Profit: profit >= 0 ? profit : 0, // Show 0 if profit is negative
                    Loss: loss >= 0 ? loss : 0 
                };
            });

        const chartOptions = {
            chart: {
                type: 'line',
            },
            xaxis: {
                categories: chartData.map(coin => coin.Name)
            },
            title: {
                text: 'Coin Prices Comparison'
            },
            series: [{
                name: 'Live Price',
                data: chartData.slice(0, 10).map(coin => coin.LivePrice)
            }, {
                name: 'Local Price',
                data: chartData.slice(0, 10).map(coin => coin.LocalPrice)
            }, {
                name: 'Profit',
                data: chartData.slice(0, 10).map(coin => coin.Profit)
            }, {
                name: 'Loss',
                data: chartData.slice(0, 10).map(coin => coin.Loss)
            }]
        };

        const lineColumnChartOptions = {
          chart: {
              type: 'line',
              height: 350,
          },
          stroke: {
              width: [0, 4],
          },
          title: {
              text: 'Coin Prices Comparison',
              align: 'left',
          },
          dataLabels: {
              enabled: true,
              enabledOnSeries: [1]
          },
          labels: chartData.map(coin => coin.Name),
          xaxis: {
              type: 'string',
          },
          yaxis: [
              {
                  title: {
                      text: 'Price',
                  },
              },
              {
                  opposite: true,
                  title: {
                      text: 'Profit/Loss',
                  },
              },
          ],
          series: [
              {
                  name: 'Live Price',
                  type: 'column',
                  data: chartData.slice(0, 10).map(coin => coin.LivePrice)
              },
              {
                  name: 'Local Price',
                  type: 'column',
                  data: chartData.slice(0, 10).map(coin => coin.LocalPrice)
              },
              {
                  name: 'Profit',
                  type: 'line',
                  yaxis: 1,
                  data: chartData.slice(0, 10).map(coin => coin.Profit)
              },
              {
                  name: 'Loss',
                  type: 'line',
                  yaxis: 1,
                  data: chartData.slice(0, 10).map(coin => coin.Loss)
              },
          ],
          legend: {
              position: 'top',
              horizontalAlign: 'left',
          },
      };
      
        const chart = new ApexCharts(document.getElementById('chart'), chartOptions);
        const lineColumnChart = new ApexCharts(document.getElementById('chartColumn'), lineColumnChartOptions);

        chart.render();
        lineColumnChart.render();



        const mainDiv = document.getElementById('block');

        PersonalData.forEach(coin => {
          const card = document.createElement("div");
          card.classList.add('card');
      
          const name = document.createElement("button");
          name.innerHTML = coin.Name;
          name.classList.add('name');
      
          name.addEventListener('mouseover', () => {
            const selectedCoin = chartData.find(data => data.Name === coin.Name);
            const tooltip = document.getElementById('tooltip');
            if (selectedCoin) {
                tooltip.innerHTML = `
                    <div>Live Price: ${selectedCoin.LivePrice}</div>
                    <div>Local Price: ${selectedCoin.LocalPrice}</div>
                    <div>Profit: ${selectedCoin.Profit}</div>
                    <div>Loss: ${selectedCoin.Loss}</div>
                `;
                tooltip.style.display = 'block';
            } else {
                tooltip.innerHTML = 'Data not found for the selected coin.';
                tooltip.style.display = 'block';
            }
        });
        
        name.addEventListener('mouseout', () => {
            const tooltip = document.getElementById('tooltip');
            tooltip.style.display = 'none';
        });
        
      
          card.appendChild(name);
          mainDiv.appendChild(card);
      });
      


    } catch (err) {
        console.error(err);
    }
}



//function call
data();
