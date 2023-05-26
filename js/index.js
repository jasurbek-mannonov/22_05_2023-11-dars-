const url = 'http://95.130.227.52:3010'
const dep = 'department'

let departments = []
let tableBody = document.querySelector('table tbody')
let inputTitle = document.getElementById('title')
const months = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentyabr','Oktyabr','Noyabr','Dekabr']

// axios.get(`${url}/${dep}`)
// .then(res => {
//     if(res.status == 200){
//         console.log(res.data)
//     }
// })

const addZero = val => val < 10 ? `0${val}` : val

const parseDate = (date) => {
    let d = new Date(date)

    return`${addZero(d.getHours())}:${addZero(d.getMinutes())} ${addZero(d.getDate())}-${months[d.getMonth()]} ${d.getFullYear()} y.`
}

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
                <button type="button" class="btn btn-warning"><i class="bi bi-pencil"></i></button>
            </td>
        </tr>`
    })
}

const getDepartments = async () => {
    let res = await axios.get(`${url}/${dep}`)
    if(res.status == 200){
        departments = res.data
    }
    render(departments)
}

const addDepart = async () => {
    let res = await axios.post(`${url}/${dep}`,{
        title: inputTitle.value
    })
    if(res.status == 200){
       departments = [res.data,...departments]
       render(departments)
    }
    inputTitle.value = ''
}

const deleteDep = _id => {
    if (confirm('Ishonchingiz komilmi?')){
        axios.delete(`${url}/${dep}/${_id}`)
    .then(() => {
        departments = departments.filter(dep => dep._id !== _id)
        render(departments)
    })
    }
}

getDepartments()