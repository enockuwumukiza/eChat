import { useState } from "react";
import { IconButton } from "@mui/material";
import { PushPin, Delete } from "@mui/icons-material";

const PinnedMessage = ({ message, onUnpin, onDelete }: any) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="absolute right-0 flex items-center justify-between bg-slate-600 z-50 top-16 text-white p-3 rounded-lg shadow-md w-full max-w-md hover:bg-gray-700 transition-all"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Message Content */}
      <p className="text-sm flex-1">{message.text}</p>

      {/* Icons (Hidden by Default, Show on Hover) */}
      {hovered && (
        <div className="flex items-center gap-2">
          <IconButton onClick={onUnpin} className="text-white">
            <PushPin fontSize="small" />
          </IconButton>
          <IconButton onClick={onDelete} className="text-red-500">
            <Delete fontSize="small" />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default PinnedMessage;
