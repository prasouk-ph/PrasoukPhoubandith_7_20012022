class TagMenu {
    constructor(menuTitle, menuColor, tagsType, recipes) {
        this.menuTitle = menuTitle;
        this.menuColor = menuColor;
        this.tagsType = tagsType;
        this.recipes = recipes;
    }
    

    getElementDOM() {
        // create tag elements
        const menu = document.createElement("div");
        menu.id = `menu-${this.tagsType}`;
        menu.classList.add("filter-menu", `filter-menu-${this.menuColor}`);

        const menuTitle = document.createElement("div");
        menuTitle.classList.add("filter-menu-title");
        menuTitle.textContent = this.menuTitle;

        const menuContent = document.createElement("div");
        menuContent.classList.add("filter-menu-content", "filter-menu", `filter-menu-${this.menuColor}`);

        const searchBar = document.createElement("input");
        searchBar.id = `${this.tagsType}-search-bar`;
        searchBar.classList.add("tag-search-bar");
        searchBar.setAttribute("type", "search");
        searchBar.setAttribute("name", "filter-search");
        searchBar.setAttribute("placeholder", `Rechercher un ${this.tagsType}`);
        

        // get tag options
        const tags = [];

        this.recipes.forEach(recipe => {
            if (!Array.isArray(recipe[`${this.tagsType}`])) {
                tags.push(recipe[`${this.tagsType}`]);
            }
            else {
                recipe[`${this.tagsType}`].forEach(tagOption => {
                    if (typeof tagOption === "object") {
                        tags.push(tagOption.ingredient)
                    } else {
                        tags.push(tagOption)
                    }
                });
            }
        });

        const tagsWithoutDuplicate = Array.from(new Set(tags)); // Set allows to remove duplicate from array

        const optionsContainer = document.createElement("ul");
        optionsContainer.classList.add("filter-menu-options");
        
        const tagContainer = document.createElement("div");
        tagContainer.classList.add("tag-container");
        
        tagsWithoutDuplicate.forEach(tagOption => {
            const tagModel = new TagFactory(tagOption);
            const tagDOM = tagModel.getElementDOM();
            optionsContainer.append(tagDOM);
            }
        )


        // append elements
        menu.append(menuTitle, menuContent);
        menuContent.append(searchBar, optionsContainer);

        menu.addEventListener("click", openDropdown);
        searchBar.addEventListener("input", filterTags);


        // functions
        function openDropdown() {
            const menuOptionsQty = optionsContainer.querySelectorAll(":not(.hide)");
            
            menuContent.style.display = "block";

            if (menuOptionsQty.length <= 1) {
                menuContent.style.width = "180px";
                menu.style.marginRight = "50px";
            } else if (menuOptionsQty.length == 2) {
                menuContent.style.width = "450px";
                menu.style.marginRight = "320px";
            } else if (menuOptionsQty.length >= 3) {
                menuContent.style.width = "680px";
                menu.style.marginRight = "550px";
            }

            document.addEventListener("click", closeDropdown);


            function closeDropdown(event) {
                if (!menu.contains(event.target)) { // if target is not a child of the menu selected
                    menuContent.style.display = "none";
                    menu.style.marginRight = "0px";
                    document.removeEventListener("click", closeDropdown);
                } 
            }
        }


        function filterTags(event) {
            const inputValue = event.target.value.toLowerCase();
            const optionsContainer = event.target.parentNode.querySelector(".filter-menu-options");
            const menuSelected = optionsContainer.parentNode.parentNode;
            const tagsType = getTagsType();
            const tagsFromRecipesDisplay = [];
            
        
            recipesDisplayed.forEach(recipe => {
                if (!Array.isArray(recipe[tagsType])) { // when tag type is appliance
                    tagsFromRecipesDisplay.push(recipe[tagsType]);
                } else {
                    recipe[tagsType].forEach(tagItem => {
                        if (typeof tagItem === "object") { // when tag type is ingredients
                            tagsFromRecipesDisplay.push(tagItem.ingredient);
                        } else {
                            tagsFromRecipesDisplay.push(tagItem); // when tag type is ustensils
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

        return menu;
    }    
}


class TagFactory {
    constructor(ingredient) {
        this.name = ingredient;
    }

    getElementDOM() {
        const li = document.createElement("li");
        li.classList.add("option-item");
        li.textContent = this.name;

        li.addEventListener("click", addTag);

        return li;


        function addTag(event) {
            const tagContainer = document.querySelector(".tag-container");
            const optionsContainer = event.target.parentNode;
            const menuSelected = optionsContainer.parentNode.parentNode;
            const menuDropdownSelected = optionsContainer.parentNode;
            const tagOption = event.target;
    
            const tagButton = document.createElement("button");
            tagButton.classList.add("button-tag");
    
            if (optionsContainer.parentNode.className.includes("green")) {
                tagButton.classList.add("button-tag-green");
            } else if (optionsContainer.parentNode.className.includes("red")) {
                tagButton.classList.add("button-tag-red");
            } else if (optionsContainer.parentNode.className.includes("blue")) {
                tagButton.classList.add("button-tag-blue");
            }
    
            tagButton.textContent = tagOption.textContent;
            tagButton.addEventListener("click", removeTag);

            tagContainer.append(tagButton);
            
            tagOption.classList.add("hide");

            // to update the options container size
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
    

            function removeTag() {
                const tagContainer = document.querySelector(".tag-container");
                
                tagContainer.removeChild(tagButton);
                
                tagOption.classList.remove("hide");
            }
        }
    }
}