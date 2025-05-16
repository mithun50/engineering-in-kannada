import React from "react";

interface EmbedVideoComponentProps {
  url: string;
  onClose: () => void;
}

const EmbedVideoComponent: React.FC<EmbedVideoComponentProps> = ({
  url,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative w-full max-w-4xl  aspect-video mx-4">
        <iframe
          className="w-full h-full rounded-xl shadow-lg"
          src={url}
          title="Embedded Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-80"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default EmbedVideoComponent;
