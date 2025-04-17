import React from "react";

interface DeleteMessageProps {
  onDeleteFromEveryone: () => void;
  onDeleteFromMe: () => void;
  isVisible: boolean;
}

const DeleteMessageModal: React.FC<DeleteMessageProps> = ({
  onDeleteFromEveryone,
  onDeleteFromMe,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white shadow-lg p-4 rounded-lg z-50">
      <p className="text-gray-700 text-center font-semibold mb-2">
        Delete this message?
      </p>
      <div className="flex gap-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={onDeleteFromEveryone}
        >
          Delete from Everyone
        </button>
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          onClick={onDeleteFromMe}
        >
          Delete from Me
        </button>
      </div>
    </div>
  );
};

export default DeleteMessageModal;
