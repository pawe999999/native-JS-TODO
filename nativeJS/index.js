const addButton = document.getElementById('addButton');
const parentDiv = document.getElementById('TODO-container');

// class TODOapp {
//   constructor() {
//     this.input = document.getElementById('input-field');
//   }
//
//   edit(e) {
//     this.item.editItem(e);
//   }
//
//   visiblity(e) {
//     e.style.display = 'none';
//   }
//   checkValid() {
//     if (!this.input.checkValidity()) {
//       alert('Wrong input');
//       throw new Error('error');
//     }
//   }
//
//   addEventListeners() {
//     this.item.element.querySelector('.del').addEventListener('click', (e) => {
//       this.deleteItem(e.target.parentElement);
//     });
//     this.item.element.querySelector('.edit').addEventListener('click', (e) => {
//       e.target.parentNode.querySelector('.modal').style.display = 'block';
//     });
//     this.item.element.querySelector('.close').addEventListener('click', (e) => {
//       e.target.parentNode.style.display = 'none';
//     });
//     this.item.element.querySelector('.save').addEventListener('click', (e) => {
//       e.target.parentNode.style.display = 'none';
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
        this.input = document.getElementById('input-field');
        //etc.
        this.modal = new ModalWindow();
    }
    initButtons() {
        this.deleteButton = document.getElementsByClassName('del');
        this.editButton = document.getElementsByClassName('edit');
        this.closeButton = document.getElementsByClassName('close');
        this.saveButton = document.getElementsByClassName('save');
    }

    addTodoItem(title) {
        const todoItem = new TodoItem(this.input.value);
        this.todoItems.push(todoItem);
        this.render();
        this.initButtons();
        this.initAllListeners();
        console.log(this.deleteButton);
    }

    render() {
        parentDiv.innerHTML = '';
        const list = document.createElement('div');
        this.todoItems.forEach((item) => {
            list.appendChild(item.getTemplate());
            list.appendChild(this.modal.modal);
        });
        parentDiv.appendChild(list);
    }

    edit(index) {
        this.todoItems[index].editItem();
        this.render();
        this.initButtons();
        this.initAllListeners();
    }

    listenToTheModalOpen() {
        this.modal.hideModal();
    }
    listenToTheSave() {
        const saveNodes = Array.prototype.slice.call(this.saveButton);
        for (let button of this.saveButton) {
            button.addEventListener('click', () => {
                this.edit(saveNodes.indexOf(button));
            });
        }
    }
    listenToTheDelete() {
        const deleteNodes = Array.prototype.slice.call(this.deleteButton);
        for (let button of this.deleteButton) {
            button.addEventListener('click', () => {
                console.log('delete');
                this.delete(deleteNodes.indexOf(button));
            });
        }
    }
    listenToTheEdit() {
        const editNodes = Array.prototype.slice.call(this.editButton);
        for (let button of this.editButton) {
            button.addEventListener('click', () => {
                this.modal.showModal();
            });
        }
    }
    listenToTheClose() {
        for (let button of this.closeButton) {
            button.addEventListener('click', () => {
                this.modal.hideModal();
            });
        }
    }
    delete(index) {
        this.todoItems.splice(index, 1);
        this.render();
        this.initButtons();
        this.initAllListeners();
    }

    initAllListeners() {
        this.listenToTheEdit();
        this.listenToTheDelete();
        this.listenToTheSave();
        this.listenToTheClose();
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
        const element = document.createElement('div');
        element.classList.add('element');
        element.innerHTML = `<p class='title'>${this.title} </p>
        <p class='start'>${this.start} </p>
        <p class='end'> ${this.end}  </p>
        <p class='del'> DELETE</p> 
        <p class='edit'>EDIT</p> 
        `;
        return element;
    }

    editItem(title, date) {
        console.error('Not Implemented');
    }
}

class ModalWindow {
    constructor() {
        this.crateModal();
        this.hideModal();
    }

    crateModal() {
        this.modal = document.createElement('div');
        this.modal.classList.add('modal');
        this.modal.innerHTML = `
        <input class='startDate' type='date'> <br> 
        <input class='titleInput' type='text'><br>
        <input class='startTime' type='time' step='1'><br>
        <input class='endDate' type='date'> <br> 
        <input class='endTime' type='time' step='1'><br>
        <p class='save'>Save</p>
        <p class='close'>X</p> `;
    }

    showModal() {
        this.modal.style.display = 'block';
    }

    hideModal() {
        this.modal.style.display = 'none';
    }
}

class App {
    constructor() {
        this.todoApp = new TodoApp();
    }
}

const app = new App();
addButton.addEventListener('click', () => {
    app.todoApp.addTodoItem();
});
