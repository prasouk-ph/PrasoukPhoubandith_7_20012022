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


