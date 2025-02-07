CREATE OR REPLACE FUNCTION get_electorate_survey_counts_per_brgy() 
RETURNS TABLE (
  brgy VARCHAR,
  count_ato BIGINT,
  count_dili BIGINT,
  count_ot BIGINT,
  count_inc BIGINT,
  count_jhv BIGINT,
  count_deceased BIGINT,
  count_undecided BIGINT,
  count_nvs BIGINT,
  count_lubas BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        electorates.brgy, 
        COUNT(CASE WHEN 
            (survey_tag = 'ATO')
        THEN 1 END) AS count_ato,        
        COUNT(CASE WHEN 
            (survey_tag = 'DILI')
        THEN 1 END) AS count_dili,
        COUNT(CASE WHEN 
            (survey_tag = 'OUT OF TOWN') 
        THEN 1 END) AS count_ot,
        COUNT(CASE WHEN 
            (survey_tag = 'INC')
        THEN 1 END) AS count_inc,
        COUNT(CASE WHEN 
            (survey_tag = 'JEHOVAH')
        THEN 1 END) AS count_jhv,
        COUNT(CASE WHEN 
            (survey_tag = 'DECEASED')
        THEN 1 END) AS count_deceased,
        COUNT(CASE WHEN 
            (survey_tag = 'UNDECIDED')
        THEN 1 END) AS count_undecided,
        COUNT(CASE WHEN 
            (survey_tag = 'NVS')
        THEN 1 END) AS count_nvs,
        COUNT(CASE WHEN(islubas_type <> 'N/A')
        THEN 1 END) AS count_lubas
    FROM 
        electorates
    GROUP BY 
        electorates.brgy
    ORDER BY 
        electorates.brgy;
END;
$$ LANGUAGE plpgsql;

