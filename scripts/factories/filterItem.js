class IngredientFilterFactory {
    constructor(ingredient) {
        this.name = ingredient;
    }

    getName() {
        return this.name;
    }

    createElementDOM() {
        // const options = document.createElement("ul");
        // options.classList.add("filter-menu-options");
        // const li = document.createElement("li");
        // li.classList.add("option-item");
        // li.textContent = this.name;
        // options.append(li);
        // return options;

        const li = document.createElement("li");
        li.classList.add("option-item");
        li.textContent = this.name;
        return li;
    }
}


class UstensilFilterFactory {
    constructor(ustensil) {
        this.name = ustensil;
    }

    getName() {
        return this.name;
    }

    createElementDOM() {
        // const options = document.createElement("ul");
        // options.classList.add("filter-menu-options");
        // const li = document.createElement("li");
        // li.classList.add("option-item");
        // li.textContent = this.name;
        // options.append(li);
        // return options;

        const li = document.createElement("li");
        li.classList.add("option-item");
        li.textContent = this.name;
        return li;
    }
}


class ApplianceFilterFactory {
    constructor(appliance) {
        this.name = appliance;
    }

    getName() {
        return this.name;
    }

    createElementDOM() {
        // const options = document.createElement("ul");
        // options.classList.add("filter-menu-options");
        // const li = document.createElement("li");
        // li.classList.add("option-item");
        // li.textContent = this.name;
        // options.append(li);
        // return options;

        const li = document.createElement("li");
        li.classList.add("option-item");
        li.textContent = this.name;
        return li;
    }
}