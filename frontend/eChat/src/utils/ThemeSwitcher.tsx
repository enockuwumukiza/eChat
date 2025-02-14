import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setTheme, Theme } from "../store/slices/themeSlice";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { Brightness4, Brightness7, Palette } from "@mui/icons-material";

// Define themes with corresponding icons
const themes: { name: Theme; icon: JSX.Element }[] = [
  { name: "light", icon: <Brightness7 className="text-yellow-500" /> },
  { name: "dark", icon: <Brightness4 className="text-gray-900" /> },
  { name: "cupcake", icon: <Palette className="text-pink-500" /> },
  { name: "synthwave", icon: <Palette className="text-purple-500" /> },
  { name: "cyberpunk", icon: <Palette className="text-yellow-300" /> },
  { name: "luxury", icon: <Palette className="text-black" /> },
  { name: "dracula", icon: <Palette className="text-red-500" /> },
];

const ThemeSwitcher: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeTheme = (newTheme: Theme) => {
    dispatch(setTheme(newTheme));
    handleClose();
  };

  return (
    <div className="fixed left-[66%] md:bottom-[20%] md:left-[10%] lg:bottom-[5%] lg:left-[2%] z-50">
        <Tooltip title={'Theme'} sx={{
            fontSize:'40px'
        }}>
            <IconButton onClick={handleClick} className="bg-base-200 shadow-md">
                  {themes.find((t) => t.name === theme)?.icon || <Palette sx={{
                      fontSize: {
                          xs: '100px',
                          sm: '100px',
                          md: '100px',
                          lg:'100px'
                            }
            }}/>}
        </IconButton>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {themes.map((t) => (
          <MenuItem key={t.name} onClick={() => changeTheme(t.name)}>
            <span className="mr-2">{t.icon}</span>
            {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default ThemeSwitcher;
