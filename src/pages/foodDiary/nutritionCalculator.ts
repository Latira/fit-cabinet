export interface IMeal {
  id: string;
  type: string;
  description: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface INutritionSummary {
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
}

export function calculateDailySummary(meals: IMeal[]): INutritionSummary {
  return meals.reduce(
    (summary, meal) => {
      summary.totalCalories += Math.round(meal.calories || 0);
      summary.totalProtein += Math.round(meal.protein || 0);
      summary.totalFat += Math.round(meal.fat || 0);
      summary.totalCarbs += Math.round(meal.carbs || 0);
      return summary;
    },
    { totalCalories: 0, totalProtein: 0, totalFat: 0, totalCarbs: 0 }
  );
}