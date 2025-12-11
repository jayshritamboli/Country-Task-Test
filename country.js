const cl = console.log;

const loader = document.getElementById('loader')

function toggleSpinner(flag) {
    if (flag) {
        loader.classList.remove('d-none')
    } else {
        loader.classList.add('d-none')
    }
}

function snackbar(icon, title) {
    Swal.fire({
        icon,
        title,
        timer: 3000
    });
}

const param = new URLSearchParams(window.location.search);
const code = param.get("code");


const COUNTRY_URL = `https://restcountries.com/v3.1/alpha/${code}`;


const patchData = (data) => {
    document.getElementById("flagImg").src = data.flags.png;
    document.getElementById("countryName").innerText = data.name.common;
    document.getElementById("officialName").innerText = data.name.official || data.name.common;
    document.getElementById("capital").innerText = (data.capital && data.capital[0]) || "N/A";
    document.getElementById("region").innerText = data.region || "N/A";
    document.getElementById("subRegion").innerText = data.subregion || "N/A";
    document.getElementById("population").innerText = data.population || "N/A";
    document.getElementById("area").innerText = data.area || "N/A";

    document.getElementById("languages").innerText =
        Object.values(data.languages || {}).join(", ") || "N/A";

    document.getElementById("currencies").innerText =
        Object.values(data.currencies || {})
        .map(c => `${c.name} (${c.symbol})`)
        .join(", ") || "N/A";

    cl(data.maps.googleMaps);

    document.getElementById("maps").href = data.maps.googleMaps;
    document.getElementById("maps").innerText = "Open in Map";

    const codeMap = JSON.parse(localStorage.getItem("Data") || "{}");
    cl(codeMap);

    if (data.borders) {
    document.getElementById("borders").innerHTML = data.borders
        .map(c => {
            return `<a href="country.html?code=${c}" class="btn btn-primary btn-sm m-1">
                        ${codeMap[c] || c}
                    </a>`;
        })
        .join(" ");
} else {
    document.getElementById("borders").innerHTML = `<strong>No Borders</strong>`;
}

}

const loadCountry = async () => {
    toggleSpinner(true)
    try {

        let res = await fetch(COUNTRY_URL, {

            method: "GET",
            body: null,
            headers: {
                auth: "token",
                "content-type": "application/json"
            }
        })

        let data = await res.json();
        if (!res.ok) {
            let err = data.error;
            throw new Error(err);
        }
        let Cdata = data[0];
        cl(Cdata);
        patchData(Cdata);
    }
    catch (err) {
        cl(err);
    }
   finally{
    toggleSpinner(false)
   }
}

loadCountry();




