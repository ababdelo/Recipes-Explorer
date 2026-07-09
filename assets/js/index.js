
let allRecipes = [];

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    getRecipes();
});

function setupEventListeners() {
    document.getElementById('search-bar').addEventListener('input', applyFilters);
    ['cuisine', 'difficulty', 'mealType'].forEach(id => {
        document.getElementById(id).addEventListener('change', applyFilters);
    });
}

async function getRecipes() {
    const container = document.getElementById('recipes');
    container.innerHTML = '<div class="status-msg">Loading recipes...</div>';

    try {
        const response = await fetch('https://dummyjson.com/recipes');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        allRecipes = data.recipes;

        setFilters(allRecipes);
        renderRecipes(allRecipes);

    } catch (error) {
        console.error('Error fetching recipes:', error);
        container.innerHTML = `<div class="status-msg" style="color: #DC2626;">Failed to load recipes. Please try again later.</div>`;
    }
}

function setFilters(recipes) {
    const cuisineSel = document.getElementById('cuisine');
    const difficultySel = document.getElementById('difficulty');
    const mealTypeSel = document.getElementById('mealType');

    [cuisineSel, difficultySel, mealTypeSel].forEach(select => select.options.length = 1);

    const allCuisines = [...new Set(recipes.map(r => r.cuisine))];
    const allDifficulties = [...new Set(recipes.map(r => r.difficulty))];
    const allMealTypes = [...new Set(recipes.flatMap(r => r.mealType))];

    allCuisines.sort().forEach(c => cuisineSel.add(new Option(c, c.toLowerCase())));
    allDifficulties.sort().forEach(d => difficultySel.add(new Option(d, d.toLowerCase())));
    allMealTypes.sort().forEach(m => mealTypeSel.add(new Option(m, m.toLowerCase())));
}

function applyFilters() {
    if (!allRecipes.length) return;

    const search = document.getElementById('search-bar').value.trim().toLowerCase();
    const cuisine = document.getElementById('cuisine').value;
    const difficulty = document.getElementById('difficulty').value;
    const mealType = document.getElementById('mealType').value;

    const filteredRecipes = allRecipes.filter(recipe => {
        const matchSearch = !search ||
            recipe.name.toLowerCase().includes(search) ||
            recipe.ingredients.some(ing => ing.toLowerCase().includes(search));

        const matchCuisine = cuisine === 'all' || recipe.cuisine.toLowerCase() === cuisine;
        const matchDifficulty = difficulty === 'all' || recipe.difficulty.toLowerCase() === difficulty;
        const matchMealType = mealType === 'all' || recipe.mealType.some(m => m.toLowerCase() === mealType);

        return matchSearch && matchCuisine && matchDifficulty && matchMealType;
    });

    renderRecipes(filteredRecipes);
}

function renderRecipes(recipesArray) {
    const container = document.getElementById('recipes');
    container.innerHTML = '';

    document.getElementById('found').textContent = recipesArray.length;
    document.getElementById('total').textContent = allRecipes.length;

    if (recipesArray.length === 0) {
        container.innerHTML = `<div class="status-msg" style="color: #6c757d;">No recipes found matching your criteria.</div>`;
        return;
    }

    recipesArray.forEach(recipe => {
        generateRecipeCard(recipe, container);
    });
}
