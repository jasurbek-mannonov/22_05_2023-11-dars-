const url = 'http://95.130.227.52:3010'
const table = 'worker'

let addDep = document.querySelector('#addDep')
let inputs = document.querySelectorAll('#addDep [name]')
let tableWorkers = document.querySelector('.table tbody')

//Xodimning qaysi bo'limga mansubligini Modal ichidagi sectiondan tanlay olishi kerak 
let workerDepartment = document.getElementById("department-select");
let optionTitles = []; // Array to store option titles

let workers = []
let worker = {}

const showModal = new bootstrap.Modal('#showWorker', {
    keyboard: false
})
const showModalToggle = document.getElementById('showWorker')


const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr']

const addZero = val => val < 10 ? `0${val}` : val

const parseDate = (date) => {
    let d = new Date(date)

    return `${addZero(d.getHours())}:${addZero(d.getMinutes())} ${addZero(d.getDate())}-${months[d.getMonth()]} ${d.getFullYear()} y.`
}

// Xodimning qaysi bo'limga mansubligini belgilash uchun
const getPost = async () => {
    const response = await axios.get("http://95.130.227.52:3010/department");
    return response.data;
};

const displayOption = async () => {
    const options = await getPost();
    for (const option of options) {
        const newOption = document.createElement("option");
        newOption.value = option._id;
        newOption.text = option.title;
        workerDepartment.appendChild(newOption);
        optionTitles.push(option.title);
    }
};

const accessOptionTitles = async () => {
    await displayOption();
    optionTitles.forEach((title) => {});
};

accessOptionTitles();

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
            <td>${item.phone}</td>
            <td>${item.department.title}</td> 
            <td>${item.status == 1 ? 'Faol' : 'Nofaol'}</td>
            <td class="text-end">
                <button 
                type="button" 
                class="btn btn-success"
                onclick="showWorker('${item._id}')"
                >
                <i class="bi bi-eye"></i>
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

    }
    render(workers)
}

// Qo'shish
const addWorkers = async () => {
    let worker = {}
    inputs.forEach(input => {
        worker[input.getAttribute('name')] = input.value
    })
    console.log(worker)
    let res = await axios.post(`${url}/${table}`, worker)
    if (res.status == 201) {
        workers = [res.data, ...workers]
        render(workers)
    }
}

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

const showWorker = async (id) => {
    let res = await axios.get(`${url}/${table}/get/${id}`)
    if(res.status == 200){
        let s = res.data
        let str = `
        <h3 class="text-center">${s.lname} ${s.name}</h3>
        <h4 class="text-center">${s.department?.title || "Bo'lim qayd etilmagan!"}</h4>
        <table class="table">
          <tr>
              <td>Yosh</td>
              <td class="text-end">${s.age}</td>
          </tr>
          <tr>
              <td>Telefon raqam:</td>
              <td class="text-end">${s.phone}</td>
          </tr>
          <tr>
              <td>Email:</td>
              <td class="text-end">${s.email}</td>
          </tr>
          <tr>
              <td>Manzil:</td>
              <td class="text-end">${s.address}</td>
          </tr>
          <tr>
              <td>Ishga kelgan vaqt:</td>
              <td class="text-end">${parseDate(s.createdTime)}</td>
          </tr>
          <tr>
              <td>Maosh:</td>
              <td class="text-end">${s.salary}</td>
          </tr>
        </table>
        `;
        document.querySelector('#showWorker .modal-body').innerHTML = str
        showModal.show(showModalToggle)
    }
}

getWorkers()