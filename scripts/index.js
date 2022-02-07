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
    mainSearchBar.addEventListener("input", filterRecipes);

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

    updateOptionsContainerSize();
}


function getTagMenus() {
    const main = document.querySelector("main");

    const sectionFilter =  document.createElement("section");
    sectionFilter.classList.add("section-filter");

    const tagContainer =  document.createElement("div");
    tagContainer.classList.add("tag-container");

    const filterContainer =  document.createElement("div");
    filterContainer.classList.add("filter-container");

    const menuIngredients = new TagMenu("Ingrédients", "blue", "ingredients", "ingrédient");
    const menuIngredientsDOM = menuIngredients.getElementDOM();
    
    const menuAppliances = new TagMenu("Appareils", "green", "appliance", "appareil");
    const menuAppliancesDOM = menuAppliances.getElementDOM();
    
    const menuUstensils = new TagMenu("Ustensiles", "red", "ustensils", "ustensile");
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
    || recipe.ingredients.some(ingredientItem => ingredientItem.ingredient.toLowerCase().includes(inputValue)) // select recipes when there are values from key ingredient corresponding to input
    );
    
    // clear every containers
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
            message.classList.add("message");
            message.textContent = "Aucune recette ne correspond à votre critère... vous pouvez chercher « tarte aux pommes », « poisson », etc.";
            cardContainer.append(message);
        }
    } else {
        displayRecipes(recipes);
    }    
}


function getTagsOptions(recipes, tagsType) {
    const menuSelected = document.querySelector(`#menu-${tagsType}`);
    const optionsContainer = menuSelected.querySelector(".filter-menu-options");
    const tagsFromRecipesDisplayed = getTagsValue();

    optionsContainer.textContent = "";

    const tagsFromRecipesDisplayedWithoutDuplicate = Array.from(new Set(tagsFromRecipesDisplayed)); // Set allows to remove duplicate from array

    // generate tags options items
    if (tagsFromRecipesDisplayedWithoutDuplicate.length > 0) {
        tagsFromRecipesDisplayedWithoutDuplicate.forEach(tagOption => {
            const tagModel = new TagFactory(tagOption);
            const tagDOM = tagModel.getElementDOM();
            optionsContainer.append(tagDOM);
            })
    } else {
        const noResultMessage = document.createElement("p");
        noResultMessage.textContent = "Aucun résultat";
        optionsContainer.append(noResultMessage);
    }

    markTagsOptionsSelected();


    function getTagsValue() {
        if (tagsType == "ingredients") {
            return recipes.flatMap((recipe) => recipe[tagsType].map((item) => item.ingredient));
        } 
        else {
            return recipes.flatMap(recipe => recipe[tagsType]); // flatmap allows to merge an array containing another arrays into only one array
        }
    }
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
            const existingTagsButtons = Array.from(document.querySelectorAll(".button-tag"));
            const mainSearchInputValue = document.querySelector("#main-search-bar").value.toLowerCase();

            const appliancesTagsSelected = existingTagsButtons.filter(tagButton => (tagButton.getAttribute("tagtype") == "appliance")
            ).map(tagButton => tagButton.textContent);

            const ustensilsTagsSelected = existingTagsButtons.filter(tagButton => (tagButton.getAttribute("tagtype") == "ustensils")
            ).map(tagButton => tagButton.textContent);

            const ingredientsTagsSelected = existingTagsButtons.filter(tagButton => (tagButton.getAttribute("tagtype") == "ingredients")
            ).map(tagButton => tagButton.textContent);
            
            const recipesCorrespondingToInput = recipes.filter(recipe => 
                recipe.name.toLowerCase().includes(mainSearchInputValue)
                || recipe.description.toLowerCase().includes(mainSearchInputValue)
                || recipe.ingredients.some(ingredientItem => ingredientItem.ingredient.toLowerCase().includes(mainSearchInputValue))
            );

            const recipesCorrespondingToTags = recipes.filter(recipe => 
                appliancesTagsSelected.every(tags => recipe.appliance.includes(tags)) // get recipe including EVERY tags from appliancesTagsSelected array, can't use includes alone because will get only one tag
                && ustensilsTagsSelected.every(tags => recipe.ustensils.includes(tags))
                && ingredientsTagsSelected.every(tags => recipe.ingredients.some(ingredientItem => ingredientItem.ingredient.includes(tags)))
            );

            const recipesCorrespondingToInputAndTags = recipesCorrespondingToInput.filter(recipe => 
                appliancesTagsSelected.every(tags => recipe.appliance.includes(tags))
                && ustensilsTagsSelected.every(tags => recipe.ustensils.includes(tags))
                && ingredientsTagsSelected.every(tags => recipe.ingredients.some(ingredientItem => ingredientItem.ingredient.includes(tags)))
            );

            if (mainSearchInputValue.length >= 3) {
                displayRecipes(recipesCorrespondingToInputAndTags);
            } else {
                displayRecipes(recipesCorrespondingToTags);
            }
        }
    }
};