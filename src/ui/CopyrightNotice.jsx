import { appVersion } from "../utils/constants";

function CopyrightNotice() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="text-center py-4 ">
      <p className="text-sm text-gray-500 font-base">
        Copyright PGDN Warroom V {appVersion} © {currentYear}
      </p>
    </div>
  );
}
export default CopyrightNotice;
