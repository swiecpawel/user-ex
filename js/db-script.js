let elem = document.querySelector('#data');
const companiesSite = "http://localhost:3000/companies";
const usersSite = "http://localhost:3000/users";

load();
let table ="";

async function load() {

    let user            = await fetch(usersSite).then(res => res.json());
    let companies       = await fetch(companiesSite).then(res => res.json());
    let sortedCompanies = await sortCompanyById(user,companies);

    sortedCompanies.forEach(arr => {
        if (arr.usersAmount > 1) {
            table += `<tr id="${arr.uri}"><td>${arr.name}</td><td>USERS: ${arr.usersAmount}</td><td><button id="${arr.uri}but" class="btn btn-light" onclick="reduceFunction('${arr.uri}')">Show users</button>`;
        }else if (arr.usersAmount > 0){
            table += `<tr id="${arr.uri}"><td>${arr.name}</td><td>USER: ${arr.usersAmount}</td><td><button id="${arr.uri}but" class="btn btn-light" onclick="reduceFunction('${arr.uri}')">Show user</button>`;
        }else {
            table += `<tr id="${arr.uri}"><td>${arr.name}</td><td>NO USER</td><td><button id="${arr.uri}but" class="btn btn-light">No user</button>`;
        }
    });

    elem.insertAdjacentHTML('beforeend', table);
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