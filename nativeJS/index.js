const addButton = document.getElementById('addButton');
const parentDiv = document.getElementById('TODO-container');
const hideButton = document.getElementById('hideButton');
const showButton = document.getElementById('showButton');
const sortButton = document.getElementById('sortButton');

class TodoApp {
    constructor() {
        this.todoItems = [];
        this.input = document.getElementById('input-field');
        addButton.addEventListener('click', () => {
            this.addTodoItem();
        });
        //Adding 'hidden' class to the item when item has done flag set as true
        hideButton.addEventListener('click', () => {
            this.todoItems.forEach((item) => {
                if (item.done) {
                    item.addHiddenClass();
                }
            });
        });

        showButton.addEventListener('click', () => {
            this.todoItems.forEach((item) => {
                console.log(item);
                if (item.done) {
                    item.removeHiddenClass();
                }
            });
        });
        sortButton.addEventListener('click', () => {
            this.todoItems.sort((a, b) => {
                if (a.title < b.title) {
                    return -1;
                }
                if (a.title > b.title) {
                    return 1;
                }
                return 0;
            });
            this.render();
        });
        //Custom EventListeners

        document.addEventListener('setDoneTodoItem', (event) => {
            const id = event.detail.index;
            const existItem = this.todoItems.find((todoItem) => {
                return todoItem.id === id;
            });
            if (existItem.done) {
                existItem.done = false;
                existItem.removeDoneClass();
            } else {
                existItem.done = true;
                existItem.addDoneClass();
            }
        });
        document.addEventListener('deleteTodoItem', (event) => {
            const id = event.detail.index;
            this.delete(id);
            this.render();
        });

        document.addEventListener('startEditTodoItem', (event) => {
            const id = event.detail.index;
            const existItem = this.todoItems.find((todoItem) => {
                return todoItem.id === id;
            });
            existItem.modal.style.display = 'block';
        });

        document.addEventListener('saveTodoItem', (item) => {
            const id = item.detail.item.id;
            const modal = document.getElementsByClassName(`modal${id}`);
            modal[0].style.display = 'none';
            const existItemIndex = this.todoItems.findIndex((todoItem) => {
                return todoItem.id === id;
            });
            this.todoItems[existItemIndex].edit(item, existItemIndex);
            this.render();
        });
        document.addEventListener('closeModalWindow', (event) => {
            const id = event.detail.index;
            const existItem = this.todoItems.find((todoItem) => {
                return todoItem.id === id;
            });
            existItem.modal.style.display = 'none';
        });
    }
    //Check the validity of the main input
    validtyFromMainInput(input) {
        const validity = input.checkValidity();
        if (!validity) {
            alert('Wrong Input');
            throw new Error('Wrong input'); // Stop propagation of the code
        }
    }
    //check validity when user edit todoItem
    validFromModalWindow(item) {
        const letters = /^[A-Za-z]+$/; //only letters with RegExp
        if (!item.title.match(letters)) {
            return true;
        }
        return false;
    }

    addTodoItem() {
        this.validtyFromMainInput(this.input);
        const todoItem = new TodoItem(this.input.value);
        this.modal = new ModalWindow();
        const temp = Object.assign(todoItem, this.modal);
        this.todoItems.push(temp);
        this.render();
    }

    render() {
        parentDiv.innerHTML = '';
        const list = document.createElement('div');
        this.todoItems.forEach((item) => {
            if (this.validFromModalWindow(item)) {
                item.title = 'Wronginput'; //Setting title so alert box won't be annoying when there are more than one wrong input
                alert('Wrong Input');
            }
            list.appendChild(item.getTemplate());
            list.appendChild(item.modal);
        });
        parentDiv.appendChild(list);
    }

    delete(id) {
        const existItemIndex = this.todoItems.findIndex((item) => {
            return item.id === id;
        });
        this.todoItems.splice(existItemIndex, 1);
        this.render();
    }
}

class TodoItem {
    constructor(title) {
        this.title = title;
        this.timeStamp = Date.now();
        this.start = new Date(this.timeStamp).toLocaleString();
        this.end = new Date(this.timeStamp + 86400000).toLocaleString();
        this.id = `${crypto.getRandomValues(new Uint8Array(8)).join('')}`; //Generate random id for todoItem
        this.checkDone();
    }
    checkDone() {
        if (this.done) {
            return this.done;
        } else {
            this.done = false;
            return this.done;
        }
    }

