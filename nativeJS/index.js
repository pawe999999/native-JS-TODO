const addButton = document.getElementById("addButton")
const parentDiv = document.getElementById("TODO-container")

addButton.addEventListener("click", () =>{ 
    const validty = document.getElementById("input-field").checkValidity()
    if(validty){
    const inputValue = document.getElementById("input-field").value
    const element = document.createElement("div")
    element.classList.add("element")
    const inner = document.createElement("span")
    const date = document.createElement("span")
    
    inner.textContent = inputValue
    element.appendChild(inner)
    element.appendChild(date)
    parentDiv.appendChild(element)
    
}
else{
    alert("Wrong input")
}
}


)

