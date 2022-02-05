let currentRecipesDisplayed;

init();


// Functions
function init() {
    const main = document.querySelector("main");
    
    const sectionRecipes = document.createElement("div");
    sectionRecipes.classList.add("section-recipes");

    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    getTagMenus();

    sectionRecipes.append(cardContainer);
    main.append(sectionRecipes);

    displayRecipes(recipes);

    const mainSearchBar = document.querySelector("#main-search-bar");
    mainSearchBar.addEventListener("input", filterRecipes)

    const tagContainer = document.querySelector(".tag-container");

    let tagContainerListener = new MutationObserver(mutationsReaction);
    tagContainerListener.observe(tagContainer, { childList: true } );
}


function displayRecipes(recipes) {
    const cardContainer = document.querySelector(".card-container");
    const menusInputs = document.querySelector(".filter-container").querySelectorAll(".tag-search-bar");
    
    cardContainer.textContent = "";

    menusInputs.forEach(input => input.value = "");

    recipes.forEach(recipe => {
        const recipeModel = new RecipeFactory(recipe);
        const recipeCard = recipeModel.createCard();
        cardContainer.appendChild(recipeCard);
    });

    currentRecipesDisplayed = recipes;

    getTagsOptions(currentRecipesDisplayed, "appliance");
    getTagsOptions(currentRecipesDisplayed, "ustensils");
    getTagsOptions(currentRecipesDisplayed, "ingredients");
}


function getTagMenus() {
    const main = document.querySelector("main");

    const sectionFilter =  document.createElement("section");
    sectionFilter.classList.add("section-filter");

    const tagContainer =  document.createElement("div");
    tagContainer.classList.add("tag-container");

    const filterContainer =  document.createElement("div");
    filterContainer.classList.add("filter-container");

    const menuIngredients = new TagMenu("Ingrédients", "blue", "ingredients");
    const menuIngredientsDOM = menuIngredients.getElementDOM();
    
    const menuAppliances = new TagMenu("Appareils", "green", "appliance");
    const menuAppliancesDOM = menuAppliances.getElementDOM();
    
    const menuUstensils = new TagMenu("Ustensiles", "red", "ustensils");
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
    
    const recipesCorrespondingToInput = recipes.filter(recipe => recipe.name.toLowerCase().includes(inputValue)
    || recipe.description.toLowerCase().includes(inputValue)
    || recipe.ingredients.some(ingredientItem => ingredientItem.ingredient.toLowerCase().includes(inputValue)) // select recipe when there are ingredient key values corresponding to input
    )
    
    // clear every container
    cardContainer.textContent = "";
    tagContainer.textContent = "";
    menuIngredientsOptions.textContent = "";
    menuAppliancesOptions.textContent = "";
    menuUstensilsOptions.textContent = "";
    
    // display recipes and get tag options according to input value
    if (inputValue.length >= 3) {
        displayRecipes(recipesCorrespondingToInput);
        
        if (currentRecipesDisplayed.length <= 0) {
            const message = document.createElement("p");
            message.classList.add("message")
            message.textContent = "Aucune recette ne correspond à votre critère... vous pouvez chercher « tarte aux pommes », « poisson », etc.";
            cardContainer.append(message)
        }
    } else {
        displayRecipes(recipes);
    }    
}


function getTagsOptions(recipes, tagsType) {
    const menuSelected = document.querySelector(`#menu-${tagsType}`);
    const optionsContainer = menuSelected.querySelector(".filter-menu-options");
    const tagsFromRecipesDisplayed = [];

    optionsContainer.textContent = "";

    recipes.forEach(recipe => {
        if (!Array.isArray(recipe[tagsType])) {
            tagsFromRecipesDisplayed.push(recipe[tagsType]);
        }
        else {
            recipe[tagsType].forEach(tagOption => {
                if (typeof tagOption === "object") {
                    tagsFromRecipesDisplayed.push(tagOption.ingredient)
                } else {
                    tagsFromRecipesDisplayed.push(tagOption)
                }
            });
        }
    });

    const tagsFromRecipesDisplayedWithoutDuplicate = Array.from(new Set(tagsFromRecipesDisplayed)); // Set allows to remove duplicate from array

    // generate tags options items
    tagsFromRecipesDisplayedWithoutDuplicate.forEach(tagOption => {
        const tagModel = new TagFactory(tagOption);
        const tagDOM = tagModel.getElementDOM();
        optionsContainer.append(tagDOM);
        }
    )
}


function mutationsReaction(mutationsList) {
    for(let mutation of mutationsList) {
        if (mutation.addedNodes.length > 0) {
            const tagButtonAdded = mutation.addedNodes[0];
            const tagButtonName = tagButtonAdded.textContent;
            const tagButtonType = tagButtonAdded.getAttribute("tagtype");

            const recipesCorrespondingToTags = currentRecipesDisplayed.filter(recipe => recipe[tagButtonType].includes(tagButtonName)
                || recipe.ingredients.some(ingredientItem => ingredientItem.ingredient.includes(tagButtonName))
            );
            
            displayRecipes(recipesCorrespondingToTags);
        } else if (mutation.removedNodes.length > 0) {
            const existingTagsButtons = document.querySelectorAll(".button-tag");
            const appliancesTagsSelected = [];
            const ustensilsTagsSelected = [];
            const ingredientsTagsSelected = [];
            const mainSearchInputValue = document.querySelector("#main-search-bar").value.toLowerCase();

            // separate tags by type
            existingTagsButtons.forEach(tagButton => {
                if (tagButton.getAttribute("tagtype") == "appliance") {
                    appliancesTagsSelected.push(tagButton.textContent)
                } else if (tagButton.getAttribute("tagtype") == "ustensils") {
                    ustensilsTagsSelected.push(tagButton.textContent)
                } else if (tagButton.getAttribute("tagtype") == "ingredients") {
                    ingredientsTagsSelected.push(tagButton.textContent)
                }
            });

            const recipesCorrespondingToInput = recipes.filter(recipe => 
                recipe.name.toLowerCase().includes(mainSearchInputValue)
                || recipe.description.toLowerCase().includes(mainSearchInputValue)
                || recipe.ingredients.some(ingredientItem => ingredientItem.ingredient.toLowerCase().includes(mainSearchInputValue))
            )

            const recipesCorrespondingToInputAndTags = recipesCorrespondingToInput.filter(recipe => 
                appliancesTagsSelected.every(tags => recipe.appliance.includes(tags)) // get recipe including EVERY tags from appliancesTagsSelected array
                && ustensilsTagsSelected.every(tags => recipe.ustensils.includes(tags))
                && ingredientsTagsSelected.every(tags => recipe.ingredients.some(ingredientItem => ingredientItem.ingredient.includes(tags)))
            )

            displayRecipes(recipesCorrespondingToInputAndTags);
        }        
    }
};