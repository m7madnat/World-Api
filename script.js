let myChart;
let countryName , population , citiesName , citiesPopulation = []
const h2 = document.getElementById("errormsg");
const spinner = document.querySelector(".hide");

const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
};

// Get all countries in a region 
const getRegions = async (region) => {
    try {
        let isLoading = true;
        setSpinner(isLoading);
        let data = await fetchData(`https://restcountries.com/v3.1/region/${region}`)
        console.log(data);
        data.forEach((x) => {
            countryName.push(x.name.common)
            population.push(x.population)
        })
        isLoading = false;
        setSpinner(isLoading);
        return data
    } catch (err) {
        console.log(err)
    }
}

const listOfCountries = async (countryName) => {
    let list = document.querySelector(".list")
    list.innerHTML = ""
    countryName.forEach((x) => {
        let btn = document.createElement("button")
        btn.classList.add("list")
        btn.innerText = x
        list.appendChild(btn)
    })
}

const buildChart = async () => {
    let regionsBtn = document.querySelector(".regions")
    let isLoading = true;
    regionsBtn.addEventListener("click", async (x) => {    
        if(x) {
        setSpinner(isLoading);
        countryName = []
        population = []
        let region = x.target.classList.value
        console.log(x.target.classList.value);
        let results = await getRegions(region)
        console.log(results);
        createChart(countryName, population)
        listOfCountries(countryName)
        isLoading = false;
        setSpinner(isLoading);
        }
    })
}

const setSpinner = (bool) => {
    if (bool) {
        spinner.classList.remove("hide");
    } else {
        spinner.classList.add("hide");
    }
};

// Get all cities in a country 
const postCities = async (country) => {     
    try {
        let res = await fetch('https://countriesnow.space/api/v0.1/countries/population/cities/filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'country': country,
            }),
        });
        if (!res.ok) {
            h2.innerText = "No data found"
            throw new Error('Something went wrong');
        }
        const data = await res.json();
        return data;
    } catch (err) {
        console.log(err);
    }
};

const getCities = async (country) => {
    try {
        let isLoading = true;
        setSpinner(isLoading);
        let data = await postCities(country)
        console.log(data);
        data.data.forEach((x) => {
            citiesName.push(x.city)
            citiesPopulation.push(x.populationCounts[0].value)
        })
        isLoading = false;
        setSpinner(isLoading);
        return data
    } catch (err) {
        console.log(err)
    }

}

const buildCities = async () => {
    let countrybtn = document.querySelector(".list");
    let isLoading = true;
    countrybtn.addEventListener("click", async (e) => {
        if(e.target.classList.contains("list")) {            
        setSpinner(isLoading);
        h2.innerText = ""
        citiesName = []
        citiesPopulation = []
        let countryName = e.target.innerText;
        let res = await getCities(countryName);
        console.log(res);        
        createChart(citiesName, citiesPopulation);          
        isLoading = false;
        setSpinner(isLoading);
        }
    });
};

function createChart(countryName, population) {    
    if (myChart) {
        myChart.destroy()
    }
    myChart = new Chart(document.getElementById('myChart'), {
        type: 'line',
        data: {
            labels: countryName,
            datasets: [{
                label: '# of Countries',
                data: population,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


buildChart()
buildCities()