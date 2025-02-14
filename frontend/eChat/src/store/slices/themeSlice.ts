import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define available themes
export type Theme = "light" | "dark" | "cupcake" | "synthwave" | "cyberpunk" | "luxury" | "dracula";


// Get initial theme from localStorage or default to "light"
const storedTheme = (localStorage.getItem("theme") as Theme) || "light";

// Apply stored theme immediately on load
document.documentElement.setAttribute("data-theme", storedTheme);

const themeSlice = createSlice({
  name: "theme",
  initialState: storedTheme,
  reducers: {
    setTheme: (_, action: PayloadAction<Theme>) => {
      
      localStorage.setItem("theme", action.payload); // Save theme to localStorage
      document.documentElement.setAttribute("data-theme", action.payload); // Apply theme
      return action.payload; // Update Redux state
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
