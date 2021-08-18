const addButton = document.getElementById("addButton");
const parentDiv = document.getElementById("TODO-container");

// class TODOapp {
//   constructor() {
//     this.input = document.getElementById("input-field");
//   }
//
//   edit(e) {
//     this.item.editItem(e);
//   }
//
//   visiblity(e) {
//     e.style.display = "none";
//   }
//   checkValid() {
//     if (!this.input.checkValidity()) {
//       alert("Wrong input");
//       throw new Error("error");
//     }
//   }
//
//   addEventListeners() {
//     this.item.element.querySelector(".del").addEventListener("click", (e) => {
//       this.deleteItem(e.target.parentElement);
//     });
//     this.item.element.querySelector(".edit").addEventListener("click", (e) => {
//       e.target.parentNode.querySelector(".modal").style.display = "block";
//     });
//     this.item.element.querySelector(".close").addEventListener("click", (e) => {
//       e.target.parentNode.style.display = "none";
//     });
//     this.item.element.querySelector(".save").addEventListener("click", (e) => {
//       e.target.parentNode.style.display = "none";
//       this.edit(e.target.parentNode);
//     });
//   }
//
//   addItem() {
//     this.checkValid();
//     this.item = new TODOItem(this.input.value);
//     this.addEventListeners();
//     parentDiv.appendChild(this.item.element);
//   }
//
//   deleteItem(ele) {
//     ele.remove();
//   }
// }

class TodoApp {
    //data
    //render or update
    //addListeners
    //CRUD
    constructor() {
        this.todoItems = [];

        this.input = document.getElementById("input-field");
        this.deleteButton = document.querySelector(".del");
        //etc.

        this.modal = new ModalWindow();
        this.initAllListeners();
    }

    addTodoItem(title, startDate, expirationDate) {
        const todoItem = new TodoItem(title);
        this.todoItems.push(todoItem);
        this.render();
    }

    render() {
        //clear all list and render items from the list
        const list = document.createElement('div');
        this.todoItems.forEach((item) => list.appendChild(item.getTemplate()))
    }

    edit(index, title, date) {
        this.todoItems[index].edit(title, date);
        this.render()
    }

    listenToTheInput() {
        this.input.addEventListener('click', () => {
            this.addTodoItem(this.input.value);
        })
    }

    listenToTheModalOpen() {
        this.modal.showModal();
    }

    initAllListeners() {
        this.listenToTheModalOpen();
        this.listenToTheInput();
    }
}

class TodoItem {
    constructor(title) {
        this.title = title;
        this.timeStamp = Date.now();
        this.start = new Date(this.timeStamp).toLocaleString();
        this.end = new Date(this.timeStamp + 86400000).toLocaleString();
    }

    getTemplate() {
        const element = document.createElement("div");
        element.classList.add("element");
        this.modalWin = new ModalWindow();
        element.innerHTML = `<p class="title">${this.title} </p>
    <p class="start">${this.start} </p>
    <p class="end"> ${this.end}  </p>
    <p class="del"> DELETE</p> 
    <p class="edit">EDIT</p> 
    ${this.modalWin.modal.outerHTML}`;
        return element;
    }

    editItem(title, date) {
        this.title = title;
        this.date = date;
    }
}

class ModalWindow {
    constructor() {
        this.crateModal();
    }

    crateModal() {
        this.modal = document.createElement('div');
        this.modal.classList.add("modal");
        this.modal.innerHTML = `
        <input class="startDate" type="date"> <br> 
        <input class="titleInput" type="text"><br>
        <input class="startTime" type="time" step="1"><br>
        <input class="endDate" type="date"> <br> 
        <input class="endTime" type="time" step="1"><br>
        <p class="save">Save</p>
        <p class="close">X</p> `;
    }

    showModal() {
        this.modal.style.display = 'block';
    }

    hideModal() {
        this.modal.style.display = 'none';
    }
}

const todoApp = new TODOapp();

addButton.addEventListener("click", () => {
    todoApp.addItem();
});


class App {
    constructor() {
        this.todoApp = new TodoApp();
    }
}
