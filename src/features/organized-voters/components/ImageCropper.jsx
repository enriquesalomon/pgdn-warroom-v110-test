import ImageCropProvider from "./../../cropper_id/providers/ImageCropProvider";
import ImageCrop from "./../../cropper_id/components/ImageCrop";
import "./../../cropper_id/index.css";

const ImageCropper = ({ electorate }) => {
  return (
    // <div className="bg-gray-100 h-screen flex justify-center items-center">
    <div>
      <ImageCropProvider>
        <ImageCrop electorate={electorate} />
      </ImageCropProvider>
    </div>
  );
};

export default ImageCropper;
