let elem = document.querySelector('#data');
const companiesSite = "http://localhost:3000/companies";
const usersSite = "http://localhost:3000/users";


let table ="";
let units = 0; // from {units} to 10 elements
let usersTab = "";
load();

console.log(elem);

async function load() {

    let user            = await fetch(usersSite).then(res => res.json());
    let companies       = await fetch(companiesSite).then(res => res.json());
    let sortedCompanies = await sortCompanyById(user,companies);

    paginationCompany(sortedCompanies, units);

}


function sortCompanyById(users, companies){

    let uri;
    let wObject;

    companies.map(function(el){
        el.usersAmount = 0;
        el.users = {};
    });

    companies.forEach( el => {
        uri = el.uri;
        wObject = users.filter(el => el.uris.company === uri);
        el.usersAmount = wObject.length;
        el.users = wObject;
    });

    companies.sort(function(a, b) {
        return a.usersAmount - b.usersAmount;
    });

    return companies;
}

function paginationCompany(srtCompanies, limit) {


    for (let i = limit; i < limit + 10; i++) {

        let company = srtCompanies[i];

        table += `<tr id="${company.uri}"><td>${company.name}</td><td>${company.usersAmount}</td>
                  <td><button id="${company.uri}but" class="btn btn-light" 
                  onclick="showUsers('${company.uri}', ${company.usersAmount}, ${company.usersAmount})" >
                  Show users</button></td></tr>`;

        company.users.forEach( (us) =>{
            table += `<tr style="display: none"><td>${us.name}</td><td>${us.email}</td></tr>`
            }
        )

    }

    elem.insertAdjacentHTML('beforeend', table)

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

function showUsers(uri, children) {
    let idCompany = document.getElementById(uri).nextSibling;

    if (children > 0) {
        if (idCompany.style.display === 'none')
        for(let i=0; i < children; i++){
                 idCompany.style.display = 'block';
                idCompany = idCompany.nextSibling;
        } else {
            for(let i=0; i < children; i++){
                idCompany.style.display = 'none';
                idCompany = idCompany.nextSibling;
            }
        }
    }
}






