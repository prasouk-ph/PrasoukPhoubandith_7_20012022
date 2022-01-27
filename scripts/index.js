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

const menuIngredient = document.querySelector("#menu-ingredient");
// menuIngredient.addEventListener("click", openDropdown);

const filterMenus = document.querySelectorAll(".filter-menu");
filterMenus.forEach(menu => menu.addEventListener("click", openDropdown));

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
    // menuIngredientDropdownContent.classList.add("active");
    }
}

// document.addEventListener("click", closeModal)

function closeModal(event) {
    const menuIngredientDropdownContent = document.querySelector(".filter-menu-content");
    const optionItems = document.querySelectorAll(".option-item");

    // console.log(event.target.childNodes)
    if (event.target == optionItems || event.target == menuIngredientDropdownContent || event.target == menuIngredientGap) {
        alert("drop")
        // menuIngredientGap.style.marginRight = "0px";
        // menuIngredientDropdownContent.style.display = "none";
      }
    //   if (!event.target.className.includes("active") && event.target != option) {
    //   && !event.target.matches(".filter-menu-content")

    // if (event.target.className.includes("filter-menu-content", "filter-menu-title", "filter-menu-ingredient", "filter-menu-options")) {
    //     menuIngredientDropdownContent.style.display = "block";
    // } else {
    //     menuIngredientGap.style.marginRight = "0px";
    //     menuIngredientDropdownContent.style.display = "none";
    // }
}



function closeDropdown() {
    document.removeEventListener("keydown", closeDropdownWithKeyboard);
    document.removeEventListener("click", closeDropdownOnClick);

    options.style.display = "none";
    currentValue.setAttribute("aria-expanded", "false");

    // focus management
    logoLink.tabIndex = 0;
    contactButton.tabIndex = 0;
    allMedia.forEach(media => media.tabIndex = 0);
    mediaVideos.forEach(media => media.tabIndex  = 0);
    likesCount.forEach(likes => likes.tabIndex  = 0);
}


function closeDropdownWithKeyboard(event) {
if (event.key == "Escape") {
    closeDropdown();
}
}

function closeDropdownOnClick(event) {
if (event.target.className.includes("current_value")) {
    options.style.display = "block";
} else {
    closeDropdown();
}
}