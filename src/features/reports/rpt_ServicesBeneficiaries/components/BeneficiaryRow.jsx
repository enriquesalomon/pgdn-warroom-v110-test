import Table from "../../../../ui/Table";
import Modal from "../../../../ui/Modal";
import ButtonIcon from "../../../../ui/ButtonIcon";
import { GrOverview } from "react-icons/gr";
import { IoEye } from "react-icons/io5";
import BeneficiaryTable from "../../rpt_ServicesBeneficiaries/components/BeneficiaryTable";
import { LiaClipboardListSolid } from "react-icons/lia";
function BeneficiaryRow({ electorate, all_availed, index }) {
  const { electorate_id, fullname, barangay, contactno, electorates } =
    electorate;
  console.log("asdasdasd", JSON.stringify(electorate));
  let electorates_type;
  if (electorates) {
    if (electorates.isleader === true && electorates.precinctleader !== null) {
      electorates_type = "TOWER";
    } else if (
      electorates.isleader === null &&
      electorates.precinctleader !== null
    ) {
      electorates_type = "WARRIORS";
    } else if (electorates.isbaco === true) {
      electorates_type = "BACO";
    } else if (electorates.is_gm === true) {
      electorates_type = "GM";
    } else if (electorates.is_agm === true) {
      electorates_type = "AGM";
    } else if (electorates.is_legend === true) {
      electorates_type = "LEGEND";
    } else if (electorates.is_elite === true) {
      electorates_type = "ELITE";
    }
  }

  return (
    <Table.Row>
      {/* <div>{index + 1}</div> */}
      <div>{electorate_id}</div>
      <div>{fullname}</div>

      <div>{electorates_type}</div>
      <div>{barangay}</div>
      <div>
        <Modal>
          <Modal.Open opens="service-form">
            {/* <div className="text-orange-300 flex text-2xl justify-center items-center hover:bg-orange-300 hover:text-white  font-bold py-2 px-4 rounded ">
                <GrOverview className="mr-2  " />
              </div> */}
            <ButtonIcon>
              <div className="inline-flex items-center">
                <LiaClipboardListSolid className="mr-2  " /> See All Availed
              </div>
            </ButtonIcon>
          </Modal.Open>
          <Modal.Window
            backdrop={true}
            name="service-form"
            heightvar="100%"
            widthvar="100%"
          >
            <BeneficiaryTable
              electorate_id={electorate_id}
              all_services={all_availed}
              fullname={fullname}
            />
          </Modal.Window>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default BeneficiaryRow;
