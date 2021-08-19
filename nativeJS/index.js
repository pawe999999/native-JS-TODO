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
        this.modal = new ModalWindow();

        this.initAllListeners();

        document.addEventListener('deleteTodoItem', (event) => {
            const id = event //get id from event
            this.delete(id)
        });

        document.addEventListener('startEditTodoItem', (event) => {
            //TODO: get item id from event
            const id = event;
            const item = this.todoItems.find(({id: itemId}) => id === itemId);
            this.modal.showModal(item);
        })

        document.addEventListener('saveTodoItem', ({item}) => {
            const existItemIndex = this.todoItems.findIndex(({id}) => item.id === id)

            if (existItemIndex !== -1) {
                this.todoItems[existItemIndex] = item;
            } else {
                this.todoItems.push(item);
            }
            this.render();
        })
    }

    initButtons() {
        //move to the modal and item classes
        // this.deleteButton = document.getElementsByClassName('del');
        // this.editButton = document.getElementsByClassName('edit');
        // this.closeButton = document.getElementsByClassName('close');
    }

    addTodoItem(title) {
        const todoItem = new TodoItem(this.input.value);
        this.todoItems.push(todoItem);
        this.render();
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

    //move to the item class
    edit(index) {
        this.todoItems[index].editItem();
        this.render();
    }

    listenToTheModalOpen() { // maybe remove
        this.modal.hideModal();
    }

    //move it to the modal
    listenToTheSave() {
        const saveNodes = Array.prototype.slice.call(this.saveButton);
        for (let button of this.saveButton) {
            button.addEventListener('click', () => {
                this.edit(saveNodes.indexOf(button));
            });
        }
    }

    //move it to the item class
    listenToTheDelete() {
        const deleteNodes = Array.prototype.slice.call(this.deleteButton);
        for (let button of this.deleteButton) {
            button.addEventListener('click', () => {
                console.log('delete');
                this.delete(deleteNodes.indexOf(button));
            });
        }
    }

    //move it to the item class
    listenToTheEdit() {
        const editNodes = Array.prototype.slice.call(this.editButton);
        for (let button of this.editButton) {
            button.addEventListener('click', () => {
                this.modal.showModal();
            });
        }
    }

    //move to the modal
    listenToTheClose() {
        for (let button of this.closeButton) {
            button.addEventListener('click', () => {
                this.modal.hideModal();
            });
        }
    }

    delete(id) {
        const existItemIndex = this.todoItems.findIndex(({id}) => item.id === id);

        this.todoItems.splice(existItemIndex, 1);
        this.render();
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

        this.id = `${crypto.getRandomValues(new Uint8Array(8)).join('')}`;
    }

    getTemplate() {
        const element = document.createElement('div');
        element.classList.add('element');
        element.innerHTML = `<p class='title'>${this.title} </p>
        <p class='start' id="start${this.id}">${this.start} </p>
        <p class='end'> ${this.end}</p>
        <p class='del' id="delete${this.id}"> DELETE</p> 
        <p class='edit id="edit${this.id}"'>EDIT</p> 
        `;

        this.delButton = document.getElementById(`delete${this.id}`);
        this.delButton.addEventListener('click', () => this.deleteItem());

        this.editButton = document.getElementById(`edit${this.id}`);
        this.editButton.addEventListener('click', () => this.editItem());

        return element;
    }

    editItem() {
        const event = new CustomEvent('startEditTodoItem', {
            detail: {
                index: this.id
            }
        });

        document.dispatchEvent(event);
    }

    deleteItem() {
        const event = new CustomEvent('deleteTodoItem', {
            detail: {
                index: this.id
            }
        });

        document.dispatchEvent(event);
    }
}

class ModalWindow {
    constructor() {
        this.crateModal();
        this.hideModal();

        document.getElementById('save-button').addEventListener(() => this.save())

        //add listener to the save and cancel buttons
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
        <p class='save' id="save-button">Save</p>
        <p class='close'>X</p> `;
    }

    showModal(item) {
        this.modal.style.display = 'block';

        if (item) {
            this.fillForm(item)
            this.currentItemId = item.id;
        }
    }

    hideModal() {
        this.modal.style.display = 'none';
    }

    fillForm(item) {
        //fill inputs with data from the item
    }

    save() {
        //get data from form
        const data = this.getDataFromForm()
        const event = new CustomEvent('saveTodoItem', {
            detail: {
                item: {
                    ...data,
                    id: this.currentItemId ?? `${crypto.getRandomValues(new Uint8Array(8)).join('')}`
                }
            }
        });
        this.currentItemId = null;

        document.dispatchEvent(event);
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
