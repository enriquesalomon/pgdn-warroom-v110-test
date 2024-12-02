import styled from "styled-components";
import Tag from "../../../ui/Tag";
import { GrScan } from "react-icons/gr";

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
  return (
    <StyledTodayItem>
      <GrScan />
      <Guest>
        {electorates.activity.electorates.firstname +
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
