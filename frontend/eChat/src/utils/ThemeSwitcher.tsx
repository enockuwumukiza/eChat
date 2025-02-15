import { useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setTheme, Theme } from "../store/slices/themeSlice";
import {Menu, MenuItem, Modal, Box } from "@mui/material";
import { setIsThemesShown } from "../store/slices/displaySlice";

import { themes } from "./themes";

const ThemeSwitcher: React.FC = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const isThemesShwon = useSelector((state: RootState) => state.display.isThemesShwon);


  const handleClose = () => {
    setAnchorEl(null);
    dispatch(setIsThemesShown(false))
  };

  const changeTheme = (newTheme: Theme) => {
    dispatch(setTheme(newTheme));
    dispatch(setIsThemesShown(false))
    handleClose();
  };

  return (
    <Modal open={isThemesShwon} onClose={handleClose} >
      <Box>
      <Menu anchorEl={anchorEl} open={isThemesShwon} onClose={handleClose} >
        {themes.map((t) => (
          <MenuItem key={t.name} onClick={() => changeTheme(t.name)}>
            <span className="mr-2">{t.icon}</span>
            {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
          </MenuItem>
        ))}
      </Menu>
      </Box>
    </Modal>
  );
};

export default ThemeSwitcher;
