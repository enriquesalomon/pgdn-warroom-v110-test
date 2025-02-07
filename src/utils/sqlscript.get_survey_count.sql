CREATE OR REPLACE FUNCTION get_survey_count()
RETURNS TABLE(barangay character varying, survey_ato bigint, survey_dili bigint, survey_undecided bigint, survey_deceased bigint, survey_ot bigint, survey_inc bigint, survey_jv bigint, survey_nvs bigint) AS $$
BEGIN
    RETURN QUERY
    SELECT electorates.brgy as barangay,
           COUNT(CASE WHEN electorates.survey_tag = 'ATO' THEN 1 END) AS survey_ato,
           COUNT(CASE WHEN electorates.survey_tag = 'DILI' THEN 1 END) AS surveyt_dili,
           COUNT(CASE WHEN electorates.survey_tag = 'UNDECIDED' THEN 1 END) AS survey_undecided,
           COUNT(CASE WHEN electorates.survey_tag = 'DECEASED' THEN 1 END) AS survey_deceased,
           COUNT(CASE WHEN electorates.survey_tag = 'OUT OF TOWN' THEN 1 END) AS survey_ot,
           COUNT(CASE WHEN electorates.survey_tag = 'INC' THEN 1 END) AS survey_inc,
           COUNT(CASE WHEN electorates.survey_tag = 'JEHOVAH' THEN 1 END) AS survey_jv,
           COUNT(CASE WHEN electorates.survey_tag = 'NVS' THEN 1 END) AS survey_nvs
    FROM electorates
    WHERE electorates.survey_tag IN ('ATO', 'DILI', 'UNDECIDED', 'DECEASED', 'OUT OF TOWN', 'INC', 'JEHOVAH', 'NVS')
    GROUP BY electorates.brgy; 
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;