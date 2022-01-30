const recipesDisplayed = recipes;

function init() {
    displayRecipe();
    loadFilterItems();

    const filterMenus = document.querySelectorAll(".filter-menu");
    filterMenus.forEach(menu => menu.addEventListener("click", openDropdown));

    const tagSearchBar = document.querySelectorAll(".tag-search-bar");
    tagSearchBar.forEach(searchBar => searchBar.addEventListener("input", filterTags));
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
    // const recipesDisplayed = recipes;
    
    
    // MENU APPLIANCE
    const menuAppliance = document.querySelector("#menu-appliance");
    const menuApplianceContainer = menuAppliance.querySelector(".filter-menu-content");

    const applianceWithoutDuplicate = [];
    recipesDisplayed.forEach(recipe => {
        applianceWithoutDuplicate.push(recipe.appliance)
    });
    const appliancesWithoutDuplicate = Array.from(new Set(applianceWithoutDuplicate));
    const applianceFilterOptionsContainer = document.createElement("div");
    applianceFilterOptionsContainer.classList.add("filter-menu-options");
    appliancesWithoutDuplicate.forEach(appliance => {
        const applianceModel = new ApplianceFilterFactory(appliance);
        const applianceDOM = applianceModel.createElementDOM();
        applianceFilterOptionsContainer.append(applianceDOM);
        }
    )
    menuApplianceContainer.append(applianceFilterOptionsContainer);


    // MENU USTENSIL
    const menuUstensil = document.querySelector("#menu-ustensils");
    const menuUstensilContainer = menuUstensil.querySelector(".filter-menu-content");

    const ustensils = [];
    recipesDisplayed.forEach(recipe => {
        recipe.ustensils.forEach(ustensil => {
            ustensils.push(ustensil)
        })
    });
    const ustensilsWithoutDuplicate = Array.from(new Set(ustensils));
    const ustensilsFilterOptionsContainer = document.createElement("div");
    ustensilsFilterOptionsContainer.classList.add("filter-menu-options");
    ustensilsWithoutDuplicate.forEach(ustensil => {
        const ustensilModel = new UstensilFilterFactory(ustensil);
        const ustensilDOM = ustensilModel.createElementDOM();
        ustensilsFilterOptionsContainer.append(ustensilDOM);
        }
    )
    menuUstensilContainer.append(ustensilsFilterOptionsContainer);


    // MENU INGREDIENT
    const menuIngredient = document.querySelector("#menu-ingredients");
    const menuIngredientContainer = menuIngredient.querySelector(".filter-menu-content");


    const ingredients = [];
    recipesDisplayed.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
            ingredients.push(ingredient.ingredient)
        })
    });
    const ingredientsWithoutDuplicate = Array.from(new Set(ingredients));
    const ingredientsFilterOptionsContainer = document.createElement("div");
    ingredientsFilterOptionsContainer.classList.add("filter-menu-options");
    ingredientsWithoutDuplicate.forEach(ingredient => {
        const ingredientModel = new IngredientFilterFactory(ingredient);
        const ingredientDOM = ingredientModel.createElementDOM();
        ingredientsFilterOptionsContainer.append(ingredientDOM);
        }
    )
    menuIngredientContainer.append(ingredientsFilterOptionsContainer);


    // Tag interaction
    const optionItems = document.querySelectorAll(".option-item");
    optionItems.forEach(item => item.addEventListener("click", addTag));

    function addTag(event) {
        const tagContainer = document.querySelector(".tag-container");
        const optionsContainer = event.target.parentNode;
        const menuSelected = optionsContainer.parentNode.parentNode;
        const menuDropdownSelected = optionsContainer.parentNode;
        const addedTag = event.target;

        const tag = document.createElement("button");
        tag.classList.add("button-tag");

        if (optionsContainer.parentNode.className.includes("green")) {
            tag.classList.add("button-tag-green");
        }
        else if (optionsContainer.parentNode.className.includes("red")) {
            tag.classList.add("button-tag-red");
        }
        else if (optionsContainer.parentNode.className.includes("blue")) {
                tag.classList.add("button-tag-blue");
        }

        tag.textContent = event.target.textContent;
        tagContainer.append(tag);
        addedTag.classList.add("hide");
        tag.addEventListener("click", removeTag);


        const optionsVisible = optionsContainer.querySelectorAll(":not(.hide)");
        if (optionsVisible.length <= 1) {
            menuDropdownSelected.style.width = "180px";
            menuSelected.style.marginRight = "50px";
        } else if (optionsVisible.length == 2) {
            menuDropdownSelected.style.width = "450px";
            menuSelected.style.marginRight = "320px";
        } else if (optionsVisible.length >= 3) {
            menuDropdownSelected.style.width = "680px";
            menuSelected.style.marginRight = "550px";
        }


        function removeTag(event) {
            const tagToremove = event.target;

            tagContainer.removeChild(tagToremove);
            addedTag.classList.remove("hide");
        }
    }
}





