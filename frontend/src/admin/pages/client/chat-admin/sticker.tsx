import React from "react";

interface StickerProps {
  stickers: string[];
  onSelect: (sticker: string) => void;
}

const Sticker: React.FC<StickerProps> = ({ stickers, onSelect }) => {
  return (
    <div className="mt-4 bg-gray-100 p-3 rounded-lg">
      <h3 className="text-md font-bold mb-2">Send a Sticker:</h3>
      <div className="flex gap-2">
        {stickers.map((sticker, index) => (
          <img
            key={index}
            src={sticker}
            alt={`sticker-${index}`}
            className="w-16 h-16 cursor-pointer hover:opacity-75"
            onClick={() => onSelect(sticker)}
          />
        ))}
      </div>
    </div>
  );
};

export default Sticker;
