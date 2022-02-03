const recipesDisplayed = recipes;


function init() {
    getTagMenus(recipesDisplayed);
    displayRecipes(recipesDisplayed);

    const mainSearchBar = document.querySelector("#main-search-bar");
    mainSearchBar.addEventListener("input", recipesFilter)
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


function recipesFilter(event) {
    const inputValue = event.target.value.toLowerCase();
    const cardContainer = document.querySelector(".card-container");
    const tagContainer = document.querySelector(".tag-container");

    const recipesCorrespondingToInput = recipesDisplayed.filter(recipe => recipe.appliance.toLowerCase().includes(inputValue)
    || recipe.ustensils[0].toLowerCase().includes(inputValue)
    || recipe.ingredients.some(item => item.ingredient.toLowerCase().includes(inputValue)) // get recipe when there are ingredients corresponding to input
    )

    cardContainer.textContent = "";
    tagContainer.textContent = "";

    recipesCorrespondingToInput.forEach(recipe => {
        const recipeModel = new RecipeFactory(recipe);
        const recipeCard = recipeModel.createCard();
        cardContainer.appendChild(recipeCard);
    });
}