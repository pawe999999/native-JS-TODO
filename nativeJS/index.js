const addButton = document.getElementById("addButton")
const parentDiv = document.getElementById("TODO-container")



class TODOapp { 


    editItem(e){
        console.log(e.childNodes[2])
        e.childNodes[4].style.display = "block"

    }

    addItem(){
        const validty = document.getElementById("input-field").checkValidity()
        if(validty){
        const inputValue = document.getElementById("input-field").value
        this.item = new TODOItem(inputValue)
        console.log(this.item.modalWin.modal.childNodes[0])
        this.item.del.addEventListener("click", (e)=>{
            this.deleteItem(e.target.parentNode)
            
        })
        this.item.edit.addEventListener("click",(e)=> {
            this.editItem(e.target.parentNode)}
        )
        const savebtn = this.item.modalWin.modal.childNodes[5]
        savebtn.addEventListener("click",()=>{
            console.log(this.item.title)
            this.item.modalWin.modal.style.display = "none"
            this.update()
            console.log(this.item.title)
        })
        parentDiv.appendChild(this.item.element)
        }
        else{
            alert("Wrong Input")
        }
    }
    deleteItem(ele){
        ele.remove()
    }

    update(){
        this.item.titleEle.innerText = this.item.modalWin.modal.childNodes[0].value
        
        
    }
}

class TODOItem {
    constructor(title){
        this.title = title
        this.timeStamp = Date.now()
        this.start = new Date(this.timeStamp).toLocaleString()   
        this.end = new Date(this.timeStamp+86400000).toLocaleString()
        this.crateTemplate()
    }
    crateTemplate(){
        
        this.element = document.createElement("div")
        this.element.classList.add("element")
        this.modalWin = new ModalWindow()
        
        this.del = document.createElement("p")
        this.del.innerText = "DELETE"
        this.edit = document.createElement("p")
        this.edit.innerText = "Edit"
        this.titleEle = document.createElement("p")
        this.titleEle.innerText = this.title
        this.startEle = document.createElement("p")
        this.startEle.innerText = this.start
        this.endEle = document.createElement("p")
        this.endEle.innerText = this.end

        this.element.appendChild(this.titleEle)
        this.element.appendChild(this.startEle)
        this.element.appendChild(this.endEle)
        this.element.appendChild(this.del)
        this.element.appendChild(this.modalWin.modal)
        this.element.appendChild(this.edit)

        
    }
}

class ModalWindow {
    constructor(){
        
        this.crateModal()
    }
    crateModal(){
        
        this.modal = document.createElement("div")
        this.modal.classList.add("modal")
        this.saveButton = document.createElement("span")
        this.saveButton.textContent = "Save"
        this.closeButton = document.createElement("p")
        this.closeButton.textContent = "X"
        this.closeButton.addEventListener("click",()=>{
            this.modal.style.display = "none"
        })
        this.startDate = document.createElement("input")
        this.startDate.type = "date"
        this.title = document.createElement("input")
        this.title.type = "text"
        this.startTime = document.createElement("input")
        this.startTime.type = "time"
        this.startTime.step = "1"
        this.endDate = document.createElement("input")
        this.endDate.type = "date"
        this.endTime = document.createElement("input")
        this.endTime.type = "time"
        this.endTime.step = "1"

        this.modal.appendChild(this.title)
        this.modal.appendChild(this.startDate)
        this.modal.appendChild(this.startTime)
        this.modal.appendChild(this.endDate)
        this.modal.appendChild(this.endTime)
        this.modal.appendChild(this.saveButton)
        this.modal.appendChild(this.closeButton)

    }
    update(){
        this.modal.style.display = "none"
        title =  123
        const newValue1 = this.startDate.value
        const newValue2 = this.endDate.value
        const newValue3 = this.startTime.value
    }

}


const todoApp = new TODOapp()


 addButton.addEventListener("click", ()=>{
     todoApp.addItem()
 })

