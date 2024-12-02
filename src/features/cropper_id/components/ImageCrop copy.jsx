import { useState } from "react";
// import user1 from "../../../../public/user_1.png";
import Modal from "../components/base/Modal";
import { readFile } from "../helpers/cropImage";
import ImageCropModalContent from "./ImageCropModalContent";
import { useImageCropContext } from "../providers/ImageCropProvider";
import Button from "./base/Button";
import supabase, { supabaseUrl } from "../../../services/supabase";
import { QRCodeCanvas } from "qrcode.react";

const ImageCrop = ({ electorate }) => {
  const {
    id: electorateId,
    precinctno,
    lastname,
    firstname,
    middlename,
    avatar,
    purok,
    brgy,
    signature,
    completeaddress,
  } = electorate;
  // const user1 = "/blank-profile-picture.png";
  const pic = avatar
    ? `${supabaseUrl}/storage/v1/object/public/${avatar}`
    : "/blank-profile-picture.png";
  const sig = signature ? signature : "/signature-blank.jpg";

  // const sig = "/signature-blank.jpg";
  const [openModal, setOpenModal] = useState(false);
  const [openModalSig, setOpenModalSig] = useState(false);
  const [preview, setPreview] = useState(pic);
  const [previewSig, setPreviewSig] = useState(sig);
  const [loading, setLoading] = useState(false);

  const { getProcessedImage, setImage, resetStates } = useImageCropContext();
  const {
    getProcessedImage: getProcessedImageSig,
    setImage: setImageSig,
    resetStates: resetStatesSig,
  } = useImageCropContext();

  // File input change handlers (show image preview)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const fileURL = URL.createObjectURL(file); // Preview the selected file
    setPreview(fileURL);
    setImage(fileURL);
    setOpenModal(true); // Open the crop modal
  };

  const handleFileChangeSig = async (e) => {
    const file = e.target.files[0];
    const fileURL = URL.createObjectURL(file); // Preview the selected file
    setPreviewSig(fileURL);
    setImageSig(fileURL);
    setOpenModalSig(true); // Open the crop modal
  };

  // Function to handle the crop and upload process
  const handleDonePic = async () => {
    const avatar = await getProcessedImage(); // Get the cropped image
    setPreview(URL.createObjectURL(avatar));

    // Upload the cropped avatar to Supabase
    await uploadImageToSupabase(avatar, "avatars");
    resetStates();
    setOpenModal(false); // Close the modal after cropping
    console.log("avatar:", avatar);
  };

  const handleDoneSig = async () => {
    const signature = await getProcessedImageSig(); // Get the cropped signature
    setPreviewSig(URL.createObjectURL(signature));
    // Upload the cropped signature to Supabase
    await uploadSignatureToSupabase(signature, "signature");
    resetStatesSig();
    setOpenModalSig(false); // Close the modal after cropping

    console.log("signature:", signature);
  };

  // Function to upload the cropped image to Supabase
  const uploadImageToSupabase = async (image, bucket) => {
    setLoading(true);

    try {
      // Convert the image to a Blob (can also use FileReader to get a data URL)
      const blob = await fetch(image).then((res) => res.blob());
      const fileName = `${Date.now()}_${bucket}.png`; // Unique filename for each upload

      //updating electorate

      const imagePath = `${supabaseUrl}/storage/v1/object/public/avatars/electorates/${fileName}`;
      const avatarname = `avatars/electorates/${fileName}`;
      let query = supabase.from("electorates");
      // B) Update the electorate image and avatar
      if (electorateId) {
        query = query
          .update({ image: imagePath, avatar: avatarname })
          .eq("id", electorateId);
      }
      const { data, error } = await query.select().single();
      //uploading image to bucket
      const { error: storageError } = await supabase.storage
        .from("avatars")
        .upload(`electorates/${fileName}`, image);

      setLoading(false);
      alert("Image uploaded successfully!");
      console.log("storageError:", storageError);
      console.log("Blob upload:", blob);
      console.log("Filename upload:", fileName);
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
      alert("Upload failed.");
    }
  };
  // Function to upload the cropped image to Supabase
  const uploadSignatureToSupabase = async (image, bucket) => {
    setLoading(true);

    try {
      // Convert the image to a Blob (can also use FileReader to get a data URL)
      const blob = await fetch(image).then((res) => res.blob());
      const fileName = `${Date.now()}_${bucket}.png`; // Unique filename for each upload

      //updating electorate

      const signaturePath = `${supabaseUrl}/storage/v1/object/public/avatars/electorates/${fileName}`;
      // const signame = `avatars/electorates/${fileName}`;
      let query = supabase.from("electorates");
      // B) Update the electorate image and avatar
      if (electorateId) {
        query = query
          .update({ signature: signaturePath })
          .eq("id", electorateId);
      }
      const { data, error } = await query.select().single();
      //uploading image to bucket
      const { error: storageError } = await supabase.storage
        .from("avatars")
        .upload(`electorates/${fileName}`, image);

      setLoading(false);
      alert("Image uploaded successfully!");
      console.log("storageError:", storageError);
      console.log("Blob upload Signature:", blob);
      console.log("Filename upload Signature:", fileName);
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
      alert("Upload failed.");
    }
  };
  //qr code

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");

  // Function to generate a random string
  const generateRandomString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
  };

  // Open the modal and generate a QR Code
  const handleOpenModal = () => {
    const randomString = generateRandomString(16);
    setQrCodeData(`GeneratedCode-${randomString}`);
    setIsModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Download QR code as image
  const handleDownloadQrCode = () => {
    const canvas = document.getElementById("qrCodeCanvas");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qrcode.png";
    downloadLink.click();
  };
  return (
    <>
      <div className="bg-gray-100 h-screen flex flex-col justify-center items-center">
        {/* Input Files Container */}
        <div className="flex gap-8 items-center mb-8">
          <span className="text-4xl">
            {precinctno} : {lastname}, {firstname} {middlename}
            {electorateId}
          </span>
        </div>
        <div className="flex gap-8 items-center mb-8">
          {/* First Input File */}
          <div className="flex flex-col items-center">
            <input
              type="file"
              onChange={(e) => handleFileChange(e, "input1")}
              className="hidden"
              id="avatarInput1"
              accept="image/*"
            />
            <label
              htmlFor="avatarInput1"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <img
                src={preview}
                height={200}
                width={200}
                className="object-cover h-200 w-200"
                alt="Avatar 1"
              />
              <span className="text-center mt-2">ID PICTURE</span>
            </label>
          </div>

          {/* Second Input File */}
          <div className="flex flex-col items-center">
            <input
              type="file"
              onChange={(e) => handleFileChangeSig(e, "input2")}
              className="hidden"
              id="avatarInput2"
              accept="image/*"
            />
            <label
              htmlFor="avatarInput2"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <img
                src={previewSig}
                height={200}
                width={200}
                className="object-cover h-200 w-200"
                alt="Avatar 2"
              />
              <span className="text-center mt-2">SIGNATURE</span>
            </label>
          </div>

          {/* Third Input File */}
          <div className="flex flex-col items-center">
            <input
              type="file"
              // onChange={(e) => handleFileChangeQR(e, "input2")}
              onClick={handleOpenModal}
              className="hidden"
              id="avatarInput3"
              accept="image/*"
            />
            <label
              htmlFor="avatarInput3"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <img
                src={previewSig}
                height={200}
                width={200}
                className="object-cover h-200 w-200"
                alt="Avatar 3"
              />
              <span className="text-center mt-2">QR CODE</span>
            </label>
          </div>
        </div>

        {/* Upload Button Container (on a new row) */}
        {/* <div className="flex justify-center mt-4">
        <button
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        // onClick={handleUpload}
        >
        Upload
        </button>
        </div> */}

        <Modal open={openModal} handleClose={() => setOpenModal(false)}>
          <ImageCropModalContent
            isSignature={false}
            handleDone={handleDonePic}
            handleClose={() => setOpenModal(false)}
          />
        </Modal>
        <Modal open={openModalSig} handleClose={() => setOpenModalSig(false)}>
          <ImageCropModalContent
            isSignature={true}
            handleDone={handleDoneSig}
            handleClose={() => setOpenModalSig(false)}
          />
        </Modal>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-lg font-bold mb-4 text-center">Your QR Code</h2>
            <div className="flex justify-center">
              <QRCodeCanvas
                id="qrCodeCanvas"
                value={qrCodeData}
                size={200}
                className="border border-gray-300 p-2 rounded"
              />
            </div>
            <p className="text-center mt-4 text-gray-600">{qrCodeData}</p>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={handleDownloadQrCode}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save as Image
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCrop;
