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
import { formatToSixDigits } from "../../../utils/helpers";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import JSZip from "jszip";

function ElectoratesTable() {
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);
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

  // const exportExcel = (rows, downloadFolder) => {
  //   // Transform rows to modify paths
  //   const transformedData = rows.map((row) => ({
  //     id: formatToSixDigits(row.id),
  //     precinctno: row.precinctno,
  //     firstname: row.firstname,
  //     middlename: row.middlename,
  //     lastname: row.lastname,
  //     gender: row.gender,
  //     purok: row.purok,
  //     brgy: row.brgy,
  //     birthdate: row.birthdate,
  //     image: `${downloadFolder}\\${row.id}_avatar.png`, // Updated path
  //     signature: `${downloadFolder}\\${row.id}_signature.png`, // Updated path
  //     qr_code_url: `${downloadFolder}\\${row.id}_qrcode.png`, // Updated path
  //     id_printed_status: row.id_printed_status,
  //   }));

  //   // Generate and download Excel
  //   const workbook = new ExcelJS.Workbook();
  //   const sheet = workbook.addWorksheet("Electorates List");
  //   sheet.columns = [
  //     { header: "ID", key: "id", width: 10 },
  //     { header: "Precinct No", key: "precinctno", width: 15 },
  //     { header: "First Name", key: "firstname", width: 15 },
  //     { header: "Middle Name", key: "middlename", width: 15 },
  //     { header: "Last Name", key: "lastname", width: 15 },
  //     { header: "Gender", key: "gender", width: 10 },
  //     { header: "Purok", key: "purok", width: 20 },
  //     { header: "Barangay", key: "brgy", width: 20 },
  //     { header: "Birthdate", key: "birthdate", width: 15 },
  //     { header: "Image Path", key: "image", width: 50 },
  //     { header: "Signature Path", key: "signature", width: 50 },
  //     { header: "QR Code Path", key: "qr_code_url", width: 50 },
  //     { header: "ID Printed Status", key: "id_printed_status", width: 20 },
  //   ];

  //   transformedData.forEach((row) => sheet.addRow(row));

  //   workbook.xlsx.writeBuffer().then((buffer) => {
  //     const blob = new Blob([buffer], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     });
  //     saveAs(blob, "ElectoratesList.xlsx");
  //   });

  //   // Download images
  //   downloadImages(rows, downloadFolder);
  // };

  // const downloadImages = async (rows, downloadFolder) => {
  //   const downloadFile = async (url, fileName) => {
  //     try {
  //       const response = await fetch(url);
  //       const blob = await response.blob();
  //       saveAs(blob, `${fileName}`); // Saves with the desired filename
  //     } catch (error) {
  //       console.error(`Failed to download ${fileName}:`, error);
  //     }
  //   };

  //   for (const row of rows) {
  //     await downloadFile(row.image, `${row.id}_avatar.png`);
  //     await downloadFile(row.signature, `${row.id}_signature.png`);
  //     await downloadFile(row.qr_code_url, `${row.id}_qrcode.png`);
  //   }
  // };

  // const formatToSixDigits = (id) => id.toString().padStart(6, "0");

  const exportExcel = async (rows, downloadFolder) => {
    // Transform rows to modify paths
    const transformedData = rows.map((row) => ({
      id: formatToSixDigits(row.id),
      precinctno: row.precinctno,
      firstname: row.firstname,
      middlename: row.middlename,
      lastname: row.lastname,
      gender: row.gender,
      purok: row.purok,
      brgy: row.brgy,
      birthdate: row.birthdate,
      image: `${downloadFolder}\\${row.id}_avatar.png`, // Updated path
      signature: `${downloadFolder}\\${row.id}_signature.png`, // Updated path
      qr_code_url: `${downloadFolder}\\${row.id}_qrcode.png`, // Updated path
      id_printed_status: row.id_printed_status,
    }));

    // Generate and download Excel
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
      { header: "Image Path", key: "image", width: 50 },
      { header: "Signature Path", key: "signature", width: 50 },
      { header: "QR Code Path", key: "qr_code_url", width: 50 },
      { header: "ID Printed Status", key: "id_printed_status", width: 20 },
    ];

    transformedData.forEach((row) => sheet.addRow(row));

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "ElectoratesList.xlsx");
    });

    // Step 2: Download and ZIP images
    setIsLoadingDownload(true); // Show loading icon
    console.log("it is downloading zipp");
    try {
      await downloadImagesAsZip(rows);
    } catch (error) {
      console.error("Error while zipping images:", error);
    } finally {
      setIsLoadingDownload(false); // Hide loading icon
    }
  };

  const downloadImagesAsZip = async (rows) => {
    console.log("image zip downloading...");
    const zip = new JSZip();

    const addFileToZip = async (url, fileName) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        zip.file(fileName, blob); // Add file to the ZIP
      } catch (error) {
        console.error(`Failed to fetch ${fileName} from ${url}:`, error);
      }
    };

    for (const row of rows) {
      await addFileToZip(row.image, `${row.id}_avatar.png`);
      await addFileToZip(row.signature, `${row.id}_signature.png`);
      await addFileToZip(row.qr_code_url, `${row.id}_qrcode.png`);
    }

    // Generate and save the ZIP file
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "DownloadedImages.zip");
    });
  };

  const formatToSixDigits = (id) => id.toString().padStart(6, "0");

  return (
    <>
      {isLoadingDownload ? (
        <Spinner />
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
              {/* <div>Address</div> */}
              <div>Brgy</div>
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
