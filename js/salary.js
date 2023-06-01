const url = 'http://95.130.227.52:3010'
const table = 'salary'

let addSal = document.querySelector('#addSal')
let inputs = document.querySelectorAll('#addSal [name]')
let tableSalaries = document.querySelector('#salaryTable tbody')

let summaH4 = document.getElementById("summa")
let nameMonth = document.getElementById('nameMonth')
let currentMonth = document.getElementById('currentMonth')

let workerDepartment = document.getElementById("workers");
let optionTitles = []

let workers = []
let salary = {}
let salaries = []

const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr']

let today = new Date()
nameMonth.innerHTML = `${months[today.getMonth()]}`; 

const addZero = val => val < 10 ? `0${val}` : val

const parseDate = (date) => {
    let d = new Date(date)
    return `${addZero(d.getHours())}:${addZero(d.getMinutes())} ${addZero(d.getDate())}-${months[d.getMonth()]} ${d.getFullYear()} y.`
}

const getWorkers = async() => {
    let res = await axios.get(`${url}/worker`)
    if(res.status == 200){
        workers = [...res.data]
        let s = 0
        workers.forEach(worker => {
            s += worker.salary
            workerDepartment.innerHTML += `
                <option value=${worker._id}>
                    ${worker.lname} ${worker.name}
                </option>
            `;
        })
        summaH4.innerHTML = `${s.toLocaleString()} so'm`
    }
}

getWorkers()

const getSalaries = async () => {
    let res = await axios.get(`${url}/${table}`)
    if(res.status == 200){
        salaries = [...res.data]
      
        render(salaries)
    }
}

getSalaries()

const render = (list) => {
    let monthSumma = 0
    tableSalaries.innerHTML = ''
    list.forEach((item, index) => {
        let date = new Date(item.createdTime)
        if(date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear()){
            monthSumma += item.summary;
        }
        tableSalaries.innerHTML += `
        <tr>
            <td>${index+1}</td>
            <td>${item.worker?.name || "Ism kiritilmagan"} ${item.worker?.lname || "Familiya kiritilmagan"}</td>
            <td>${item.worker?.department.title || "Bo'lim qayd etilmagan"}</td> 
            <td>
            ${item.worker?.salary.toLocaleString() + " so'm"|| "To'lov qayd etilmagan"}
            </td>
            <td>${item.summary.toLocaleString()} so'm</td>
            <td>${parseDate(item.createdTime)}</td>
            <td>${item.status == 1 ? 'Faol' : 'Nofaol'}</td>
            <td class="text-end">
                <button 
                type="button" 
                class="btn btn-success"
                onclick="showSalary('${item._id}')"
                >
                <i class="bi bi-eye"></i>
                <button 
                type="button" 
                class="btn btn-danger"
                onclick="deleteSalary('${item._id}')"
                >
                <i class="bi bi-x"></i>
                </button>
                <button 
                type="button" 
                class="btn btn-warning"
                onclick="editSalary('${item._id}')"
                >
                <i class="bi bi-pencil"></i>
                </button>
            </td>
        </tr>`
        currentMonth.innerHTML = `${monthSumma.toLocaleString()} so'm`
    })
}

const addSalary = async() => {
    salary = {}
    inputs.forEach(input => {
        salary[input.getAttribute('name')] = input.value
        input.value = ''
    })
    let res = await axios.post(`${url}/${table}`, salary)
    if(res.status === 201){
        salaries = [res.data, ...salaries]
        render(salaries)
    }
}

const deleteSalary = async (id) => {
   if(confirm("Qaroringiz qat'iymi?")){
    let res = await axios.delete(`${url}/${table}/${id}`)
    if(res.status == 200){
        salaries = salaries.filter(salary => {
            if (salary._id === id) return false
            return salary
        })
        render(salaries)
    }
   }
}