const url = 'http://95.130.227.52:3010'
const dep = 'department'

let departments = []
let tableBody = document.querySelector('table tbody')

const addZero = val => val < 10 ? `0${val}` : val

const parseDate = (date) => {
    let d = new Date(date)
    console.log(d.getHours(),d.getMinutes())

    return`${addZero(d.getHours())}:${addZero(d.getMinutes())}`
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
            <td>
                <button type="button" class="btn btn-danger">Remove</button>
                <button type="button" class="btn btn-warning">Edit</button>
            </td>
        </tr>`
    })
}

const getDepartments = async () => {
    let res = await fetch(`${url}/${dep}`)
    departments = await res.json()
    render(departments)
}
getDepartments()