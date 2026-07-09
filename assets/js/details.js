$(document).ready(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    if (recipeId) {
        fetchRecipeDetails(recipeId);
    } else {
        $('#recipe-container').hide().html('<div class="status-msg">Recipe not found.</div>').fadeIn(300);
    }
});

async function fetchRecipeDetails(id) {
    const $container = $('#recipe-container');
    try {
        const response = await fetch(`https://dummyjson.com/recipes/${id}`);
        if (!response.ok) throw new Error('Could not fetch recipe.');

        const recipe = await response.json();
        renderDetails(recipe);
    } catch (error) {
        $container.hide().html(`<div class="status-msg" style="color: #DC2626;">Error loading recipe details.</div>`).fadeIn(300);
    }
}

function renderDetails(recipe) {
    const $container = $('#recipe-container');
    const htmlContent = `
        <div class="card recipe-details-card">
            <img src="${recipe.image}" alt="${recipe.name}" class="details-hero-img">
            <h1 class="details-title">${recipe.name}</h1>
            
            <div class="details-meta-grid">
                <p><i class="fa-solid fa-utensils icon-brand"></i> <strong>Cuisine:</strong> ${recipe.cuisine}</p>
                <p><i class="fa-solid fa-gauge-high icon-brand"></i> <strong>Difficulty:</strong> ${recipe.difficulty}</p>
                <p><i class="fa-regular fa-clock icon-brand"></i> <strong>Prep time:</strong> ${recipe.prepTimeMinutes} min</p>
                <p><i class="fa-solid fa-fire-burner icon-brand"></i> <strong>Cook time:</strong> ${recipe.cookTimeMinutes} min</p>
                <p><i class="fa-solid fa-users icon-brand"></i> <strong>Servings:</strong> ${recipe.servings}</p>
                <p><i class="fa-solid fa-fire icon-brand"></i> <strong>Calories:</strong> ${recipe.caloriesPerServing} kcal</p>
                <p><strong>Rating:</strong> <span>${recipe.rating}</span> <i class="fa-solid fa-star icon-star"></i> <span>(${recipe.reviewCount} reviews)</span></p>
            </div>
            
            <h3 class="details-subtitle"><i class="fa-solid fa-basket-shopping icon-brand"></i> Ingredients</h3>
            <ul class="details-list ingredients-list">
                ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>

            <h3 class="details-subtitle"><i class="fa-solid fa-list-ol icon-brand"></i> Instructions</h3>
            <ol class="details-list instructions-list">
                ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
            </ol>
        </div>
    `;
    
    $container.hide().html(htmlContent).fadeIn(400);
}
