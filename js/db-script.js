let elem = document.querySelector('#table-body');
const companiesSite = "http://localhost:3000/companies";
const usersSite = "http://localhost:3000/users";
let table ="";
let units = 0; //start unit
let sortedCompanies = loadAll();
sortedCompanies.then(el => renderCompany(el, units));
async function loadAll() {
    const user            = await fetch(usersSite).then(res => res.json());
    const companies       = await fetch(companiesSite).then(res => res.json());
    const sortedCompanies = await sortCompanyById(user,companies);
    return sortedCompanies;
}
function sortCompanyById(users, companies){
    let uri;
    let sortedCompaniesAddedUsers;
    companies.map(company => {
        company.usersAmount = 0;
        company.users = {};
    });
    companies.forEach( company => {
        uri = company.uri;
        sortedCompaniesAddedUsers = users.filter(company => company.uris.company === uri);
        company.usersAmount = sortedCompaniesAddedUsers.length;
        company.users = sortedCompaniesAddedUsers;
    });
    companies.sort((a, b) => a.usersAmount - b.usersAmount);
    return companies;
}
function renderCompany(srtCompanies, limit) {
    for (let i = limit; i < limit + 10; i++) {
        let company = srtCompanies[i];
        table += `<tr id="${company.uri}"><td>${company.name}</td><td class="td_weight">${company.usersAmount}</td>
                  <td><button id="${company.uri}but" class="btn btn-light" 
                  onclick="showUsers('${company.uri}', ${company.usersAmount}, ${company.usersAmount})" >
                  Show users</button></td></tr>`;
        company.users.forEach( (us) =>{
            table += `<tr style="display: none"><td>${us.name}</td><td>${us.email}</td><td></td></tr>`
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
        sortedCompanies.then(el => renderCompany(el, units))
    }
}
function prevPage() {
    if(units > 9){
        units -= 10;
        table = "";
        elem.innerHTML="";
        sortedCompanies.then(el => renderCompany(el, units))
    }
}
function showUsers(uri, users) {
    let displayedCompany = document.getElementById(`${uri}`).nextSibling;
    if (users > 0) {
        if (displayedCompany.style.display === 'none')
        for(let i=0; i < users; i++){
            displayedCompany.style.display = '';
            displayedCompany = displayedCompany.nextSibling;
        } else {
            for(let i=0; i < users; i++){
                displayedCompany.style.display = 'none';
                displayedCompany = displayedCompany.nextSibling;
            }
        }
    }
}






