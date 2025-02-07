import Modal from "../../../ui/Modal";
import Table from "../../../ui/Table";
import { AiOutlineIdcard } from "react-icons/ai";
import IDCard from "./IDCard";
import Menus from "../../../ui/Menus";
import { useState } from "react";
import supabase from "../../../services/supabase";
import ImageCopperDraggable from "./ImageCopperDraggable";
import styled from "styled-components";
import { replaceSpecialChars } from "../../../utils/helpers";
import { HiPencil } from "react-icons/hi2";
import ElectorateForm from "./ElectorateForm";
import { MdFileDownload } from "react-icons/md";
import { PAGE_SIZE } from "../../../utils/constants";
const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  /* 
  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  } */
`;
function ElectoratesRow({
  page,
  electorate,
  index,
  debouncedSearchTerm,
  data_colorCode,
}) {
  const {
    id: electorateId,
    precinctno,
    lastname,
    firstname,
    middlename,
    purok,
    brgy,
    completeaddress,
    id_printed_status,
    image,
    signature,
    qr_code_url,
    asenso_color_code_url,
  } = electorate;
  console.log(
    "electorate row data data_colorCode",
    JSON.stringify(data_colorCode)
  );

  if (electorate.birthdate && electorate.birthdate.includes("/")) {
    const parts = electorate.birthdate.split("/");

    if (parts.length === 3) {
      // Ensure the split array has 3 elements
      const day = parts[0].padStart(2, "0");
      const month = parts[1].padStart(2, "0");
      const year = parts[2];

      electorate.birthdate = `${year}-${month}-${day}`;
    } else {
      console.error("Unexpected birthdate format:", electorate.birthdate);
    }
  } else {
    console.log(
      "Birthdate does not contain a '/' or is undefined:",
      electorate.birthdate
    );
  }

  // const [isChecked, setIsChecked] = useState(false);
  const [isChecked, setIsChecked] = useState(!!id_printed_status); // Initialize with idprint_status

  // Handle checkbox state change
  const handleCheckboxChange = async (event) => {
    const checked = event.target.checked;

    // Show confirmation alert
    const confirmChange = window.confirm(
      `Are you sure you want to mark this ID as ${
        checked ? "printed" : "not printed"
      }?`
    );

    if (!confirmChange) {
      // If the user selects "No", reset the checkbox to its previous state
      event.target.checked = isChecked;
      return;
    }

    setIsChecked(checked); // Update state

    try {
      const { error } = await supabase
        .from("electorates") // Replace with your actual table name
        .update({ id_printed_status: checked }) // Update the idprint_status column
        .eq("id", electorateId); // Match the ID of the current electorate

      if (error) throw error;
      console.log(
        `Updated idprint_status to ${checked} for ID: ${electorateId}`
      );
    } catch (err) {
      console.error("Error updating Supabase:", err.message);
    }
  };

  return (
    <Table.Row>
      <div>{(page - 1) * PAGE_SIZE + index + 1}</div>
      <div>{precinctno}</div>
      <div>{replaceSpecialChars(lastname)}</div>
      <div>{replaceSpecialChars(firstname)}</div>
      <div>{replaceSpecialChars(middlename)}</div>
      {/* <div>{purok}</div> */}
      <div className="w-54 overflow-hidden truncate">
        {replaceSpecialChars(purok) + ", " + brgy}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        {isChecked ? "Printed" : "Not Printed"}
      </div>
      <Stacked>
        {image === null && (
          <span className="text-lg text-red-700">No Picture</span>
        )}
        {signature === null && (
          <span className="text-lg text-red-700">No Signature</span>
        )}
        {qr_code_url === null && (
          <span className="text-lg text-red-700">No QR Code</span>
        )}
        {asenso_color_code_url === null && (
          <span className="text-lg text-red-700">No Color Code</span>
        )}
      </Stacked>

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={electorateId} />

            <Menus.List id={electorateId}>
              <Modal.Open opens="img_crop">
                <Menus.Button icon={<AiOutlineIdcard />}>
                  Upload Picture|Signature|QRCode|ColorCode
                </Menus.Button>
              </Modal.Open>
              {/* <Modal.Open opens="view_card">
                <Menus.Button icon={<AiOutlineIdcard />}>
                  View Card
                </Menus.Button>
              </Modal.Open> */}
              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit Details</Menus.Button>
              </Modal.Open>

              {electorate?.image && electorate.image.trim() !== "" && (
                <Menus.Button
                  icon={<MdFileDownload />}
                  onClick={async () => {
                    const fetchBlob = async (image) => {
                      try {
                        const response = await fetch(image);
                        if (!response.ok) {
                          throw new Error(`Failed to download ${image}`);
                        }
                        return await response.blob();
                      } catch (error) {
                        console.error("Error downloading file:", error);
                        alert("Failed to download the file. Please try again.");
                      }
                    };

                    const url = electorate?.image; // Replace with the actual URL
                    const filename = `${electorateId}_avatar.png`; // Name of the downloaded file

                    try {
                      const blob = await fetchBlob(url);
                      if (blob) {
                        const link = document.createElement("a");
                        const blobUrl = URL.createObjectURL(blob);

                        link.href = blobUrl;
                        link.download = filename; // Set the filename for the download
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        // Revoke the Blob URL after download
                        URL.revokeObjectURL(blobUrl);
                      }
                    } catch (error) {
                      console.error("Error handling the download:", error);
                    }
                  }}
                >
                  Download ID Picture
                </Menus.Button>
              )}

              {electorate?.signature && electorate.signature.trim() !== "" && (
                <Menus.Button
                  icon={<MdFileDownload />}
                  onClick={async () => {
                    const fetchBlob = async (signature) => {
                      try {
                        const response = await fetch(signature);
                        if (!response.ok) {
                          throw new Error(`Failed to download ${signature}`);
                        }
                        return await response.blob();
                      } catch (error) {
                        console.error("Error downloading file:", error);
                        alert("Failed to download the file. Please try again.");
                      }
                    };

                    const url = electorate?.signature; // Replace with the actual URL
                    const filename = `${electorateId}_signature.png`; // Name of the downloaded file

                    try {
                      const blob = await fetchBlob(url);
                      if (blob) {
                        const link = document.createElement("a");
                        const blobUrl = URL.createObjectURL(blob);

                        link.href = blobUrl;
                        link.download = filename; // Set the filename for the download
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        // Revoke the Blob URL after download
                        URL.revokeObjectURL(blobUrl);
                      }
                    } catch (error) {
                      console.error("Error handling the download:", error);
                    }
                  }}
                >
                  Download Signature
                </Menus.Button>
              )}

              {electorate?.qr_code_url &&
                electorate.qr_code_url.trim() !== "" && (
                  <Menus.Button
                    icon={<MdFileDownload />}
                    onClick={async () => {
                      const fetchBlob = async (qr_code_url) => {
                        try {
                          const response = await fetch(qr_code_url);
                          if (!response.ok) {
                            throw new Error(
                              `Failed to download ${qr_code_url}`
                            );
                          }
                          return await response.blob();
                        } catch (error) {
                          console.error("Error downloading file:", error);
                          alert(
                            "Failed to download the file. Please try again."
                          );
                        }
                      };

                      const url = electorate?.qr_code_url; // Replace with the actual URL
                      const filename = `${electorateId}_qrcode.png`; // Name of the downloaded file

                      try {
                        const blob = await fetchBlob(url);
                        if (blob) {
                          const link = document.createElement("a");
                          const blobUrl = URL.createObjectURL(blob);

                          link.href = blobUrl;
                          link.download = filename; // Set the filename for the download
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);

                          // Revoke the Blob URL after download
                          URL.revokeObjectURL(blobUrl);
                        }
                      } catch (error) {
                        console.error("Error handling the download:", error);
                      }
                    }}
                  >
                    Download QR Code
                  </Menus.Button>
                )}

              {electorate?.asenso_color_code_url &&
                electorate.asenso_color_code_url.trim() !== "" && (
                  <Menus.Button
                    icon={<MdFileDownload />}
                    onClick={async () => {
                      const fetchBlob = async (asenso_color_code_url) => {
                        try {
                          const response = await fetch(asenso_color_code_url);
                          if (!response.ok) {
                            throw new Error(
                              `Failed to download ${asenso_color_code_url}`
                            );
                          }
                          return await response.blob();
                        } catch (error) {
                          console.error("Error downloading file:", error);
                          alert(
                            "Failed to download the file. Please try again."
                          );
                        }
                      };

                      const url = electorate?.asenso_color_code_url;
                      const filename = `${electorateId}_asensocolor.jpeg`; // Name of the downloaded file

                      try {
                        const blob = await fetchBlob(url);
                        if (blob) {
                          const link = document.createElement("a");
                          const blobUrl = URL.createObjectURL(blob);

                          link.href = blobUrl;
                          link.download = filename; // Set the filename for the download
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);

                          // Revoke the Blob URL after download
                          URL.revokeObjectURL(blobUrl);
                        }
                      } catch (error) {
                        console.error("Error handling the download:", error);
                      }
                    }}
                  >
                    Download Asenso Color Code
                  </Menus.Button>
                )}
            </Menus.List>
            <Modal.Window name="edit" heightvar="90%">
              <ElectorateForm
                electorateToEdit={electorate}
                debouncedSearchTerm={debouncedSearchTerm}
              />
            </Modal.Window>

            <Modal.Window name="img_crop" heightvar="100%" widthvar="100%">
              <div className="mt-6">
                {/* <ImageCropper electorate={electorate} /> */}
                <ImageCopperDraggable
                  data_colorCode={data_colorCode}
                  electorate={electorate}
                  debouncedSearchTerm={debouncedSearchTerm}
                />
              </div>
            </Modal.Window>
            <Modal.Window
              backdrop={true}
              name="view_card"
              heightvar="100%"
              widthvar="100%"
            >
              <IDCard electorate={electorate} />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
      {/* <div>
        <Modal>
          <Modal.Open opens="service-form">
            <ButtonIcon>
              <div className="flex items-center" style={{ color: "#FFA500" }}>
                <AiOutlineIdcard className="mr-2 " /> VIEW
              </div>
            </ButtonIcon>
          </Modal.Open>
          <Modal.Window
            backdrop={true}
            name="service-form"
            heightvar="100%"
            widthvar="100%"
          >
            <IDCard electorate={electorate} />
          </Modal.Window>
        </Modal>
      </div> */}
    </Table.Row>
  );
}

export default ElectoratesRow;
