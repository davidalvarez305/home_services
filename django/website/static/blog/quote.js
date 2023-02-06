var serviceSelect = document.getElementById('service');
var CRM_DOMAIN = JSON.parse(document.getElementById('crm_domain').textContent);

function createOption(value, service) {
    var opt = document.createElement('option');
    opt.value = value;
    opt.innerHTML = service;
    serviceSelect.appendChild(opt);
}

document.addEventListener('DOMContentLoaded', function (e) {
    fetch(CRM_DOMAIN + '/api/service', {
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