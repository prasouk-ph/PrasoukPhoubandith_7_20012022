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



