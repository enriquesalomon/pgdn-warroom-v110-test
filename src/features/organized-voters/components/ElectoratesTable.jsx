import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import Button from "../../../ui/Button";
import { useElectoratesAto } from "../hooks/useElectoratesAto";

import ElectoratesRow from "./ElectoratesRow";
import Search from "../../../ui/Search";
import { useState } from "react";
import Pagination from "../../../ui/Pagination";
import { useDebounce } from "use-debounce";
import { SiMicrosoftexcel } from "react-icons/si";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { barangayOptions } from "../../../utils/constants";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../utils/recordUserActivity";
import { formatToSixDigits, replaceSpecialChars } from "../../../utils/helpers";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import styled, { keyframes } from "styled-components";

// Keyframe animation for dots
const dotBlink = keyframes`
  0% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

// Styled components for the loading text
const LoadingText = styled.div`
  /* font-size: 22px; */
  color: #333;
  display: flex;
  align-items: center;
`;

const Dots = styled.div`
  display: inline-block;
  margin-left: 5px;

  & span {
    animation: ${dotBlink} 1.4s infinite;
    font-size: 16px;
  }

  & span:nth-child(1) {
    animation-delay: 0s;
  }

  & span:nth-child(2) {
    animation-delay: 0.2s;
  }

  & span:nth-child(3) {
    animation-delay: 0.4s;
  }
