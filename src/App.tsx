import { useState, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";
import styled from "styled-components";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface Recipe {
  id: number;
  name: string;
  ingredients: {
    amount: number;
    unit: string;
    item: string;
  }[];
  instructions: string;
  servings: number;
}

const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%);
  min-height: 100vh;
  color: white;
`;

const RecipeCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 1.5rem;
  margin: 1rem 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  color: #333;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const IngredientList = styled.ul`
  list-style: none;
  padding: 0;
  text-align: left;
`;

function App() {
  const [recipes, setRecipes] = useLocalStorageState<Recipe[]>("recipes", {
    defaultValue: [],
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [servingsMultiplier, setServingsMultiplier] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    if (recipes.length === 0) {
      const boilerplateRecipes = [
        {
          id: 1,
          name: "Classic Spaghetti Carbonara",
          ingredients: [
            { amount: 400, unit: "g", item: "spaghetti" },
            { amount: 200, unit: "g", item: "pancetta" },
            { amount: 4, unit: "", item: "large eggs" },
            { amount: 100, unit: "g", item: "Pecorino Romano" },
          ],
          instructions: "1. Cook pasta\n2. Fry pancetta\n3. Mix eggs and cheese\n4. Combine all ingredients",
          servings: 4,
        },
        {
          id: 2,
          name: "Chicken Tikka Masala",
          ingredients: [
            { amount: 500, unit: "g", item: "chicken breast" },
            { amount: 400, unit: "ml", item: "coconut milk" },
            { amount: 2, unit: "tbsp", item: "tikka masala paste" },
          ],
          instructions: "1. Marinate chicken\n2. Cook chicken\n3. Add sauce ingredients\n4. Simmer",
          servings: 4,
        },
        {
          id: 3,
          name: "Greek Salad",
          ingredients: [
            { amount: 4, unit: "", item: "tomatoes" },
            { amount: 1, unit: "", item: "cucumber" },
            { amount: 200, unit: "g", item: "feta cheese" },
            { amount: 50, unit: "g", item: "black olives" },
          ],
          instructions: "1. Chop vegetables\n2. Combine ingredients\n3. Add dressing",
          servings: 2,
        },
        {
          id: 4,
          name: "Banana Smoothie",
          ingredients: [
            { amount: 2, unit: "", item: "bananas" },
            { amount: 300, unit: "ml", item: "milk" },
            { amount: 2, unit: "tbsp", item: "honey" },
          ],
          instructions: "1. Peel bananas\n2. Blend all ingredients\n3. Serve cold",
          servings: 2,
        },
        {
          id: 5,
          name: "Guacamole",
          ingredients: [
            { amount: 3, unit: "", item: "avocados" },
            { amount: 1, unit: "", item: "lime" },
            { amount: 1, unit: "", item: "red onion" },
            { amount: 2, unit: "", item: "tomatoes" },
          ],
          instructions: "1. Mash avocados\n2. Dice vegetables\n3. Mix ingredients\n4. Season",
          servings: 4,
        },
      ];
      setRecipes(boilerplateRecipes);
    }
  }, [recipes, setRecipes]);

  const handleServingsChange = (id: number, multiplier: number) => {
    setServingsMultiplier(prev => ({
      ...prev,
      [id]: multiplier
    }));
  };

  const calculateAmount = (amount: number, recipeId: number) => {
    const multiplier = servingsMultiplier[recipeId] || 1;
    return (amount * multiplier).toFixed(1);
  };

  return (
    <AppContainer>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
        Recipe Book
      </Typography>

      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id}>
          <Typography variant="h5" gutterBottom sx={{ color: '#ff6b6b' }}>
            {recipe.name}
          </Typography>
          
          <TextField
            type="number"
            label="Servings Multiplier"
            value={servingsMultiplier[recipe.id] || 1}
            onChange={(e) => handleServingsChange(recipe.id, parseFloat(e.target.value) || 1)}
            sx={{ mb: 2, width: 150 }}
            inputProps={{ min: 0.5, step: 0.5 }}
          />
          
          <Typography variant="subtitle1" gutterBottom>
            Original servings: {recipe.servings} | 
            Adjusted servings: {(recipe.servings * (servingsMultiplier[recipe.id] || 1)).toFixed(1)}
          </Typography>

          <Typography variant="h6" gutterBottom>Ingredients:</Typography>
          <IngredientList>
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx}>
                {calculateAmount(ing.amount, recipe.id)} {ing.unit} {ing.item}
              </li>
            ))}
          </IngredientList>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Instructions:</Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line', textAlign: 'left' }}>
            {recipe.instructions}
          </Typography>
        </RecipeCard>
      ))}
    </AppContainer>
  );
}

export default App;
