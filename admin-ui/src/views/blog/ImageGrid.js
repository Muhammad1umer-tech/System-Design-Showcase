import React from 'react'

// Rendering individual images
const Image = ({ image }) => {
  return (
    <div className="file-item">
      <img style={{width: '300px', height: '130px'}}
        src={image}
        className="file-img"
      />
    </div>
  );
};

// ImageList Component//
const ImageGride = ({ images }) => {
  // render each image by calling Image component
  const renderImage = (image) => {
    return <Image image={image} />;
  };
  // Return the list of files//
  return (
    <section className="file-list">{renderImage(images)}</section>
  );
};

export default ImageGride;