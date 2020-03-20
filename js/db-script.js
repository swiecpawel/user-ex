let elem = document.querySelector('#data');
const companiesSite = "http://localhost:3000/companies";
const usersSite = "http://localhost:3000/users";


let table ="";
let units = 0; // from {units} to 10 elements
load();

async function load() {

    let user            = await fetch(usersSite).then(res => res.json());
    let companies       = await fetch(companiesSite).then(res => res.json());
    let sortedCompanies = await sortCompanyById(user,companies);

   paginationCompany(sortedCompanies, units);
   elem.insertAdjacentHTML('beforeend', table);
   ;
}


async function reduceFunction(uri){

    let idCompany = document.getElementById(uri);
    let idButton = document.getElementById(uri+"but");
    let usersTable = "";

    await fetch(usersSite).then(res => res.json())
        .then(data => data.filter(el => el.uris.company === uri))
        .then(data => data.forEach(us => {
            usersTable += `<tr class="${uri}cls"><td>${us.name}</td><td>${us.email}</td><td></td></tr>`
        }))
        .then(() => idCompany.insertAdjacentHTML('afterend', usersTable)).then(() => idButton.style.display="none")
}

function sortCompanyById(users, companies){

    let uri;
    let wObject;

    companies.map(function(el){
        el.usersAmount = 0;
    });


    companies.forEach( el => {
        uri = el.uri;
        wObject = users.filter(el => el.uris.company === uri);
        el.usersAmount = wObject.length;
    });

    companies.sort(function(a, b) {
        return a.usersAmount - b.usersAmount;
    });

    return companies;
}

function paginationCompany(srtCompanies, limit) {


    for (let i = limit; i < limit + 10; i++) {
        let company = srtCompanies[i];
        if (company.usersAmount > 0) {
            table += `<tr id="${company.uri}"><td>${company.name}</td><td>USERS: ${company.usersAmount}</td><td><button id="${company.uri}but" class="btn btn-light" onclick="reduceFunction('${company.uri}')">Show users</button>`;
        } else if (company.usersAmount > 0) {
            table += `<tr id="${company.uri}"><td>${company.name}</td><td>USER: ${company.usersAmount}</td><td><button id="${company.uri}but" class="btn btn-light" onclick="reduceFunction('${company.uri}')">Show user</button>`;
        } else {
            table += `<tr id="${company.uri}"><td>${company.name}</td><td>NO USER</td><td><button id="${company.uri}but" class="btn btn-light">No user</button>`;
        }
    }
}

function nextPage(){
    if(units < 989) {
        units += 10;
        table = "";
        elem.innerHTML="";
        load()
    }
}

function prevPage() {
    if(units > 9){
        units -= 10;
        table = "";
        elem.innerHTML="";
        load()
    }
}