function openDropdown(event) {
    const menuSelected = event.target.parentNode;
    
    if (menuSelected.id.includes("menu")) {
        const menuDropdownSelected =  menuSelected.querySelector(".filter-menu-content");
        const menuOptionsContainerSelected =  menuSelected.querySelector(".filter-menu-options");
        const menuOptionsQty = menuOptionsContainerSelected.querySelectorAll(":not(.hide)");
        
        menuDropdownSelected.style.display = "block";

        if (menuOptionsQty.length <= 1) {
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


function filterTags(event) {
    // console.log("test");
    const inputValue = event.target.value.toLowerCase();
    const optionsContainer = event.target.parentNode.querySelector(".filter-menu-options");
    const recipesIncludingTagSearched = recipesDisplayed.filter(recipe => recipe.appliance.toLowerCase().includes(inputValue));
    const tagsGenerate = [];
    
    recipesIncludingTagSearched.forEach(recipe => tagsGenerate.push(recipe.appliance))

    const tagsGenerateWithoutDuplicate = Array.from(new Set(tagsGenerate));

    // console.log(tagsGenerate);

    optionsContainer.textContent = "";
    
    if (inputValue.length >= 2 && recipesIncludingTagSearched.length != 0 && recipesIncludingTagSearched[0].appliance.toLowerCase().includes(inputValue)) {
        // const applianceModel = new ApplianceFilterFactory(recipesIncludingTagSearched[0].appliance);
        // const applianceDOM = applianceModel.createElementDOM();
        // optionsContainer.append(applianceDOM);
        tagsGenerateWithoutDuplicate.forEach(appliance => {
            const applianceModel = new IngredientFilterFactory(appliance);
            const applianceDOM = applianceModel.createElementDOM();
            optionsContainer.append(applianceDOM);
        })
    } else {
        const applianceWithoutDuplicate = [];
        recipesDisplayed.forEach(recipe => {
            applianceWithoutDuplicate.push(recipe.appliance)
        });
        const appliancesWithoutDuplicate = Array.from(new Set(applianceWithoutDuplicate));
        appliancesWithoutDuplicate.forEach(appliance => {
            const applianceModel = new ApplianceFilterFactory(appliance);
            const applianceDOM = applianceModel.createElementDOM();
            optionsContainer.append(applianceDOM);
        })
    }

    const optionsVisible = optionsContainer.querySelectorAll(":not(.hide)");
    const menuSelected = optionsContainer.parentNode.parentNode;
    const menuDropdownSelected = optionsContainer.parentNode;
    if (optionsVisible.length <= 1) {
        menuDropdownSelected.style.width = "180px";
        menuSelected.style.marginRight = "50px";
    } else if (optionsVisible.length == 2) {
        menuDropdownSelected.style.width = "450px";
        menuSelected.style.marginRight = "320px";
    } else if (optionsVisible.length >= 3) {
        menuDropdownSelected.style.width = "680px";
        menuSelected.style.marginRight = "550px";
    }
}