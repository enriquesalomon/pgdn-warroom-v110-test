import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import { useSector } from "../hooks/useSector";
import SectorRow from "./SectorRow";
import Pagination from "../../../ui/Pagination";
import AddSector from "./AddSector";

function SectorTable() {
  const { isPending, sector, count } = useSector();

  return (
    <Menus>
      <div className="flex-row">
        <div className="w-full ">
          <AddSector />
        </div>
      </div>

      <Table columns="1fr 1fr 1fr">
        <Table.Header>
          <div>Sector Type</div>
          <div>Created At</div>
          <div></div>
        </Table.Header>
        {isPending ? (
          <Spinner />
        ) : (
          <>
            <Table.Body
              data={sector}
              render={(sector, index) => (
                <SectorRow sector={sector} key={sector.id} index={index} />
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

export default SectorTable;
