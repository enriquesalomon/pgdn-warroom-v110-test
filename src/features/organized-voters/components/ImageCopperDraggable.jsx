import React, { useState, useEffect } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import supabase, { supabaseUrl } from "../../../services/supabase";
import imageCompression from "browser-image-compression";
import { QRCodeCanvas } from "qrcode.react";
import { useInvalidateQuery } from "../hooks/useInvalidateQuery";
import { formatToSixDigits } from "../../../utils/helpers";
import styled from "styled-components";
import Heading from "../../../ui/Heading";
const StyledBookingDataBox = styled.section`
  /* Box */
  background-color: var(--color-orange-500);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 1rem 2rem;

  overflow: hidden;
`;
const ImageCopperDraggable = ({ electorate, debouncedSearchTerm }) => {
  const {
    id: electorateId,
    lastname,
    firstname,
    middlename,
    precinctno,
    gender,
    qr_code,
    avatar,
    completeaddress,
    birthdate,
    isleader,
    brgy,
    purok,
    contactdetails,
    emergencycontact,
    image,
    signature,
    qr_code_url,
    asenso_color_code_url,
  } = electorate;

  // Example usage:
  const formattedIdNumber = formatToSixDigits(electorateId);
  //setting booleans if images are existed
  const hasPic = image ? true : false;
  const hasSignature = signature ? true : false;
  const hasAsensoColorcode = asenso_color_code_url ? true : false;
  // Set initial image from avatar or fallback to blank profile picture
  const srcNoAsensoColor = "/colorcode.png";
  const pic = image ? image : "/blank-profile-picture.png";
  const sig = signature ? signature : "/signature-blank.jpg";
  const asenso = asenso_color_code_url
    ? asenso_color_code_url
    : srcNoAsensoColor;
  const qrcodepic = qr_code_url ? qr_code_url : "/qr-placeholder.png";
  const [imagePic, setImagePic] = useState(pic); // Set initial image
  const [imageSig, setImageSig] = useState(sig); // Set initial image
  const [imageQr, setQrPreview] = useState(qrcodepic);

  const [srcAsenso, setSrc] = useState(asenso); // Initial image src

  const [srcUpdatedAsenso, setsrcUpdatedAsenso] = useState(asenso); // Initial image src

  const handleImageChangeAsenso = (newSrc) => {
    setSrc(newSrc);
  };

  const [modalOpenPic, setmodalOpenPic] = useState(false);
  const [modalOpenSig, setmodalOpenSig] = useState(false);
  const [modalOpenQr, setIsModalOpenQr] = useState(false);
  const [modalOpenAsensoCode, setIsModalOpenAsensoCode] = useState(false);

  const [isCropped, setIsCropped] = useState(false);

  const [croppedImage, setCroppedImage] = useState(null);
  const [croppedImageSig, setCroppedImageSig] = useState(null);
  const [cropper, setCropper] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [qrCodeData, setQrCodeData] = useState("");

  const invalidateQueries = useInvalidateQuery(debouncedSearchTerm);
  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePic(reader.result); // Display image preview
        setmodalOpenPic(true); // Open crop modal
      };
      reader.readAsDataURL(file);
    }
  };
  // Handle image file change
  const handleImageChangeSig = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSig(reader.result); // Display image preview
        setmodalOpenSig(true); // Open crop modal
      };
      reader.readAsDataURL(file);
    }
  };
  // Handle image cropping
  const handleCrop = () => {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        setCroppedImage(blob); // Set cropped image as Blob
        setIsCropped(true);
      });
    }
  };
  // Handle image cropping
  const handleCropSig = () => {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        setCroppedImageSig(blob); // Set cropped image as Blob
        setIsCropped(true);
      });
    }
  };
  // Close the modal without saving
  const handleCloseModal = () => {
    setmodalOpenPic(false);
    setIsCropped(false);
  };
  // Close the modal without saving
  const handleCloseModalSig = () => {
    setmodalOpenSig(false);
    setIsCropped(false);
  };
  // Save the cropped image and upload to Supabase
  const handleSave = async () => {
    console.log("croppedImage", croppedImage);
    if (croppedImage) {
      const compressedImage = await compressImage(croppedImage); // Compress image before uploading
      await uploadImageToSupabase(compressedImage, "avatars");
      setImagePic(URL.createObjectURL(compressedImage)); // Update preview with the uploaded image
      setmodalOpenPic(false);
      setIsCropped(false);
    }
  };
  // // Save the cropped image and upload to Supabase
  // const handleUploadAsensoColor = async () => {
  //   console.log("asensoColor", srcAsenso);
  //   const compressedImage = await compressImage(srcAsenso); // Compress image before uploading
  //   await uploadImageAsensoToSupabase(compressedImage, "asensocolor");
  //   setImageAsenso(URL.createObjectURL(compressedImage)); // Update preview with the uploaded image
  //   setIsModalOpenAsensoCode(false);
  // };

  // Save the cropped image and upload to Supabase
  const handleSaveSig = async () => {
    if (croppedImageSig) {
      const compressedImage = await compressImage(croppedImageSig); // Compress image before uploading
      await uploadImageToSupabaseSig(compressedImage, "avatars");
      setImageSig(URL.createObjectURL(compressedImage)); // Update preview with the uploaded image
      setmodalOpenSig(false);
      setIsCropped(false);
    }
  };

  // Function to compress image before uploading
  const compressImage = async (imageBlob) => {
    try {
      const options = {
        maxSizeMB: 1, // Max size in MB
        maxWidthOrHeight: 1024, // Max width or height in px
        useWebWorker: true, // Use web worker for compression
      };
      const compressedBlob = await imageCompression(imageBlob, options); // Compress the image
      return compressedBlob;
    } catch (error) {
      console.error("Error compressing image:", error);
      alert("Image compression failed.");
      return imageBlob; // Return the original image if compression fails
    }
  };

  const handleUploadAsensoColor = async () => {
    // Check if the image is already a path from the public folder
    let imageBlob = null;

    // If srcAsenso is a string and points to a public folder image (e.g., "/AGM.png")
    if (typeof srcAsenso === "string" && srcAsenso.startsWith("/")) {
      // Fetch the image from the public directory
      const imageUrl = `${window.location.origin}${srcAsenso}`; // Construct the full URL to the image
      const response = await fetch(imageUrl);
      const blob = await response.blob(); // Convert to Blob
      imageBlob = blob; // Assign the Blob
    } else {
      // If srcAsenso is already a Blob (e.g., from input file), use it directly
      imageBlob = srcAsenso;
    }

    // Proceed with compression and upload
    const compressedImage = await compressImageAsenso(imageBlob); // Compress the image before uploading
    await uploadImageAsensoToSupabase(compressedImage, "asensocolor");
    setSrc(URL.createObjectURL(compressedImage)); // Update preview with the uploaded image
    setsrcUpdatedAsenso(URL.createObjectURL(compressedImage));
    setIsModalOpenAsensoCode(false);
  };

  // Function to compress image before uploading
  const compressImageAsenso = async (imageBlob) => {
    try {
      if (!imageBlob || !imageBlob.type.startsWith("image/")) {
        alert("Invalid image file.");
        return imageBlob;
      }

      const options = {
        maxSizeMB: 1, // Max size in MB
        maxWidthOrHeight: 1024, // Max width or height in px
        useWebWorker: false, // Disable web worker for simplicity
      };

      const compressedBlob = await imageCompression(imageBlob, options); // Compress the image
      return compressedBlob;
    } catch (error) {
      console.error("Error compressing image:", error);
      alert("Image compression failed: " + error.message);
      return imageBlob; // Return the original image if compression fails
    }
  };

  // Function to upload image Blob to Supabase storage Asenso bucket
  const uploadImageAsensoToSupabase = async (blob, bucket) => {
    setLoading(true);
    try {
      const fileName = `${Date.now()}_asensocolor.png`; // Unique file name

      const { error: storageError, data } = await supabase.storage
        .from(bucket)
        .upload(`electorates/${fileName}`, blob);

      if (storageError) {
        throw storageError;
      } else {
        if (hasAsensoColorcode) {
          const url = asenso_color_code_url;
          // Split the URL to get the file path
          const filePath = url.split("/public/asensocolor/")[1];
          console.log("this the filepath of the previous image", filePath);
          //removing the previous image that is replaced
          await supabase.storage.from(bucket).remove([filePath]);
        }
      }

      const imagePath = `${supabaseUrl}/storage/v1/object/public/${bucket}/electorates/${fileName}`;

      const { error: updateError } = await supabase
        .from("electorates")
        .update({ asenso_color_code_url: imagePath })
        .eq("id", electorateId);

      if (updateError) {
        throw updateError;
      }

      setLoading(false);
      invalidateQueries();
      alert("Asenso Color Code Image uploaded and updated successfully!");
      // setImageUrl(imagePath);
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
      alert("Upload failed.");
    }
  };
  // Function to upload image Blob to Supabase storage
  const uploadImageToSupabase = async (blob, bucket) => {
    setLoading(true);
    try {
      const fileName = `${Date.now()}_avatar.png`; // Unique file name

      const { error: storageError, data } = await supabase.storage
        .from(bucket)
        .upload(`electorates/${fileName}`, blob);

      if (storageError) {
        throw storageError;
      } else {
        if (hasPic) {
          const url = image;
          // Split the URL to get the file path
          const filePath = url.split("/public/avatars/")[1];
          console.log("this the filepath of the previous image", filePath);
          //removing the previous image that is replaced
          await supabase.storage.from(bucket).remove([filePath]);
        }
      }

      const imagePath = `${supabaseUrl}/storage/v1/object/public/${bucket}/electorates/${fileName}`;

      const { error: updateError } = await supabase
        .from("electorates")
        .update({ image: imagePath })
        .eq("id", electorateId);

      if (updateError) {
        throw updateError;
      }

      setLoading(false);
      invalidateQueries();
      alert("Image uploaded and updated successfully!");
      // setImageUrl(imagePath);
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
      alert("Upload failed.");
    }
  };
  // Function to upload image Blob to Supabase storage
  const uploadImageToSupabaseSig = async (blob, bucket) => {
    setLoading(true);
    try {
      const fileName = `${Date.now()}_sig.png`; // Unique file name

      const { error: storageError } = await supabase.storage
        .from(bucket)
        .upload(`electorates/${fileName}`, blob);

      if (storageError) {
        throw storageError;
      } else {
        if (hasSignature) {
          const url = signature;
          // Split the URL to get the file path
          const filePath = url.split("/public/avatars/")[1];
          //removing the previous signature image that is replaced
          await supabase.storage.from(bucket).remove([filePath]);
        }
      }

      const imagePath = `${supabaseUrl}/storage/v1/object/public/${bucket}/electorates/${fileName}`;

      const { error: updateError } = await supabase
        .from("electorates")
        .update({ signature: imagePath })
        .eq("id", electorateId);

      if (updateError) {
        throw updateError;
      }

      setLoading(false);
      invalidateQueries();
      alert("Image uploaded and updated successfully!");
      // setImageUrl(imagePath);
      console.log("Image uploaded:", imagePath);
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
      alert("Upload failed.");
    }
  };

  //qr code
  // Function to generate a random string
  const generateRandomString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
  };

  // Function to get the current date and time in the format MM-DD-YYYY/HH:MM:SS
  const getCurrentDateTime = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits
    const day = String(now.getDate()).padStart(2, "0"); // Ensure 2 digits
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0"); // Ensure 2 digits
    const minutes = String(now.getMinutes()).padStart(2, "0"); // Ensure 2 digits
    const seconds = String(now.getSeconds()).padStart(2, "0"); // Ensure 2 digits

    return `${month}-${day}-${year}${hours}:${minutes}:${seconds}`;
  };

  // Open the modal and generate a QR Code
  const handleOpenModalQr = () => {
    if (qrcodepic === "/qr-placeholder.png") {
      console.log("qrcodepic: ", qrcodepic);

      const randomString = generateRandomString(16);
      // // setQrCodeData(randomString);
      // setQrCodeData(
      //   `${
      //     firstname +
      //     middlename +
      //     lastname +
      //     randomString +
      //     getCurrentDateTime()
      //   }`
      // );
      // Remove spaces from the names
      const sanitizedFirstname = firstname.replace(/\s+/g, "");
      const sanitizedMiddlename = middlename.replace(/\s+/g, "");
      const sanitizedLastname = lastname.replace(/\s+/g, "");

      // Set QR code data
      setQrCodeData(
        `${sanitizedFirstname}${sanitizedMiddlename}${sanitizedLastname}${randomString}${getCurrentDateTime()}`
      );

      setIsModalOpenQr(true);
    }
  };
  const handleOpenModalAsensoCode = () => {
    setIsModalOpenAsensoCode(true);
  };
  const handleCloseModalQr = () => {
    setIsModalOpenQr(false);
  };
  // Close the modal
  const handleCloseModalAsensoColorCode = () => {
    setIsModalOpenAsensoCode(false);
  };

  // Upload the QR code image to Supabase
  const handleUploadQrCodeQr = async () => {
    setLoading(true);
    try {
      // Convert QR code canvas to a Blob
      const canvas = document.getElementById("qrCodeCanvas");
      const qrImage = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      const qrstring = `${qrCodeData}`;
      const fileName = `${qrstring}.png`;
      // const qrCodePath = `qrcode/electorates/${fileName}`;
      const qrPublicUrl = `${supabaseUrl}/storage/v1/object/public/qrcode/electorates/${fileName}`;

      // Upload the QR code to Supabase
      const { error: uploadError } = await supabase.storage
        .from("qrcode")
        .upload(`electorates/${fileName}`, qrImage);

      if (uploadError) {
        throw new Error("Failed to upload QR code to storage.");
      }

      // Update the electorate record
      const { error: updateError } = await supabase
        .from("electorates")
        .update({ qr_code_url: qrPublicUrl, qr_code: qrstring })
        .eq("id", electorateId);

      if (updateError) {
        throw new Error("Failed to update electorate record.");
      }

      // Update the QR code preview and close the modal
      setQrPreview(qrPublicUrl);
      invalidateQueries();
      setIsModalOpenQr(false);
      alert("QR code uploaded successfully!");
    } catch (error) {
      console.error("Error uploading QR code:", error);
      alert("QR code upload failed.");
    } finally {
      setLoading(false);
    }
  };
  // Function to download the image
  // const handleDownload = () => {
  //   if (imageUrl) {
  //     const a = document.createElement("a");
  //     a.href = imageUrl;
  //     a.download = imageUrl.split("/").pop(); // Use the file name from the URL
  //     a.click();
  //   }
  // };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 flex-col">
      {/* <StyledBookingDataBox>
        <Heading as="h1">
          <span className="text-white">
            {formattedIdNumber} &nbsp; {lastname}, {firstname}
            &nbsp; {middlename} &nbsp;
          </span>
        </Heading>
      </StyledBookingDataBox>
      <StyledBookingDataBox>
        <Heading as="h1">
          <span className="text-white">
            {formattedIdNumber} &nbsp; {lastname}, {firstname}
            &nbsp; {middlename} &nbsp;
          </span>
        </Heading>
      </StyledBookingDataBox> */}
      <div className="flex gap-8 items-center mb-2 ">
        <span className="text-4xl">
          {formattedIdNumber} &nbsp; {lastname}, {firstname}
          &nbsp; {middlename} &nbsp;
        </span>
      </div>
      <div className="mb-2">
        <span className="text-4xl">
          {purok}, {brgy}
        </span>
      </div>
      {/* <div>{image}</div>
      <div>{signature}</div> */}
      <div>__________________________________________</div>
      <div className="flex gap-8 items-center mb-8"></div>

      <div className="grid grid-cols-3 gap-4">
        {/* First Row */}
        {/* Image Box */}
        <div className="relative w-64 h-64 bg-white border border-gray-300 flex justify-center items-center">
          {imagePic ? (
            <img
              src={imagePic}
              alt="Cropped"
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setmodalOpenPic(true)}
            />
          ) : (
            <span className="text-gray-500">Click to upload image</span>
          )}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImageChange}
          />
        </div>

        {/* Signature Box */}
        <div className="relative w-64 h-64 bg-white border border-gray-300 flex justify-center items-center">
          {imageSig ? (
            <img
              src={imageSig}
              alt="Cropped"
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setmodalOpenSig(true)}
            />
          ) : (
            <span className="text-gray-500">Click to upload image</span>
          )}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImageChangeSig}
          />
        </div>
        {/* QR Code Preview */}
        <div className="flex flex-col items-center">
          <img
            src={imageQr}
            height={160}
            width={160}
            className="object-cover h-160 w-160 cursor-pointer"
            alt="QR Code Preview"
            onClick={handleOpenModalQr} // Call the modal on image click
          />
          {/* <span className="text-center mt-2">QR CODE</span> */}
        </div>

        {/* Second Row */}
        <div className=" text-center">ID PICTURE</div>
        <div className=" text-center">SIGNATURE</div>
        <div className=" text-center">QR CODE</div>
      </div>
      <div>__________________________________________</div>

      <div className="flex flex-col items-center mt-4">
        <img
          src={srcUpdatedAsenso}
          className="object-contain h-60 w-120 cursor-pointer"
          alt="QR Code Preview"
          onClick={handleOpenModalAsensoCode} // Call the modal on image click
        />
        <span className="text-center mt-2">ASENSO COLOR CODE</span>
      </div>

      {/* Modal (Picture) */}
      {modalOpenPic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4 text-center">
              Upload ID Picture
            </h2>
            <div className="mb-4">
              {imagePic && (
                <Cropper
                  src={imagePic}
                  style={{ height: 400, width: "100%" }}
                  aspectRatio={1} // Remove fixed aspect ratio for free cropping
                  guides={false}
                  onInitialized={(instance) => setCropper(instance)}
                />
              )}
            </div>
            <div className="flex justify-between">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={handleCloseModal}
                disabled={loading}
              >
                Close
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleCrop}
                disabled={loading}
              >
                {isCropped ? "Cropped" : "Crop"}
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Uploading..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal (Signature) */}
      {modalOpenSig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4 text-center">
              Upload Signature
            </h2>
            <div className="mb-4">
              {imageSig && (
                <Cropper
                  src={imageSig}
                  style={{ height: 400, width: "100%" }}
                  aspectRatio={NaN} // Remove fixed aspect ratio for free cropping
                  guides={false}
                  onInitialized={(instance) => setCropper(instance)}
                />
              )}
            </div>
            <div className="flex justify-between">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={handleCloseModalSig}
                disabled={loading}
              >
                Close
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleCropSig}
                disabled={loading}
              >
                {isCropped ? "Cropped" : "Crop"}
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleSaveSig}
                disabled={loading}
              >
                {loading ? "Uploading..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal */}
      {/* QR Code Modal */}
      {modalOpenQr && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-lg font-bold mb-4 text-center">
              Upload QR Code
            </h2>
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
                onClick={handleCloseModalQr}
                // className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                disabled={loading}
              >
                Close
              </button>
              <button
                onClick={handleUploadQrCodeQr}
                // className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600"
                className="bg-green-500 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
      {modalOpenAsensoCode && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-150">
            <h2 className="text-2xl font-bold mb-4 text-center">
              SET ASENSO COLOR CODE
            </h2>
            <div className="flex justify-center">
              <div className="flex flex-col items-center mt-4">
                {/* Image */}
                <img
                  src={srcAsenso}
                  className="object-contain h-40 w-120 cursor-pointer"
                  alt="QR Code Preview"
                  onClick={() => console.log("Image clicked!")} // Example click handler
                />
                {/* <span className="text-center mt-2"></span> */}

                {/* Radio Buttons */}
                <div className="flex mt-4 space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="image"
                      value="path/to/image1.jpg"
                      checked={srcAsenso === "/ORIGINAL.jpeg"} // Checked if current src is Image 1
                      onChange={() => handleImageChangeAsenso("/ORIGINAL.jpeg")}
                      className="cursor-pointer"
                    />
                    <span>ORIGINAL</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="image"
                      value="path/to/image1.jpg"
                      checked={srcAsenso === "/GM.jpeg"}
                      onChange={() => handleImageChangeAsenso("/GM.jpeg")}
                      className="cursor-pointer"
                    />
                    <span>GM</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="image"
                      value="path/to/image2.jpg"
                      checked={srcAsenso === "/AGM.jpeg"}
                      onChange={() => handleImageChangeAsenso("/AGM.jpeg")}
                      className="cursor-pointer"
                    />
                    <span>AGM</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="image"
                      value="path/to/image3.jpg"
                      checked={srcAsenso === "/LEGEND.jpeg"}
                      onChange={() => handleImageChangeAsenso("/LEGEND.jpeg")}
                      className="cursor-pointer"
                    />
                    <span>LEGEND</span>
                  </label>
                </div>
                <div className="flex mt-4 space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="image"
                      value="path/to/image1.jpg"
                      checked={srcAsenso === "/ELITE.jpeg"}
                      onChange={() => handleImageChangeAsenso("/ELITE.jpeg")}
                      className="cursor-pointer"
                    />
                    <span>ELITE</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="image"
                      value="path/to/image2.jpg"
                      checked={srcAsenso === "/TOWER.jpeg"}
                      onChange={() => handleImageChangeAsenso("/TOWER.jpeg")}
                      className="cursor-pointer"
                    />
                    <span>TOWER</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="image"
                      value="path/to/image3.jpg"
                      checked={srcAsenso === "/WARRIOR.jpeg"}
                      onChange={() => handleImageChangeAsenso("/WARRIOR.jpeg")}
                      className="cursor-pointer"
                    />
                    <span>WARRIOR</span>
                  </label>
                </div>
              </div>
            </div>
            <p className="text-center mt-4 text-gray-600">{qrCodeData}</p>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={handleCloseModalAsensoColorCode}
                // className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                disabled={loading}
              >
                Close
              </button>
              <button
                onClick={handleUploadAsensoColor}
                // className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600"
                className="bg-green-500 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Download Button */}
      {/* {imageUrl && (
        <div className="mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleDownload}
          >
            Download Image
          </button>
        </div>
      )} */}
    </div>
  );
};

export default ImageCopperDraggable;