    getTemplate() {
        const element = document.createElement('div');
        element.classList.add(`element${this.id}`, 'element');
        element.innerHTML = `<div class="leftDiv">
            <p class='title${this.id}'>${this.title} </p>
            <p class='start' id="start${this.id}">${this.start} </p>
            <p class='end'> ${this.end}</p>
            <p class='delete${this.id}' id="delete${this.id}"> DELETE</p> 
            <p class='edit${this.id} id="edit${this.id}"'>EDIT</p> 
        </div>
        <div class="rightDiv">
            <input class='done${this.id}' id="done${this.id}" type="checkbox"><span>Mark as done</spma>
        </div> 
        `;

        this.delButton = element.getElementsByClassName(`delete${this.id}`); //Can't use "getElementById" but this the same thing implemented in a diffrent way
        this.delButton[0].addEventListener('click', () => this.deleteItem());

        this.editButton = element.getElementsByClassName(`edit${this.id}`);
        this.editButton[0].addEventListener('click', () => this.editItem());

        this.doneButton = element.getElementsByClassName(`done${this.id}`);
        this.doneButton[0].addEventListener('change', () => this.setDoneItem());

        return element;
    }
    edit(data) {
        const {
            data: {
                detail: { item }, //object Destructuring
            },
        } = { data };
        this.title = item.titleInputValue;
        this.start = `${item.startDateValue}  ${item.startTimeValue}`;
        this.end = `${item.endDateValue}  ${item.endTimeValue}`;
    }

    editItem() {
        const event = new CustomEvent('startEditTodoItem', {
            detail: {
                index: this.id,
            },
        });

        document.dispatchEvent(event);
    }

    deleteItem() {
        const event = new CustomEvent('deleteTodoItem', {
            detail: {
                index: this.id,
            },
        });

        document.dispatchEvent(event);
    }
    setDoneItem() {
        const event = new CustomEvent('setDoneTodoItem', {
            detail: {
                index: this.id,
            },
        });

        document.dispatchEvent(event);
    }
    addHiddenClass() {
        const hideItem = document.getElementsByClassName(
            `element${this.id}`
        )[0];
        hideItem.classList.add('hidden');
    }
    removeHiddenClass() {
        const hideItem = document.getElementsByClassName(
            `element${this.id}`
        )[0];
        hideItem.classList.remove('hidden');
    }
    addDoneClass() {
        const hideItem = document.getElementsByClassName(`title${this.id}`)[0];
        hideItem.classList.add('done');
    }
    removeDoneClass() {
        const hideItem = document.getElementsByClassName(`title${this.id}`)[0];
        hideItem.classList.remove('done');
    }
}

class ModalWindow {
    constructor() {
        this.id = `${crypto.getRandomValues(new Uint8Array(8)).join('')}`;
        this.crateModal();
        this.hideModal();
    }

    crateModal() {
        this.modal = document.createElement('div');
        this.modal.classList.add(`modal${this.id}`, 'modal');
        this.modal.innerHTML = `
        <input class='startDate${this.id}' type='date'> <br> 
        <input class='titleInput${this.id}' type='text'><br>
        <input class='startTime${this.id}' type='time' step='1'><br>
        <input class='endDate${this.id}' type='date'> <br> 
        <input class='endTime${this.id}' type='time' step='1'><br>
        <p class='save-button${this.id}' id="save-button">Save</p>
        <p class='edit-button${this.id}'>X</p> `;

        this.saveButton = this.modal.getElementsByClassName(
            `save-button${this.id}`
        );
        this.saveButton[0].addEventListener('click', () => this.save());
        this.editButton = this.modal.getElementsByClassName(
            `edit-button${this.id}`
        );
        this.editButton[0].addEventListener('click', () => this.close());

        this.startDate = this.modal.getElementsByClassName(
            `startDate${this.id}`
        );
        this.titleInput = this.modal.getElementsByClassName(
            `titleInput${this.id}`
        );
        this.startTime = this.modal.getElementsByClassName(
            `startTime${this.id}`
        );
        this.endTime = this.modal.getElementsByClassName(`endTime${this.id}`);
        this.endDate = this.modal.getElementsByClassName(`endDate${this.id}`);
    }

    showModal() {
        this.modal.style.display = 'block';
    }

    hideModal() {
        this.modal.style.display = 'none';
    }

    getDataFromForm() {
        const data = {
            startDateValue: this.startDate[0].value, //[0] comes from the fact that "getElementsByClass" returns an array
            startTimeValue: this.startTime[0].value,
            endDateValue: this.endDate[0].value,
            endTimeValue: this.endTime[0].value,
            titleInputValue: this.titleInput[0].value,
        };
        return data;
    }
    save() {
        //get data from form
        const data = this.getDataFromForm();
        const event = new CustomEvent('saveTodoItem', {
            detail: {
                item: {
                    ...data,
                    id: this.id,
                    /* this.currentItemId ??
                        `${crypto.getRandomValues(new Uint8Array(8)).join('')}`, */
                },
            },
        });
        this.currentItemId = null;
        document.dispatchEvent(event);
    }
    close() {
        const event = new CustomEvent('closeModalWindow', {
            detail: {
                index: this.id,
            },
        });
        document.dispatchEvent(event);
    }
}

class App {
    constructor() {
        this.todoApp = new TodoApp();
    }
}

const app = new App();