`;
function ElectoratesTable() {
  const [progress, setProgress] = useState(0); // Progress value
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // To track process state
  const [exceldataElectorates, setExceldataElectorates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { isPending, electorates, count } =
    useElectoratesAto(debouncedSearchTerm);
  const [downloadPath, setDownloadPath] = useState("");
  const [showModal, setShowModal] = useState(false); // Modal state to show the input form
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const allow_export = userData.user_metadata.account_role === "Super Admin";

  let sortedElectorates = electorates;
  console.log("electorates asenso_color_code_url", JSON.stringify(electorates));

  useEffect(() => {
    setExceldataElectorates(sortedElectorates);
  }, [sortedElectorates]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleExport = () => {
    if (!downloadPath) {
      alert("Please provide a download folder path.");
      return;
    }
    exportExcel(exceldataElectorates, downloadPath);
    setShowModal(false); // Close the modal after export
  };
  const exportExcel = async (rows, downloadFolder) => {
    // Step 1: Export Excel file
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Electorates List");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Precinct No", key: "precinctno", width: 15 },
      { header: "First Name", key: "firstname", width: 15 },
      { header: "Middle Name", key: "middlename", width: 15 },
      { header: "Last Name", key: "lastname", width: 15 },
      { header: "Gender", key: "gender", width: 10 },
      { header: "Purok", key: "purok", width: 20 },
      { header: "Barangay", key: "brgy", width: 20 },
      { header: "Birthdate", key: "birthdate", width: 15 },
      { header: "Qr Code", key: "qr_code", width: 15 },
      { header: "Image Path", key: "image", width: 50 },
      { header: "Signature Path", key: "signature", width: 50 },
      { header: "QR Code Path", key: "qr_code_url", width: 50 },
      { header: "Asenso Color Code", key: "asenso_color_code_url", width: 50 },
      { header: "ID Printed Status", key: "id_printed_status", width: 20 },
    ];

    rows.forEach((row) => {
      const formattedId = formatToSixDigits(row.id); // Format the ID
      const fname = replaceSpecialChars(row.firstname);
      const mname = replaceSpecialChars(row.middlename);
      const lname = replaceSpecialChars(row.lastname);
      sheet.addRow({
        ...row,
        id: formattedId, // Use the formatted ID
        firstname: fname,
        middlename: mname,
        lastname: lname,
        image: `${downloadFolder}\\ElectoratesImages\\${row.id}_avatar.png`, // Updated path
        signature: `${downloadFolder}\\ElectoratesImages\\${row.id}_signature.png`, // Updated path
        qr_code_url: `${downloadFolder}\\ElectoratesImages\\${row.id}_qrcode.png`, // Updated path
        asenso_color_code_url: `${downloadFolder}\\ElectoratesImages\\${row.id}_asensocolor.png`, // Updated path
      });
    });

    const excelBuffer = await workbook.xlsx.writeBuffer();
    const excelBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(excelBlob, "ElectoratesList.xlsx");

    // Step 2: Download and ZIP images
    setIsDownloading(true);
    setProgress(0);
    try {
      await downloadAndZipImages(rows);
    } catch (error) {
      console.error("Error while zipping images:", error);
    } finally {
      setIsDownloading(false);
      setProgress(100); // Ensure progress bar reaches 100%
    }
  };

  const downloadAndZipImages = async (rows) => {
    const zip = new JSZip();
    const totalFiles = rows.length * 3; // 3 files per row (image, signature, QR code)
    let completedFiles = 0;

    for (const row of rows) {
      const { id, image, signature, qr_code_url, asenso_color_code_url } = row;

      const imageBlob = await fetchBlob(image);
      zip.file(`${id}_avatar.png`, imageBlob);
      completedFiles++;
      updateProgress(completedFiles, totalFiles);

      const signatureBlob = await fetchBlob(signature);
      zip.file(`${id}_signature.png`, signatureBlob);
      completedFiles++;
      updateProgress(completedFiles, totalFiles);

      const qrCodeBlob = await fetchBlob(qr_code_url);
      zip.file(`${id}_qrcode.png`, qrCodeBlob);
      completedFiles++;
      updateProgress(completedFiles, totalFiles);

      const colorCodeBlob = await fetchBlob(asenso_color_code_url);
      zip.file(`${id}_asensocolor.png`, colorCodeBlob);
      completedFiles++;
      updateProgress(completedFiles, totalFiles);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "ElectoratesImages.zip");
  };

  const fetchBlob = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download ${url}`);
    }
    return await response.blob();
  };

  const updateProgress = (completedFiles, totalFiles) => {
    const progressValue = Math.floor((completedFiles / totalFiles) * 100);
    setProgress(progressValue);
  };

  const formatToSixDigits = (id) => id.toString().padStart(6, "0");

  return (
    <>
      {isDownloading ? (
        // <Spinner />

        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-center">
              <LoadingText>
                Downloading Images
                <Dots>
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </Dots>
              </LoadingText>
            </h2>

            <div className="flex justify-center">
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: `${progress}%` }}
                ></div>
                <span className="progress-text">{progress}%</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Menus>
          <div className="flex-row">
            <div className="w-full">
              <Search
                terms={"Search Name"}
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {allow_export && (
                <>
                  <Button
                    disabled={exceldataElectorates.length === 0}
                    onClick={() => setShowModal(true)}
                  >
                    <div className="flex justify-center items-center">
                      <SiMicrosoftexcel className="mr-2" />
                      EXPORT
                    </div>
                  </Button>
                  {showModal && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg shadow-xl w-1/2">
                        <h2 className="text-2xl font-bold mb-4 text-center">
                          Set Download Path
                        </h2>
                        <h3 className="text-xl font-bold mb-4 text-center">
                          Example: C:\Users\Username\Downloads
                        </h3>

                        <div className="flex justify-center">
                          <input
                            className="w-4/5 border border-gray-300 p-2"
                            type="text"
                            placeholder="Enter folder path example C:\Users\Username\Downloads"
                            value={downloadPath}
                            onChange={(e) => setDownloadPath(e.target.value)}
                          />
                        </div>
                        <p className="text-center mt-4 text-gray-600">
                          {/* {qrCodeData} */}
                        </p>
                        <div className="flex justify-center space-x-4 mt-6">
                          <button
                            onClick={() => setShowModal(false)}
                            // className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                            // disabled={loading}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleExport}
                            // className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600"
                            className="bg-green-500 text-white px-4 py-2 rounded"
                            // disabled={loading}
                          >
                            Save Path and Export
                            {/* {loading ? "Uploading..." : "Save"} */}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <Table columns="1fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1.8fr 1fr">
            <Table.Header>
              <div>#</div>
              <div>Precinct No.</div>
              <div>Lastname</div>
              <div>Firstname</div>
              <div>Middlename</div>
              <div>Address</div>
              <div>ID Print Status</div>
              <div>Pending Items</div>
              <div></div>
            </Table.Header>
            {isPending ? (
              <Spinner />
            ) : (
              <>
                <Table.Body
                  data={sortedElectorates}
                  render={(electorate, index) => (
                    <ElectoratesRow
                      debouncedSearchTerm={debouncedSearchTerm}
                      electorate={electorate}
                      key={electorate.id}
                      index={index}
                    />
                  )}
                />
                <Table.Footer>
                  <Pagination count={count} />
                </Table.Footer>
              </>
            )}
          </Table>
        </Menus>
      )}
    </>
  );
}

export default ElectoratesTable;
