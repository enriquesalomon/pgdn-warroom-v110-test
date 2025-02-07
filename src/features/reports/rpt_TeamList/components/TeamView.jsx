import React from "react";
import { useGetMembers } from "../hooks/useElectorates";
import { replaceSpecialChars } from "../../../../utils/helpers";
import styled from "styled-components";
const StyledHeader = styled.thead`
  /* padding: 1.6rem 2.4rem; */

  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  /* text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600; */
  color: var(--color-grey-600);
`;

const TeamView = React.forwardRef((props, ref) => {
  const {
    id,
    precinctno,
    lastname,
    firstname,
    members,
    members_name,
    purok,
    barangay,
    team,
    gm_id,
    agm_id,
    legend_id,
    elite_id,
    baco_id,
    gm_name,
    agm_name,
    legend_name,
    elite_name,
    baco_name,
    electorate_id,
  } = props.electorate;

  console.log("-=-02=-304234", JSON.stringify(props.l_precinctNo));
  console.log("-=-02=-304234", JSON.stringify(props.e_precinctNo));
  console.log("-=-02=-304234", JSON.stringify(props.t_precinctNo));
  const { data: team_members, isLoading } = useGetMembers(id);

  console.log("xxxx---team_members1", JSON.stringify(team_members));
  console.log("xxxx---team_member2", JSON.stringify(props.electorate));
  // Filter the data to find the object with id 89563
  const warriors_only = team_members?.filter(
    (item) => item.id !== electorate_id
  );
  console.log("xxxx---warriors_only", JSON.stringify(warriors_only));
  return (
    <div className="p-12" ref={ref}>
      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <div className="w-40 text-2xl">Barangay:</div>
            <div className="w-3/4 text-2xl font-semibold">{barangay}</div>
          </div>
          <hr className="py-2" />
          <div className="flex items-center mb-2">
            <div className="w-40 text-2xl">BACO:</div>
            <div className="w-3/4 text-2xl font-semibold">
              {replaceSpecialChars(baco_name)}
            </div>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-40 text-2xl">GM:</div>
            <div className="w-3/4 text-2xl font-semibold">
              {replaceSpecialChars(gm_name)}
            </div>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-40 text-2xl">AGM:</div>
            <div className="w-3/4 text-2xl font-semibold">
              {replaceSpecialChars(agm_name)}
            </div>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-40 text-2xl">LEGEND:</div>
            <div className="w-3/4 text-2xl font-semibold">
              {replaceSpecialChars(legend_name)}
              <span className="ml-6 font-thin">{props.l_precinctNo}</span>
            </div>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-40 text-2xl">ELITE:</div>
            <div className="w-3/4 text-2xl font-semibold">
              {replaceSpecialChars(elite_name)}
              <span className="ml-6 font-thin">{props.e_precinctNo}</span>
            </div>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-40 text-2xl">TOWER:</div>
            <div className="w-3/4 text-2xl font-semibold">
              {replaceSpecialChars(firstname) +
                " " +
                replaceSpecialChars(lastname)}
              <span className="ml-6 font-thin">{props.t_precinctNo}</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto text-2xl">
          <table className="min-w-full border-collapse border border-gray-200">
            <StyledHeader>
              <tr>
                <th className="px-4 py-2 border border-gray-200 text-left">
                  #
                </th>
                <th className="px-4 py-2 border border-gray-200 text-left">
                  Full Name
                </th>
                <th className="px-4 py-2 border border-gray-200 text-left">
                  Purok
                </th>
                <th className="px-4 py-2 border border-gray-200 text-left">
                  Precinct #
                </th>
              </tr>
            </StyledHeader>

            <tbody>
              {warriors_only?.map((item, index) => (
                <tr key={item.id}>
                  <td className="pl-2 pr-0  py-2 border border-gray-200">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    {replaceSpecialChars(item.lastname) +
                      ", " +
                      replaceSpecialChars(item.firstname) +
                      " " +
                      replaceSpecialChars(item.middlename)}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    {item.purok}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    {item.precinctno}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot className="bg-gray-100">
              {/* <tr>
                <td
                  colSpan="2"
                  className="px-4 py-2 border border-gray-200 text-right font-semibold"
                >
                  Total
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {totalItems}
                </td>
              </tr> */}
            </tfoot>
          </table>
          {isLoading && <div>Fetching...</div>}
        </div>
      </div>
    </div>
  );
});

export default TeamView;
