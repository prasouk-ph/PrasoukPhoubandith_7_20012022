function init() {
    displayRecipe();
    loadFilterItems();

    const filterMenus = document.querySelectorAll(".filter-menu");
    filterMenus.forEach(menu => menu.addEventListener("click", openDropdown));
}

init();


// Functions
function displayRecipe() {
    const main = document.querySelector("main");
    const recipesSection = document.createElement("div");
    recipesSection.classList.add("section-recipes");
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");
    recipesSection.append(cardContainer);
    main.append(recipesSection);

    recipes.forEach(recipe => {
        const recipeModel = new RecipeFactory(recipe);
        const recipeCard = recipeModel.createCard();
        cardContainer.appendChild(recipeCard);
    });
}

function loadFilterItems() {
    // create array from recipe in card container, with name slice recipes variable, keep only the recipe contains in the first array created
    // or create a copy of recipes variable  and slice it according to recipe in card container, use recipe id, get values from new array
    // const recipesDisplayed = Array.from(document.querySelectorAll(".card"));
    // console.log(recipesDisplayed[0])
    
    // for every recipes, get values from key appliance/utensils/ingredients
    const devices = [];

    recipes.forEach(recipe => {
        devices.push(recipe.appliance)
    });
    // const device = recipes[0].appliance
    console.log(devices)
    
}





function openDropdown(event) {
    const menuSelected = event.target.parentNode;
    
    if (menuSelected.id.includes("menu")) {
        const menuDropdownSelected =  menuSelected.querySelector(".filter-menu-content");
        const menuOptionsContainerSelected =  menuSelected.querySelector(".filter-menu-options");
        const menuOptionsQty = menuOptionsContainerSelected.querySelectorAll(".option-item");
        
        menuDropdownSelected.style.display = "block";

        if (menuOptionsQty.length == 1) {
            menuDropdownSelected.style.width = "180px";
            menuSelected.style.marginRight = "50px";
        } else if (menuOptionsQty.length == 2) {
            menuDropdownSelected.style.width = "450px";
            menuSelected.style.marginRight = "320px";
        } else if (menuOptionsQty.length >= 3) {
            menuDropdownSelected.style.width = "680px";
            menuSelected.style.marginRight = "550px";
        }

        document.addEventListener("click", closeModal);

        function closeModal(event) {
            if (!menuSelected.contains(event.target)) { // if target is not a child of the menu selected
                menuDropdownSelected.style.display = "none";
                menuSelected.style.marginRight = "0px";
                document.removeEventListener("click", closeModal);
            } 
        }
    }   
}