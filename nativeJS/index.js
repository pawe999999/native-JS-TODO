class TodoApp {
    constructor() {
        this.modal = new ModalWindow();
        this.todoItems = [];
        this.input = document.getElementById('input-field');
        this.parentDiv = document.getElementById('TODO-container');
        this.currentItemId;
        /////////////////// Buttons
        const completedItemsButton = document.getElementById(
            'completedItemsButton'
        );
        const showAllButton = document.getElementById('showAllButton');
        const activeItemsButton = document.getElementById('activeItemsButton');
        const deletDoneItemsButton = document.getElementById(
            'deletDoneItemsButton'
        );
        /////////////////

        activeItemsButton.addEventListener('click', () => {
            this.hideActiveItems();
        });
        completedItemsButton.addEventListener('click', () => {
            this.hideCompletedItems();
        });
        //Show All
        showAllButton.addEventListener('click', () => {
            this.render();
        });
        //Delete All
        deletDoneItemsButton.addEventListener('click', () => {
            this.todoItems = this.todoItems.filter((item) => {
                return !item.isDone;
            });
            this.render();
        });
        const addButton = document.getElementById('addButton');
        addButton.addEventListener('click', () => {
            this.addTodoItem();
        });

        //Custom EventListeners
        document.addEventListener('deleteTodoItem', (event) => {
            const eventId = event.detail.id;
            const existItemIndex = this.todoItems.findIndex(({ id }) => {
                return id === eventId;
            });
            this.delete(existItemIndex);
        });
        //If checkbox is clicked, change the isDone property
        document.addEventListener('checkDoneTodoItem', (event) => {
            const eventId = event.detail.id;
            const existItem = this.todoItems.find(({ id }) => {
                return id === eventId;
            });
            if (existItem.isDone) {
                existItem.isDone = false;
                existItem.removeDoneClass();
            } else {
                existItem.isDone = true;
                existItem.addDoneClass();
            }
        });
        document.addEventListener('startEditTodoItem', (event) => {
            const id = event.detail.id;
            this.modal.showModal();
            this.currentItemId = id;
        });

        document.addEventListener('saveTodoItem', (item) => {
            const existItem = this.todoItems.find(({ id }) => {
                return id === this.currentItemId;
            });
            existItem.edit(item);
            this.modal.hideModal();
            this.modal.clearModalInputs();
            this.currentItemId = null;
            this.render();
        });
        document.addEventListener('closeModalWindow', () => {
            this.modal.hideModal();
            this.currentItemId = null;
        });
    }
    //Check the validity of the main input
    validtyFromMainInput(input) {
        const validity = input.checkValidity();
        if (!validity) {
            alert('Wrong Input');
            throw new Error('Wrong input'); // Stops propagation of the code
        }
    }

    addTodoItem() {
        this.validtyFromMainInput(this.input);
        const todoItem = new TodoItem(this.input.value);
        this.todoItems.push(todoItem);
        this.render();
    }
    hideCompletedItems() {
        this.todoItems.forEach((item) => {
            if (item.isDone) {
                item.addHidenClass();
            }
        });
    }
    hideActiveItems() {
        this.todoItems.forEach((item) => {
            if (!item.isDone) {
                item.addHidenClass();
            }
        });
    }

    render() {
        this.parentDiv.innerHTML = '';
        const list = document.createElement('div');
        this.todoItems.forEach((item) => {
            if (item.validFromModalWindow()) {
                //checking if the input title is correct
                item.title = 'Wronginput'; //Setting title so alert box won't be annoying when there are more than one wrong input
                alert('Wrong Input');
            }
            list.appendChild(item.getTemplate());
        });
        this.parentDiv.appendChild(list);
        this.parentDiv.appendChild(this.modal.modal);
        console.log(this.todoItems);
    }

    delete(index) {
        this.todoItems.splice(index, 1);
        this.render();
    }
}
/////////////////////////////////////////////////////////////////////////
class TodoItem {
    constructor(title) {
        this.title = title;
        this.timeStamp = Date.now();
        this.start = new Date(this.timeStamp).toLocaleString();
        this.end = new Date(this.timeStamp + 86400000).toLocaleString();
        this.id = `${crypto.getRandomValues(new Uint8Array(8)).join('')}`; //Generate random id for todoItem
        this.isDone = false;
    }

