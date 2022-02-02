const recipesDisplayed = recipes;


function init() {
    getTagMenus(recipesDisplayed);
    displayRecipes(recipesDisplayed);
}


init();


// Functions
function displayRecipes(recipes) {
    const main = document.querySelector("main");

    const sectionRecipes = document.createElement("div");
    sectionRecipes.classList.add("section-recipes");

    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    sectionRecipes.append(cardContainer);
    main.append(sectionRecipes);

    recipes.forEach(recipe => {
        const recipeModel = new RecipeFactory(recipe);
        const recipeCard = recipeModel.createCard();
        cardContainer.appendChild(recipeCard);
    });
}


function getTagMenus(recipes) {
    const main = document.querySelector("main");

    const sectionFilter =  document.createElement("section");
    sectionFilter.classList.add("section-filter");

    const tagContainer =  document.createElement("div");
    tagContainer.classList.add("tag-container");

    const filterContainer =  document.createElement("div");
    filterContainer.classList.add("filter-container");

    const menuIngredients = new TagMenu("Ingrédients", "blue", "ingredients", recipes);
    const menuIngredientsDOM = menuIngredients.getElementDOM();
    
    const menuAppliances = new TagMenu("Appareils", "green", "appliance", recipes);
    const menuAppliancesDOM = menuAppliances.getElementDOM();
    
    const menuUstensils = new TagMenu("Ustensiles", "red", "ustensils", recipes);
    const menuUstensilsDOM = menuUstensils.getElementDOM();
    
    filterContainer.append(menuIngredientsDOM, menuAppliancesDOM, menuUstensilsDOM);
    sectionFilter.append(tagContainer, filterContainer);
    main.append(sectionFilter);


    const searchBars = document.querySelectorAll(".tag-search-bar");
    searchBars.forEach(searchBar => searchBar.addEventListener("input", filterTags));
}


function filterTags(event) {
    const inputValue = event.target.value.toLowerCase();
    const optionsContainer = event.target.parentNode.querySelector(".filter-menu-options");
    const menuSelected = optionsContainer.parentNode.parentNode;
    const tagsType = getTagsType();
    const tagsFromRecipesDisplay = [];

    recipesDisplayed.forEach(recipe => {
        if (!Array.isArray(recipe[tagsType])) {
            tagsFromRecipesDisplay.push(recipe[tagsType]);
        } else {
            recipe[tagsType].forEach(tagItem => {
                if (typeof tagItem === "object") {
                    tagsFromRecipesDisplay.push(tagItem.ingredient);
                } else {
                    tagsFromRecipesDisplay.push(tagItem);
                }
            });
        }
    });

    const tagsFromRecipesDisplayWithoutDuplicate = Array.from(new Set(tagsFromRecipesDisplay));
    
    const tagsCorrespondingToInput = [];

    tagsFromRecipesDisplayWithoutDuplicate.forEach(tag => {
        if (tag.toLowerCase().includes(inputValue)) {
            tagsCorrespondingToInput.push(tag)
        }
    });

    optionsContainer.textContent = "";

    if (tagsCorrespondingToInput.length > 0) {
        tagsCorrespondingToInput.forEach(tag => {
            const tagModel = new TagFactory(tag);
            const tagDOM = tagModel.getElementDOM();
            optionsContainer.append(tagDOM);
        })
    }

    const menuOptionsQty = optionsContainer.querySelectorAll(":not(.hide)");
    const menuContent = optionsContainer.parentNode;
    if (menuOptionsQty.length <= 1) {
        menuContent.style.width = "180px";
        menuSelected.style.marginRight = "50px";
    } else if (menuOptionsQty.length == 2) {
        menuContent.style.width = "450px";
        menuSelected.style.marginRight = "320px";
    } else if (menuOptionsQty.length >= 3) {
        menuContent.style.width = "680px";
        menuSelected.style.marginRight = "550px";
    }


    function getTagsType() {
        if (menuSelected.id == "menu-appliance") {
            return "appliance";
        } else if (menuSelected.id == "menu-ustensils") {
            return "ustensils";
        } else if (menuSelected.id == "menu-ingredients") {
            return "ingredients";
        }
    }
}


