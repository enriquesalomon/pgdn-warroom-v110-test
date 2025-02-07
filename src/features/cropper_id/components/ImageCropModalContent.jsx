// import { readFile } from "@/helpers/cropImage";
import { readFile } from "../helpers/cropImage";
// import { useImageCropContext } from "@/providers/ImageCropProvider";
import { useImageCropContext } from "../providers/ImageCropProvider";
// import Button from "@/components/base/Button";
import Button from "../components/base/Button";
// import Cropper from "@/components/cropper/Cropper";
import Cropper from "../components/cropper/Cropper";
// import { RotationSlider, ZoomSlider } from "@/components/cropper/Sliders";
import { RotationSlider, ZoomSlider } from "../components/cropper/Sliders";

function ImageCropModalContent({
  handleDone,
  handleClose,
  isSignature,
  loading,
}) {
  const { setImage } = useImageCropContext();

  const handleFileChange = async ({ target: { files } }) => {
    const file = files && files[0];
    const imageDataUrl = await readFile(file);
    setImage(imageDataUrl);
  };

  // let picType = isSignature ? "Picture" : "Signature";
  return (
    <div className="text-center relative">
      <h5 className="text-gray-800 mb-4">
        {isSignature ? "Crop Signature Picture" : "Crop ID Picture"}
      </h5>
      <div className="border border-dashed border-gray-200 p-6">
        <div className="flex justify-center">
          <div className="crop-container mb-4">
            <Cropper />
          </div>
        </div>
        <ZoomSlider className="mb-4" />
        <RotationSlider className="mb-4" />
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="avatarInput"
          accept="image/*"
        />
        <Button variant="light" className="shadow w-full mb-4 hover:shadow-lg">
          <label htmlFor="avatarInput">Select Another Picture</label>
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="w-full"
            onClick={handleDone}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ImageCropModalContent;