    getTemplate() {
        const element = document.createElement('div');
        element.classList.add('element', `element${this.id}`);
        element.innerHTML = `<div>
            <p class='title${this.id}'>${this.title} </p>
            <p class='start' id="start${this.id}">${this.start} </p>
            <p class='end'> ${this.end}</p>
            <p class='delete${this.id}' id="delete${this.id}"> DELETE</p> 
            <p class='edit${this.id} id="edit${this.id}"'>EDIT</p> 
        </div>
        <div>
            <input class ='done${
                this.id
            }' type="checkbox" ${this.isChecked()}><span>Done</span> 
        </div>
        `; //if todoItem is done, isChecked() return 'checked' property

        this.delButton = element.getElementsByClassName(`delete${this.id}`); //Can't use "getElementById" but this the same thing implemented in a diffrent way
        this.delButton[0].addEventListener('click', () => this.deleteItem());

        this.editButton = element.getElementsByClassName(`edit${this.id}`);
        this.editButton[0].addEventListener('click', () => this.editItem());

        this.doneCheckbox = element.getElementsByClassName(`done${this.id}`);
        this.doneCheckbox[0].addEventListener('click', () => this.checkDone());
        this.checkIfDone(element); //adds 'done' styling to the title
        return element;
    }
    //checks validity when user edit todoItem
    validFromModalWindow() {
        const letters = /^[A-Za-z]+$/;
        if (this.title.match(letters)) {
            return false;
        }
        return true;
    }
    removeDoneClass() {
        const doneItem = document.getElementsByClassName(`title${this.id}`)[0];
        doneItem.classList.remove('done');
    }
    addDoneClass() {
        const doneItem = document.getElementsByClassName(`title${this.id}`)[0];
        doneItem.classList.add('done');
    }

    isChecked() {
        if (this.isDone) {
            return 'checked';
        }
    }
    checkIfDone(element) {
        const doneItem = element.getElementsByClassName(`title${this.id}`)[0];
        if (this.isDone) {
            doneItem.classList.add('done');
        }
    }
    addHidenClass() {
        const item = document.getElementsByClassName(`element${this.id}`)[0];
        item.classList.add('hidden');
    }
    edit(data) {
        const {
            data: {
                detail: { item }, //object Destructuring
            },
        } = { data };
        this.title = item.titleInputValue;
        this.start = `${item.startDateValue}  ${item.startTimeValue}`; //Data from modal window are transfer to todoItem
        this.end = `${item.endDateValue}  ${item.endTimeValue}`;
    }

    editItem() {
        const event = new CustomEvent('startEditTodoItem', {
            detail: {
                id: this.id,
            },
        });

        document.dispatchEvent(event);
    }

    deleteItem() {
        const event = new CustomEvent('deleteTodoItem', {
            detail: {
                id: this.id,
            },
        });

        document.dispatchEvent(event);
    }
    checkDone() {
        const event = new CustomEvent('checkDoneTodoItem', {
            detail: {
                id: this.id,
            },
        });

        document.dispatchEvent(event);
    }
}
////////////////////////////////////////////////////////////////////////
class ModalWindow {
    constructor() {
        this.id = `${crypto.getRandomValues(new Uint8Array(8)).join('')}`;
        this.crateModal();
        this.hideModal();
    }

    crateModal() {
        this.modal = document.createElement('div');
        this.modal.classList.add(`modal${this.id}`, 'modal');
        this.modal.innerHTML = `<div class="innerModal">
        <input class='titleInput${this.id} modalInput' type='text'>
        <input class='startDate${this.id} modalInput' type='date'>      
        <input class='startTime${this.id} modalInput' type='time' step='1'>
        <input class='endDate${this.id} modalInput' type='date'>  
        <input class='endTime${this.id} modalInput' type='time' step='1'>
        <span class='save-button${this.id} modalButtons' id="save-button">Save</span>
        <span class='edit-button${this.id} modalButtons'>Close</span> </div>`;

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
        )[0];
        this.titleInput = this.modal.getElementsByClassName(
            `titleInput${this.id}`
        )[0];
        this.startTime = this.modal.getElementsByClassName(
            `startTime${this.id}`
        )[0];
        this.endTime = this.modal.getElementsByClassName(
            `endTime${this.id}`
        )[0];
        this.endDate = this.modal.getElementsByClassName(
            `endDate${this.id}`
        )[0]; // [0] comes from the fact that "getElementsByClass" returns an array
    }

    showModal() {
        this.modal.style.display = 'block';
    }

    hideModal() {
        this.modal.style.display = 'none';
    }
    //clear modal inputs values
    clearModalInputs() {
        this.startDate.value = null;
        this.startTime.value = null;
        this.endDate.value = null;
        this.endTime.value = null;
        this.titleInput.value = null;
    }

    getDataFromForm() {
        const data = {
            startDateValue: this.startDate.value,
            startTimeValue: this.startTime.value,
            endDateValue: this.endDate.value,
            endTimeValue: this.endTime.value,
            titleInputValue: this.titleInput.value,
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
                },
            },
        });
        this.currentItemId = null;
        document.dispatchEvent(event);
    }
    close() {
        const event = new CustomEvent('closeModalWindow', {
            detail: {
                id: this.id,
            },
        });
        document.dispatchEvent(event);
    }
}
/////////////////////////////////////////////////////////////
class App {
    constructor() {
        this.todoApp = new TodoApp();
    }
}

const app = new App();
