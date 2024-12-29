import React from "react";
import { ModalProps } from "../utils/modalInterface";
const RightToLeftModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center ${
        isOpen ? "justify-end" : "hidden"
      }`}
    >
      <div
        className={`bg-white w-80 h-full p-4 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-500 ease-in-out`}
      >
        <h2 className="text-xl font-bold mb-4">Right-to-Left Modal</h2>
        <button className="btn btn-primary mb-2" onClick={() => alert("Clicked Button 1!")}>
          Button 1
        </button>
        <button className="btn btn-secondary mb-2" onClick={() => alert("Clicked Button 2!")}>
          Button 2
        </button>
        <button className="btn btn-accent mb-2" onClick={() => alert("Clicked Button 3!")}>
          Button 3
        </button>
        <button className="btn btn-error" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default RightToLeftModal;
