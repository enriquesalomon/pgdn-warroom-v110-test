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
function ElectoratesTable() {
  const [exceldataElectorates, setExceldataElectorates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const { isPending, electorates, count } =
    useElectoratesAto(debouncedSearchTerm);

  console.log("voters ato---", JSON.stringify(electorates));
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);
  const allow_export = userData.user_metadata.account_role === "Super Admin";

  let sortedElectorates = electorates;

  useEffect(() => {
    // const data = sortedElectorates?.map((entry) => {
    //   const { precinctno, lastname, firstname, middlename, purok, brgy } =
    //     entry.electorates;
    //   return { precinctno, lastname, firstname, middlename, purok, brgy };
    // });
    setExceldataElectorates(sortedElectorates);
  }, [sortedElectorates]);

  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const printed_status = searchParams.get("printed_status") || "";
  const id_requirments = searchParams.get("id_requirments") || "";

  // // //THIS IS WOKING CODE, EXPORTING DATA INTO EXCEL
  // const csvConfig = mkConfig({
  //   // showTitle: true,
  //   // title: `ELECTORATES LIST`,
  //   fieldSeparator: ",",
  //   filename: `ELECTORATES LIST`,
  //   decimalSeparator: ".",
  //   useKeysAsHeaders: true,
  // });
  // const exportExcel = (rows) => {
  //   // Transform rows to extract only necessary fields and format the ID
  //   const transformedData = rows.map((row) => ({
  //     id: formatToSixDigits(row.id), // Convert ID to 6-digit format
  //     precinctno: row.precinctno,
  //     firstname: row.firstname,
  //     middlename: row.middlename,
  //     lastname: row.lastname,
  //     gender: row.gender,
  //     purok: row.purok,
  //     brgy: row.brgy,
  //     birthdate: row.birthdate,
  //     image: row.image,
  //     signature: row.signature,
  //     qr_code_url: row.qr_code_url,
  //     id_printed_status: row.id_printed_status,
  //   }));
  //   console.log("Transformed Data: ", JSON.stringify(transformedData));
  //   // Code to generate and download CSV (commented out for now)
  //   const csv = generateCsv(csvConfig)(transformedData);
  //   download(csvConfig)(csv);
  // };
  // //THIS IS WOKING CODE, EXPORTING DATA INTO EXCEL

  // if (isPending) return <Spinner />;

  // //THIS IS WOKING CODE, EXPORTING IMAGES INTO EXCEL
  // const exportExcel = async (rows) => {
  //   console.log("this is the data:", JSON.stringify(rows));

  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet("Electorates");

  //   // Define headers
  //   worksheet.columns = [
  //     { header: "ID", key: "id", width: 10 },
  //     { header: "Precinct No.", key: "precinctno", width: 15 },
  //     { header: "First Name", key: "firstname", width: 20 },
  //     { header: "Middle Name", key: "middlename", width: 20 },
  //     { header: "Last Name", key: "lastname", width: 20 },
  //     { header: "Gender", key: "gender", width: 10 },
  //     { header: "Purok", key: "purok", width: 20 },
  //     { header: "Barangay", key: "brgy", width: 20 },
  //     { header: "Birthdate", key: "birthdate", width: 15 },
  //     { header: "ID Printed Status", key: "id_printed_status", width: 20 },
  //     { header: "Image", key: "image", width: 20 },
  //     { header: "QR Code", key: "qr_code", width: 20 },
  //     { header: "Signature", key: "signature", width: 20 },
  //   ];
  //   // Map row data explicitly to worksheet rows
  //   const rowIndexMap = {};

  //   rows.forEach((row, i) => {
  //     const rowIndex = i + 2; // Adjust for header
  //     rowIndexMap[row.id] = rowIndex; // Map ID to row index

  //     worksheet.addRow({
  //       id: formatToSixDigits(row.id),
  //       precinctno: row.precinctno,
  //       firstname: row.firstname,
  //       middlename: row.middlename,
  //       lastname: row.lastname,
  //       gender: row.gender || "",
  //       purok: row.purok,
  //       brgy: row.brgy,
  //       birthdate: row.birthdate || "",
  //       id_printed_status: row.id_printed_status ? "Yes" : "No",
  //     });

  //     console.log(`Mapped ID: ${row.id} to Row Index: ${rowIndex}`);
  //   });

  //   // Add images using the rowIndexMap
  //   for (let i = 0; i < rows.length; i++) {
  //     const { id, image, signature, qr_code_url } = rows[i];
  //     const rowIndex = rowIndexMap[id];

  //     if (image) {
  //       const imageBuffer = await fetchImageAsBuffer(image);
  //       if (imageBuffer) {
  //         const imageId = workbook.addImage({
  //           buffer: imageBuffer,
  //           extension: "png",
  //         });
  //         worksheet.addImage(imageId, {
  //           tl: { col: 10, row: rowIndex - 1 },
  //           ext: { width: 80, height: 80 },
  //         });
  //       }
  //     }

  //     if (qr_code_url) {
  //       const qrCodeBuffer = await fetchImageAsBuffer(qr_code_url);
  //       if (qrCodeBuffer) {
  //         const qrCodeId = workbook.addImage({
  //           buffer: qrCodeBuffer,
  //           extension: "png",
  //         });
  //         worksheet.addImage(qrCodeId, {
  //           tl: { col: 11, row: rowIndex - 1 },
  //           ext: { width: 80, height: 80 },
  //         });
  //       }
  //     }

  //     if (signature) {
  //       const signatureBuffer = await fetchImageAsBuffer(signature);
  //       if (signatureBuffer) {
  //         const signatureId = workbook.addImage({
  //           buffer: signatureBuffer,
  //           extension: "png",
  //         });
  //         worksheet.addImage(signatureId, {
  //           tl: { col: 12, row: rowIndex - 1 },
  //           ext: { width: 80, height: 80 },
  //         });
  //       }
  //     }
  //     worksheet.getRow(rowIndex).height = 80; // Adjust as needed
  //     worksheet.getRow(rowIndex).width = 80; // Adjust as needed
  //   }
  //   // Generate and download the Excel file
  //   const buffer = await workbook.xlsx.writeBuffer();
  //   const blob = new Blob([buffer], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });
  //   saveAs(blob, `ElectoratesData_${brgy.toUpperCase()}_Page${page}.xlsx`);
  // };
  // //THIS IS WOKING CODE, EXPORTING IMAGES INTO EXCEL
  // // Helper function to fetch image as buffer
  // const fetchImageAsBuffer = async (url) => {
  //   try {
  //     const response = await fetch(url);
  //     const blob = await response.blob();
  //     return await blob.arrayBuffer();
  //   } catch (error) {
  //     console.error("Error fetching image: ", error);
  //     return null;
  //   }
  // };

  //working 1
  // const exportExcel = (rows) => {
  //   // Transform rows and modify URLs
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
  //     image: `C:\\Downloads\\${row.id}_avatar.png`, // Local path
  //     signature: `C:\\Downloads\\${row.id}_signature.png`, // Local path
  //     qr_code_url: `C:\\Downloads\\${row.id}_qrcode.png`, // Local path
  //     id_printed_status: row.id_printed_status,
  //   }));

  //   console.log("Transformed Data: ", JSON.stringify(transformedData));

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
  //     { header: "Image Path", key: "image", width: 40 },
  //     { header: "Signature Path", key: "signature", width: 40 },
  //     { header: "QR Code Path", key: "qr_code_url", width: 40 },
  //     { header: "ID Printed Status", key: "id_printed_status", width: 20 },
  //   ];

  //   transformedData.forEach((row) => sheet.addRow(row));

  //   workbook.xlsx.writeBuffer().then((buffer) => {
  //     const blob = new Blob([buffer], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     });
  //     saveAs(blob, "ElectoratesList.xlsx");
  //   });

  //   // Download images after exporting Excel
  //   downloadImages(rows);
  // };

  // const downloadImages = async (rows) => {
  //   const downloadFile = async (url, fileName) => {
  //     try {
  //       const response = await fetch(url);
  //       const blob = await response.blob();
  //       saveAs(blob, fileName); // Saves to the default Downloads folder
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

  const exportExcel = (rows) => {
    const downloadFolder = "C:\\Users\\DENR\\Downloads\\";

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
      image: `${downloadFolder}${row.id}_avatar.png`, // Updated path
      signature: `${downloadFolder}${row.id}_signature.png`, // Updated path
      qr_code_url: `${downloadFolder}${row.id}_qrcode.png`, // Updated path
      id_printed_status: row.id_printed_status,
    }));

    console.log("Transformed Data: ", JSON.stringify(transformedData));

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

    // Download images
    downloadImages(rows, downloadFolder);
  };

  const downloadImages = async (rows, downloadFolder) => {
    const downloadFile = async (url, fileName) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        saveAs(blob, `${fileName}`); // Saves with the desired filename
      } catch (error) {
        console.error(`Failed to download ${fileName}:`, error);
      }
    };

    for (const row of rows) {
      await downloadFile(row.image, `${row.id}_avatar.png`);
      await downloadFile(row.signature, `${row.id}_signature.png`);
      await downloadFile(row.qr_code_url, `${row.id}_qrcode.png`);
    }
  };

  return (
    <Menus>
      <div className="flex-row">
        <div className="w-full ">
          <Search
            terms={"Search Name"}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {allow_export && (
            // <Button
            //   disabled={exceldataElectorates.length === 0}
            //   onClick={() => exportExcel(exceldataElectorates)}
            // >
            //   <div className="flex justify-center items-center">
            //     <SiMicrosoftexcel className="mr-2" />
            //     EXPORT
            //   </div>
            // </Button>
            <Button
              disabled={exceldataElectorates.length === 0}
              onClick={() => exportExcel(exceldataElectorates)}
            >
              <div className="flex justify-center items-center">
                <SiMicrosoftexcel className="mr-2" />
                EXPORT
              </div>
            </Button>
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

                  // onSelectElectorate={(onSelectElectorate, close)}
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
  );
}

export default ElectoratesTable;
