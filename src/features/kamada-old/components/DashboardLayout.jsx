import KamadaTable from "./KamadaTable";

function DashboardLayout() {
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-4 ...">
          <KamadaTable />
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;
