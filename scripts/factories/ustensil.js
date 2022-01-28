class UstensilFactory {
    constructor(ustensil) {
        this.name = ustensil;
    }

    getName() {
        return this.name;
    }

    createElementDOM() {
        const button = document.createElement("li");
        button.classList.add("option-item");
        button.textContent = this.name;
        return button;
    }
}