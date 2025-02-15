import { Brightness4, Brightness7, Palette } from "@mui/icons-material";
import { Theme } from "../store/slices/themeSlice";

export const themes: { name: Theme; icon: JSX.Element }[] = [
  { name: "light", icon: <Brightness7 className="text-yellow-500" /> },
  { name: "dark", icon: <Brightness4 className="text-gray-900" /> },
  { name: "cupcake", icon: <Palette className="text-pink-500" /> },
  { name: "synthwave", icon: <Palette className="text-purple-500" /> },
  { name: "cyberpunk", icon: <Palette className="text-yellow-300" /> },
  { name: "luxury", icon: <Palette className="text-black" /> },
  { name: "dracula", icon: <Palette className="text-red-500" /> },
];