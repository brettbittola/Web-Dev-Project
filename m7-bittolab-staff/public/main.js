'use strict';

function newRow(user, tableDataGenerated) {


    tableDataGenerated.innerHTML += `
    <tr>
        <td><img src="${user.picture.thumbnail}" alt="${user.name.first} ${user.name.last}" /></td>
        <td>
            <a href="mailto:${user.email}">
            ${user.name.first}
            ${user.name.last}</a>
        </td>
        <td class="middle">${user.phone}</td>
        <td class="middle">${user.location.timezone.description}</td>
    </tr>`;
}

async function getNewPerson(event) {
    event.preventDefault();

    const randomGenerator = "https://randomuser.me/api";
    const tableDataGenerated = document.getElementById("dataGenerated");

    try {
        const retrieve = await fetch(randomGenerator);
        const answer = await retrieve.json();

        newRow(answer.results[0], tableDataGenerated); 
        document.getElementById('right').textContent = 'A new staff member has just been hired!';
    } catch (error) {
        console.error("Something went wrong.", error);
        document.getElementById('errorMessage').textContent = 'This staff member could not be hired. Something went wrong with the API.';

    }
}

document.addEventListener('DOMContentLoaded', () => { 
    const click = document.getElementById('newMember'); 
    click.addEventListener('click', getNewPerson); 
}); 