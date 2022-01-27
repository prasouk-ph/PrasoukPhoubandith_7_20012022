class RecipeFactory {
    constructor(recipe) {
        this._id = recipe.id;
        this._name = recipe.name;
        this._servings = recipe.servings;
        this._ingredients = recipe.ingredients;
        this._time = recipe.time;
        this._description = recipe.description;
        this._appliance = recipe.appliance;
        this._ustensils = recipe.ustensils;
    }

    getId() {
        return this._id;
    }

    getName() {
        return this._name;
    }

    getServings() {
        return this._servings;
    }

    getIngredients() {
        return this._ingredients;
    }

    getTime() {
        return this._time;
    }

    getDescription() {
        return this._description;
    }

    getAppliance() {
        return this._appliance;
    }

    getUstensils() {
        return this._ustensils;
    }

    createCard() {
        const card = document.createElement("div");
        card.classList.add("card");

        const cardPicture = document.createElement("div");
        cardPicture.classList.add("card-picture");
        const recipePicture = document.createElement("img");
        recipePicture.classList.add("recipe-picture");

        const cardContent = document.createElement("div");
        cardContent.classList.add("card-content");
        const contentHeader = document.createElement("div");
        contentHeader.classList.add("content-header");
        const recipeTitle = document.createElement("h2");
        recipeTitle.classList.add("recipe-title");
        recipeTitle.textContent = this._name;
        const recipeDuration = document.createElement("p");
        recipeDuration.classList.add("recipe-duration");
        recipeDuration.textContent = `${this._time} min`;

        const contentDetails = document.createElement("div");
        contentDetails.classList.add("content-details");
        const recipeIngredientsContainer = document.createElement("div");
        recipeIngredientsContainer.classList.add("recipe-ingredients");

        const recipeIngredients = this._ingredients;
        recipeIngredients.forEach(ingredient => {
            const ingredientModel = new IngredientFactory(ingredient);
            const ingredientDOM = ingredientModel.createIngredient()
            recipeIngredientsContainer.append(ingredientDOM);
        });
        
        
        const recipeNotice = document.createElement("p");
        recipeNotice.classList.add("recipe-notice");
        recipeNotice.textContent = this._description;


        cardPicture.append(recipePicture);
        contentHeader.append(recipeTitle, recipeDuration);
        cardContent.append(contentHeader, contentDetails);
        contentDetails.append(recipeIngredientsContainer, recipeNotice);
        card.append(cardPicture, cardContent);
        return card;
    }
}


class IngredientFactory {
    constructor(data) {
        this.ingredient = data.ingredient;
        this.quantity = data.quantity;
        this.unit = data.unit;
    }

    getQuantity() {
        if (this.quantity != undefined && this.unit != undefined) {
            return `${this.quantity} ${this.unit}`;
        } else if (this.quantity != undefined && this.unit == undefined) {
            return this.quantity;
        } else if (this.quantity == undefined && this.unit != undefined) {
            return this.unit;
        } else if (this.quantity == undefined && this.unit == undefined) {
            return "";
        }
    }

    createIngredient() {
        const ingredientsItem = document.createElement("div");
        ingredientsItem.classList.add("ingredients-item");
        const ingredientTitle = document.createElement("p");
        ingredientTitle.textContent = `${this.ingredient}:`;
        ingredientTitle.classList.add("ingredients-name");
        ingredientsItem.append(ingredientTitle);
        if (this.quantity != undefined) {
            const ingredientQuantity = document.createElement("p");
            ingredientQuantity.classList.add("ingredients-qty");
            ingredientQuantity.textContent = this.getQuantity();
            ingredientsItem.append(ingredientQuantity);
            }
        return (ingredientsItem);
    }
}