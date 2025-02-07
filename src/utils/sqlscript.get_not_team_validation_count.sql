CREATE OR REPLACE FUNCTION get_not_team_validation_count(validationtype_param TEXT)
RETURNS TABLE(barangay character varying, ntresult_dili bigint, ntresult_undecided bigint, ntresult_deceased bigint, ntresult_inc bigint, ntresult_jv bigint, ntresult_nvs bigint) AS $$
BEGIN
    IF validationtype_param = '1v' THEN
        RETURN QUERY
        SELECT electorates.brgy AS barangay,
               COUNT(CASE WHEN electorates.firstvalidation_tag = 'DILI' AND electorates.precinctleader IS NULL THEN 1 END) AS ntresult_dili,
               COUNT(CASE WHEN electorates.firstvalidation_tag = 'UNDECIDED' AND electorates.precinctleader IS NULL THEN 1 END) AS ntresult_undecided,
               COUNT(CASE WHEN electorates.firstvalidation_tag = 'DECEASED' AND electorates.precinctleader IS NULL THEN 1 END) AS ntresult_deceased,
               COUNT(CASE WHEN electorates.firstvalidation_tag = 'INC' AND electorates.precinctleader IS NULL THEN 1 END) AS ntresult_inc,
               COUNT(CASE WHEN electorates.firstvalidation_tag = 'JEHOVAH' AND electorates.precinctleader IS NULL THEN 1 END) AS ntresult_jv,
               COUNT(CASE WHEN electorates.firstvalidation_tag = 'NVS' AND electorates.precinctleader IS NULL THEN 1 END) AS ntresult_nvs
        FROM electorates
        WHERE electorates.firstvalidation_tag IN ('DILI', 'UNDECIDED', 'DECEASED', 'INC', 'JEHOVAH', 'NVS')
        GROUP BY electorates.brgy;

    ELSIF validationtype_param = '2v' THEN
        RETURN QUERY
        SELECT electorates.brgy AS barangay,
               COUNT(CASE WHEN electorates.secondvalidation_tag = 'DILI' AND electorates.precinctleader IS NULL THEN 1 END) AS ntresult_dili,
               COUNT(CASE WHEN electorates.secondvalidation_tag = 'UNDECIDED' AND electorates.precinctleader IS NULL THEN 1 END) AS ntresult_undecided,
               COUNT(CASE WHEN electorates.secondvalidation_tag = 'DECEASED' AND electorates.precinctleader IS NULL THEN 1 END) AS ntresult_deceased,
               COUNT(CASE WHEN electorates.secondvalidation_tag = 'INC' AND electorates.precinctleader IS NULL THEN 1 END) AS ntresult_inc,
               COUNT(CASE WHEN electorates.secondvalidation_tag = 'JEHOVAH' AND electorates.precinctleader IS NULL THEN 1 END) AS ntresult_jv,
               COUNT(CASE WHEN electorates.secondvalidation_tag = 'NVS' AND electorates.precinctleader IS NULL THEN 1 END) AS ntresult_nvs
        FROM electorates
        WHERE electorates.secondvalidation_tag IN ('DILI', 'UNDECIDED', 'DECEASED', 'INC', 'JEHOVAH', 'NVS')
        GROUP BY electorates.brgy;

    ELSIF validationtype_param = '3v' THEN
        RETURN QUERY
        SELECT electorates.brgy AS barangay,
               COUNT(CASE WHEN electorates.thirdvalidation_tag = 'DILI' AND electorates.precinctleader IS NULL THEN 1 END) AS ntresult_dili,
               COUNT(CASE WHEN electorates.thirdvalidation_tag = 'UNDECIDED' AND electorates.precinctleader IS NULL THEN 1 END) AS ntresult_undecided,
               COUNT(CASE WHEN electorates.thirdvalidation_tag = 'DECEASED' AND electorates.precinctleader IS NULL THEN 1 END) AS ntresult_deceased,
               COUNT(CASE WHEN electorates.thirdvalidation_tag = 'INC' AND electorates.precinctleader IS NULL THEN 1 END) AS ntresult_inc,
               COUNT(CASE WHEN electorates.thirdvalidation_tag = 'JEHOVAH' AND electorates.precinctleader IS NULL THEN 1 END) AS ntresult_jv,
               COUNT(CASE WHEN electorates.thirdvalidation_tag = 'NVS' AND electorates.precinctleader IS NULL THEN 1 END) AS ntresult_nvs
        FROM electorates
        WHERE electorates.thirdvalidation_tag IN ('DILI', 'UNDECIDED', 'DECEASED', 'INC', 'JEHOVAH', 'NVS')
        GROUP BY electorates.brgy;

    ELSE
        RAISE EXCEPTION 'Invalid validation type: %', validationtype_param;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;
