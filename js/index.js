const url = 'http://95.130.227.52:3010'
const dep = 'department'

let departments = []
let department = {}
let tableBody = document.querySelector('table tbody')
let inputTitle = document.getElementById('title')
let uptitle = document.getElementById('uptitle')
let upstatus = document.getElementById('upstatus')

const months = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentyabr','Oktyabr','Noyabr','Dekabr']

// Yangi qo'shish uchun
const addModal = new bootstrap.Modal('#addDep', {
    keyboard: false
})
const modalToggle = document.getElementById('addDep')

// Tahrirlash uchun 
const editModal = new bootstrap.Modal('#editDep', {
    keyboard: false
})
const editModalToggle = document.getElementById('editDep')

const addZero = val => val < 10 ? `0${val}` : val

const parseDate = (date) => {
    let d = new Date(date)

    return`${addZero(d.getHours())}:${addZero(d.getMinutes())} ${addZero(d.getDate())}-${months[d.getMonth()]} ${d.getFullYear()} y.`
}

// Renderlash
const render = (list) => {
    tableBody.innerHTML = ''
    list.forEach((item, index) => {
        tableBody.innerHTML += `
        <tr>
            <td>${index+1}</td>
            <td>${item.title}</td>
            <td>${parseDate(item.createdTime)}</td>
            <td>${item.status == 1 ? 'Faol' : 'Nofaol'}</td>
            <td class="text-end">
                <button 
                type="button" 
                class="btn btn-danger"
                onclick="deleteDep('${item._id}')"
                >
                <i class="bi bi-x"></i>
                </button>
                <button 
                type="button" 
                class="btn btn-warning"
                onclick="editDep('${item._id}')"
                >
                <i class="bi bi-pencil"></i>
                </button>
            </td>
        </tr>`
    })
}

// Olish
const getDepartments = async () => {
    let res = await axios.get(`${url}/${dep}`)
    if(res.status == 200){
        departments = res.data
    }
    render(departments)
}

// Qo'shish
const addDepart = async () => {
    let res = await axios.post(`${url}/${dep}`,{
        title: inputTitle.value
    })
    if(res.status == 201){
       departments = [res.data,...departments]
       render(departments)
    }
    inputTitle.value = ''

    addModal.hide(modalToggle)
}

// Tahrirlash & Saqlash
const saveDepart = async () => {
    department.title = uptitle.value
    department.status = upstatus.checked ? 1 : 0

    let res = await axios.put(`${url}/${dep}`, {...department})
    if(res.status == 200){
        editModal.hide(editModalToggle)
        departments = departments.map(dep => {
            if(dep._id === res.data._id) return res.data
            return dep
        })
        render(departments)
    }
}

// Tahrirlash
const editDep = async (_id) => {
    editModal.show(editModalToggle)
    let res = await axios.get(`${url}/${dep}/get/${_id}`)
    if (res.status === 200){
        uptitle.value = res.data.title
        upstatus.checked = res.data.status === 1
        department = {...res.data}
        // 
    }
}

// O'chirish
const deleteDep = _id => {
    if (confirm('Ishonchingiz komilmi?')){
        axios.delete(`${url}/${dep}/${_id}`)
    .then(() => {
        departments = departments.filter(dep => dep._id !== _id)
        render(departments)
    })

    }
}

const handlePress = (e,type = 0) => {
    if(e.keyCode === 13){
        if(type == 0){
            addDepart()
        }
        if(type == 1){
            saveDepart() 
        }
    }
}

getDepartments()