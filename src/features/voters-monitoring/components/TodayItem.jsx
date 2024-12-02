import styled from "styled-components";
import Tag from "../../../ui/Tag";
import { FaRegKeyboard } from "react-icons/fa6";
import { MdOutlineQrCodeScanner } from "react-icons/md";
const StyledTodayItem = styled.li`
  display: grid;
  grid-template-columns: 2rem 16rem 10rem;
  gap: 1.2rem;
  align-items: center;

  font-size: 1rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:first-child {
    border-top: 1px solid var(--color-grey-100);
  }
`;

const Guest = styled.div`
  font-weight: 250;
`;

function TodayItem(electorates) {
  console.log("asdasdasd electorates", JSON.stringify(electorates));
  return (
    <StyledTodayItem>
      {electorates.activity.scanned_type === "APP" ? (
        <MdOutlineQrCodeScanner className="text-green-600 text-3xl" />
      ) : (
        <FaRegKeyboard className="text-blue-600 text-3xl" />
      )}
      <Guest>
        {electorates.activity.electorates.precinctno +
          " " +
          electorates.activity.electorates.firstname +
          " " +
          electorates.activity.electorates.middlename +
          " " +
          electorates.activity.electorates.lastname}
      </Guest>

      <Tag type="green">{electorates.activity.electorates.brgy}</Tag>
    </StyledTodayItem>
  );
}

export default TodayItem;
