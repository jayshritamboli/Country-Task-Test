 const cl =console.log;

const countriesRow = document.getElementById('countriesRow')
const loader = document.getElementById('loader')



function snackBar(title,icon) {

    Swal.fire({
        title,
        icon,
        timer:1000
    })
    
}

function toggleSpinner(flag) {

    if(flag){
        loader.classList.remove('d-none')
    }else{
        loader.classList.add('d-none')
    }
    
}


const BASE_URL = `https://restcountries.com/v3.1/all`;
const COUNTRY_URL =`${BASE_URL}/?fields=name,cca2,flags,region`




const makeApiCall = async(apiUrl,methodName,msgBody)=>{

    toggleSpinner(true)

    msgBody= msgBody ? JSON.stringify(msgBody) : null

    let obj = {
        method:methodName,
        body:msgBody,
        headers:{
            "content-type":"application/json"
        } 
    }
    try{
        let res = await fetch (apiUrl,obj);
        let data = await res.json();

        if(!res.ok){
            let err = data.error || res.statusText ||`Something went wrong`

            throw new Error(err);
            
        }
        return data
    }
    finally{
        toggleSpinner(false)
    }
}



async function fetchAllCountries(){
    try{
        
        let data = await makeApiCall(COUNTRY_URL,"GET",null)


            data.map(c =>{
                const div =document.createElement('div')
                div.className = `col-12 col-sm-6 col-md-4 col-lg-3 mb-3`
                
                div.innerHTML = `<div 
                class="card country-card text-center shadow-sm h-100" 
                role="button"
                data-code ="${c.cca2}"
                >
                    
                    <img 
                    src="${c.flags.png}" 
                    alt="${c.flags.alt}"
                    class="country-flag"
                    style="height: 140px; object-fit: cover;"
                    loading = "lazy"
                    />
                    
                    <div class="card-body">
                    <h5 class="country-name mb-1">${c.name.common || c.name.official}</h5>
                    <p class=" country-code text-muted mb-0"><small>Code: <span class="fw-bold">${c.cca2}</span></small></p>
                    </div>

                </div>`

                div.addEventListener('click', () => {
                window.location.href = `country.html?code=${c.cca2}`;
            })
                countriesRow.append(div)
            })
    }catch(err){
       snackbar(`Failed to fetch countries`,"error")
    }
}
fetchAllCountries();





