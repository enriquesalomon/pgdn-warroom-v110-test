import { useSearchParams } from "react-router-dom";
import KamadaTable from "./KamadaTable";
import { validationMapping } from "../../../utils/constants";

function DashboardLayout() {
  const [searchParams] = useSearchParams();
  let validationType = searchParams.get("validation");
  validationType = validationMapping[validationType] || "Survey";
  validationType =
    validationType === "third_validation"
      ? "3rd Validation"
      : validationType === "second_validation"
      ? "2nd Validation"
      : validationType === "first_validation"
      ? "1st Validation"
      : "Survey";
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-4 ...">
          <KamadaTable validationType={validationType} />
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;
