import React from 'react';
import ImageSlider from './ImageSlider';

function MediaGallery({ media, onImageClick }) {
  if (!media || media.length === 0) return null;

  return (
    <div className="mt-4">
      <ImageSlider images={media} onImageClick={onImageClick} />
    </div>
  );
}

export default MediaGallery;