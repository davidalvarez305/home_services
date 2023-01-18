var serviceSelect = document.getElementById('service');

function createOption(value, service) {
    var opt = document.createElement('option');
    opt.value = value;
    opt.innerHTML = service;
    serviceSelect.appendChild(opt);
}

document.addEventListener('DOMContentLoaded', function (e) {
    fetch('http://localhost:4015/api/service', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
    .then((res) => res.json())
    .then((response) => {
        const services = response.data;

        services.forEach(({ id, service }) => {
            createOption(id, service);
        });

    }).catch(console.error);
});