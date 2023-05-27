const url = 'http://95.130.227.52:3010'
const table = 'worker'

let inputs = document.querySelectorAll('#addDep [name]')
let tableWorkers = document.querySelector('.table tbody')

let workers = []
let worker = {}

const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr']

const addZero = val => val < 10 ? `0${val}` : val

const parseDate = (date) => {
    let d = new Date(date)

    return `${addZero(d.getHours())}:${addZero(d.getMinutes())} ${addZero(d.getDate())}-${months[d.getMonth()]} ${d.getFullYear()} y.`
}

// Renderlash
const render = (list) => {
    tableWorkers.innerHTML = ''
    list.forEach((item, index) => {
        tableWorkers.innerHTML += `
        <tr>
            <td>${index+1}</td>
            <td>${item.name}</td>
            <td>${item.lname}</td>
            <td>${item.email}</td>
            <td>${item.address}</td>
            <td>${item.age}</td>
            <td>${parseDate(item.createdTime)}</td>
            <td>${item.phone}</td>
            <td>${item.department}</td>
            <td>${item.status == 1 ? 'Faol' : 'Nofaol'}</td>
            <td>${item.salary}</td>
            <td class="text-end">
                <button 
                type="button" 
                class="btn btn-danger"
                onclick="deleteWorker('${item._id}')"
                >
                <i class="bi bi-x"></i>
                </button>
                <button 
                type="button" 
                class="btn btn-warning"
                onclick="editWorker('${item._id}')"
                >
                <i class="bi bi-pencil"></i>
                </button>
            </td>
        </tr>`
    })
}

const getWorkers = async () => {
    let res = await axios.get(`${url}/${table}`)
    if (res.status == 200) {
        workers = res.data
        console.log(workers)
    }
    render(workers)
}

// Qo'shish
const addWorkers = () => {
    inputs.forEach((el) => {
        worker[el.getAttribute('name')] = el.value;
    })

    console.log("WORKER:", worker)
    const res = fetch(`${url}/${table}`, {
        method: "post",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(worker)
    }).then(res => res.json()).then(response => {

        console.log("Response", response.data)
        if (res.status === 201) {
            workers = [res.data, ...workers];
            // render(workers);
        }
    }).catch(e => {
        console.log("Axios error", e)
    })
};


// O'chirish
const deleteWorker = _id => {
    if (confirm('Ishonchingiz komilmi?')) {
        axios.delete(`${url}/${table}/${_id}`)
            .then(() => {
                workers = workers.filter(wInfo => wInfo._id !== _id)
                render(workers)
            })

    }
}

getWorkers()