function init() {
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

init();

const menuIngredient = document.querySelector(".filter-menu-ingredient");
menuIngredient.addEventListener("click", openDropdown);

function openDropdown() {
    const menuIngredientDropdownContent = document.querySelector(".filter-menu-content");
    const menuIngredientGap = document.querySelector(".filter-menu-ingredient");
    const ingredientOptions = document.querySelectorAll(".option-item");
    
    menuIngredientDropdownContent.style.display = "block";

    if (ingredientOptions.length == 1) {
        menuIngredientDropdownContent.style.width = "180px";
        menuIngredientGap.style.marginRight = "50px";
    } else if (ingredientOptions.length == 2) {
        menuIngredientDropdownContent.style.width = "450px";
        menuIngredientGap.style.marginRight = "320px";
    } else if (ingredientOptions.length >= 3) {
        menuIngredientDropdownContent.style.width = "680px";
        menuIngredientGap.style.marginRight = "550px";
    }
    menuIngredientDropdownContent.classList.add("active")
}
