class TagMenu {
    constructor(menuTitle, menuColor, tagsType, tagsTypeName) {
        this.menuTitle = menuTitle;
        this.menuColor = menuColor;
        this.tagsType = tagsType;
        this.tagsTypeName = tagsTypeName;
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
        searchBar.setAttribute("placeholder", `Rechercher un ${this.tagsTypeName}`);
    
        const optionsContainer = document.createElement("ul");
        optionsContainer.classList.add("filter-menu-options");
        
        // append elements
        menu.append(menuTitle, menuContent);
        menuContent.append(searchBar, optionsContainer);

        // event
        menu.addEventListener("click", openDropdown);
        searchBar.addEventListener("input", filterTags);


        // functions
        function openDropdown() {
            const menuOptionsQty = optionsContainer.querySelectorAll(":not(.hide)");
            
            menuContent.style.display = "block";

            updateOptionsContainerSize(menuOptionsQty, menuContent, menu);

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
            const tagsType = getTagsType(menuSelected);
            const tagsFromRecipesDisplayed = getTagsValue();
            
            const tagsFromRecipesDisplayedWithoutDuplicate = Array.from(new Set(tagsFromRecipesDisplayed));
        
            // get tags according to input value
            const tagsCorrespondingToInput = tagsFromRecipesDisplayedWithoutDuplicate.filter(tag => tag.toLowerCase().includes(inputValue));
        
            optionsContainer.textContent = "";

            // generate tags options items
            if (tagsCorrespondingToInput.length > 0) {
                tagsCorrespondingToInput.forEach(tag => {
                    const tagModel = new TagFactory(tag);
                    const tagDOM = tagModel.getElementDOM();
                    optionsContainer.append(tagDOM);
                })
            } else {
                const noResultMessage = document.createElement("p");
                noResultMessage.textContent = "Aucun résultat";
                optionsContainer.append(noResultMessage);
            }
        
            // update the options container size
            const menuOptionsQty = optionsContainer.querySelectorAll(":not(.hide)");
            const menuContent = optionsContainer.parentNode;

            updateOptionsContainerSize(menuOptionsQty, menuContent, menuSelected);


            function getTagsValue() {
                if (tagsType == "ingredients") {
                    return currentRecipesDisplayed.flatMap((recipe) => recipe[tagsType].map((item) => item.ingredient));
                } 
                else {
                    return currentRecipesDisplayed.flatMap(recipe => recipe[tagsType]); // flatmap allows to merge an array containing another arrays into only one array
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
            const tagsType = getTagsType(menuSelected);
            
            // get button tag value
            const existingTagsButtons = Array.from(document.querySelectorAll(".button-tag")).map(tagButton => tagButton.textContent)

            // create tag button according to tag type
            if (!existingTagsButtons.includes(tagOption.textContent)) {
                const tagButton = document.createElement("button");

                tagButton.classList.add("button-tag");
        
                if (optionsContainer.parentNode.className.includes("green")) {
                    tagButton.classList.add("button-tag-green");
                } else if (optionsContainer.parentNode.className.includes("red")) {
                    tagButton.classList.add("button-tag-red");
                } else if (optionsContainer.parentNode.className.includes("blue")) {
                    tagButton.classList.add("button-tag-blue");
                }

                tagButton.setAttribute("tagtype", tagsType);
                tagButton.textContent = tagOption.textContent;
                tagButton.addEventListener("click", removeTag);

                tagContainer.append(tagButton);

                // to update the options container size
                const optionsVisible = optionsContainer.querySelectorAll(":not(.hide)");

                updateOptionsContainerSize(optionsVisible, menuDropdownSelected, menuSelected);
            }

            
            function removeTag(event) {
                const tagContainer = document.querySelector(".tag-container");
                
                tagContainer.removeChild(event.target);
            }
        }
    }
}


function getTagsType(menuSelected) {
    if (menuSelected.id == "menu-appliance") {
        return "appliance";
    } else if (menuSelected.id == "menu-ustensils") {
        return "ustensils";
    } else if (menuSelected.id == "menu-ingredients") {
        return "ingredients";
    }
}


function updateOptionsContainerSize(menuOptionsQty, menuContent, menuSelected) {
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
}