let currentRecipesDisplayed = recipes;


function init() {
    const main = document.querySelector("main");
    
    const sectionRecipes = document.createElement("div");
    sectionRecipes.classList.add("section-recipes");

    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    getTagMenus(currentRecipesDisplayed);

    sectionRecipes.append(cardContainer);
    main.append(sectionRecipes);

    displayRecipes(currentRecipesDisplayed);

    const mainSearchBar = document.querySelector("#main-search-bar");
    mainSearchBar.addEventListener("input", filterRecipes)
}


init();


// Functions
function displayRecipes(recipes) {
    const cardContainer = document.querySelector(".card-container");

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


function filterRecipes(event) {
    const inputValue = event.target.value.toLowerCase();
    const cardContainer = document.querySelector(".card-container");
    const tagContainer = document.querySelector(".tag-container");
    const menuIngredientsOptions = document.querySelector("#menu-ingredients").querySelector(".filter-menu-options");
    const menuAppliancesOptions = document.querySelector("#menu-appliance").querySelector(".filter-menu-options");
    const menuUstensilsOptions = document.querySelector("#menu-ustensils").querySelector(".filter-menu-options");
    const menusInputs = document.querySelector(".filter-container").querySelectorAll(".tag-search-bar");
    

    const recipesCorrespondingToInput = currentRecipesDisplayed.filter(recipe => recipe.name.toLowerCase().includes(inputValue)
    || recipe.description.toLowerCase().includes(inputValue)
    || recipe.ingredients.some(ingredientItem => ingredientItem.ingredient.toLowerCase().includes(inputValue)) // select recipe when there are ingredient key values corresponding to input
    )
    
    cardContainer.textContent = "";
    tagContainer.textContent = "";
    menuIngredientsOptions.textContent = "";
    menuAppliancesOptions.textContent = "";
    menuUstensilsOptions.textContent = "";
    
    
    if (inputValue.length >= 3) {
            displayRecipes(recipesCorrespondingToInput);
            getTagsOptions(recipesCorrespondingToInput, "appliance")
            getTagsOptions(recipesCorrespondingToInput, "ingredients")
            getTagsOptions(recipesCorrespondingToInput, "ustensils")

            currentRecipesDisplayed = recipesCorrespondingToInput;

            if (recipesCorrespondingToInput.length <= 0) {
                const message = document.createElement("p");
                message.textContent = "Aucune recette ne correspond à votre critère... vous pouvez chercher « tarte aux pommes », « poisson », etc.";
                cardContainer.append(message)
            }            
    } else {
        displayRecipes(recipes);
        getTagsOptions(recipes, "appliance")
        getTagsOptions(recipes, "ingredients")
        getTagsOptions(recipes, "ustensils")

        currentRecipesDisplayed = recipes;
    }

    menusInputs.forEach(input => input.value = "");
}


function getTagsOptions(recipes, tagsType) {
    const menuSelected = document.querySelector(`#menu-${tagsType}`);
    const optionsContainer = menuSelected.querySelector(".filter-menu-options");
    const tags = [];

    optionsContainer.textContent = "";

    recipes.forEach(recipe => {
        if (!Array.isArray(recipe[tagsType])) {
            tags.push(recipe[tagsType]);
        }
        else {
            recipe[tagsType].forEach(tagOption => {
                if (typeof tagOption === "object") {
                    tags.push(tagOption.ingredient)
                } else {
                    tags.push(tagOption)
                }
            });
        }
    });

    const tagsWithoutDuplicate = Array.from(new Set(tags)); // Set allows to remove duplicate from array

    tagsWithoutDuplicate.forEach(tagOption => {
        const tagModel = new TagFactory(tagOption);
        const tagDOM = tagModel.getElementDOM();
        optionsContainer.append(tagDOM);
        }
    )
}


const tagContainer = document.querySelector(".tag-container");


let tagContainerListener = new MutationObserver(mutationsReaction);
tagContainerListener.observe(tagContainer, {childList: true} );
function mutationsReaction(mutationsList) {
    for(let mutation of mutationsList) {
        if (mutation.addedNodes.length > 0) {
            const tagButton = mutation.addedNodes[0];
            const tagButtonName = tagButton.textContent;
            const tagButtonType = tagButton.getAttribute("type");
            const cardContainer = document.querySelector(".card-container");
            
            console.log('Tag added');

            cardContainer.textContent = "";

            const recipesCorrespondingToTags = currentRecipesDisplayed.filter(recipe => recipe[tagButtonType].includes(tagButtonName)
                || recipe.ingredients.some(ingredientItem => ingredientItem.ingredient.includes(tagButtonName))
            );
            
            
            displayRecipes(recipesCorrespondingToTags);
            currentRecipesDisplayed = recipesCorrespondingToTags;
            getTagsOptions(currentRecipesDisplayed, "appliance");
            getTagsOptions(currentRecipesDisplayed, "ustensils");
            getTagsOptions(currentRecipesDisplayed, "ingredients");
        }
        else if (mutation.removedNodes.length > 0) {
            const tagButton = mutation.removedNodes[0];
            const tagButtonName = tagButton.textContent;
            const tagButtonType = tagButton.getAttribute("type");
            const cardContainer = document.querySelector(".card-container");
    
            console.log('Tag removed');

            cardContainer.textContent = "";
            
            displayRecipes(recipes);
            currentRecipesDisplayed = recipes;
        }
    }
};