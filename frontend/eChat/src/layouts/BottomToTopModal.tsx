import React from "react";
import { ModalProps } from "../utils/modalInterface";
const BottomToTopModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex ${
        isOpen ? "justify-center items-end" : "hidden"
      }`}
    >
      <div
        className={`bg-white w-full max-w-md p-4 transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } transition-transform duration-500 ease-in-out`}
      >
        <h2 className="text-xl font-bold mb-4">Bottom-to-Top Modal</h2>
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

export default BottomToTopModal;
