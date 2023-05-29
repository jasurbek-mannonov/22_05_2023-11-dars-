const url = 'http://95.130.227.52:3010'
const table = 'worker'

let fname = document.getElementById('name')
let lname = document.getElementById('lname')
let email = document.getElementById('email')
let address = document.getElementById('address')
let age = document.getElementById('age')
let phone = document.getElementById('phone')
let salary = document.getElementById('salary')

let addDep = document.querySelector('#addDep')
let inputs = document.querySelectorAll('#addDep [name]')
let tableWorkers = document.querySelector('.table tbody')

//Xodimning qaysi bo'limga mansubligini Modal ichidagi sectiondan tanlay olishi kerak 
let workerDepartment = document.getElementById("department-select");
let optionTitles = []; // Array to store option titles

let workers = []
let worker = {}

 
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
      newOption.value = option.title;
      newOption.text = option.title;
      workerDepartment.appendChild(newOption);
      optionTitles.push(option.title);
    }
  };
  
  const accessOptionTitles = async () => {
    await displayOption();
    optionTitles.forEach((title) => {
    });
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
            <td>${item.address}</td>
            <td>${item.age}</td>
            <td>${parseDate(item.createdTime)}</td>
            <td>${item.phone}</td>
            <td>${optionTitles[index]}</td>
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
        
    }
    render(workers)
}

// Qo'shish
const addWorkers = async () => {
    let res = await axios.post(`${url}/${table}`,{
        name: fname.value,
        lname: lname.value,
        email: email.value,
        address: address.value,
        age: age.value,
        phone: phone.value,
        // department: optionTitles,
        salary: salary.value
    })
    if(res.status == 201){
       workers = [res.data,...workers]
       render(workers)
    }
}
// console.log(workers)

  

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