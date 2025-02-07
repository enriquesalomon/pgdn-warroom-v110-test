CREATE OR REPLACE FUNCTION get_electorate_validation_counts_per_brgy (validation_id_param BIGINT) 
RETURNS TABLE (
  brgy varchar,
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
            (validation_id_param = 1 AND firstvalidation_tag = 'ATO') OR 
            (validation_id_param = 2 AND secondvalidation_tag = 'ATO') OR 
            (validation_id_param = 3 AND thirdvalidation_tag = 'ATO') 
        THEN 1 END) AS count_ato,
        COUNT(CASE WHEN 
            (validation_id_param = 1 AND firstvalidation_tag = 'OUT OF TOWN') OR 
            (validation_id_param = 2 AND secondvalidation_tag = 'OUT OF TOWN') OR 
            (validation_id_param = 3 AND thirdvalidation_tag = 'OUT OF TOWN') 
        THEN 1 END) AS count_ot,
        COUNT(CASE WHEN 
            (validation_id_param = 1 AND firstvalidation_tag = 'DILI') OR 
            (validation_id_param = 2 AND secondvalidation_tag = 'DILI') OR 
            (validation_id_param = 3 AND thirdvalidation_tag = 'DILI')  
        THEN 1 END) AS count_dili,
        COUNT(CASE WHEN 
            (validation_id_param = 1 AND firstvalidation_tag = 'INC') OR 
            (validation_id_param = 2 AND secondvalidation_tag = 'INC') OR 
            (validation_id_param = 3 AND thirdvalidation_tag = 'INC')  
        THEN 1 END) AS count_inc,
        COUNT(CASE WHEN 
            (validation_id_param = 1 AND firstvalidation_tag = 'JEHOVAH') OR 
            (validation_id_param = 2 AND secondvalidation_tag = 'JEHOVAH') OR 
            (validation_id_param = 3 AND thirdvalidation_tag = 'JEHOVAH')  
        THEN 1 END) AS count_jhv,
        COUNT(CASE WHEN 
            (validation_id_param = 1 AND firstvalidation_tag = 'UNDECIDED') OR 
            (validation_id_param = 2 AND secondvalidation_tag = 'UNDECIDED') OR 
            (validation_id_param = 3 AND thirdvalidation_tag = 'UNDECIDED')  
        THEN 1 END) AS count_undecided,
        COUNT(CASE WHEN 
            (validation_id_param = 1 AND firstvalidation_tag = 'DECEASED') OR 
            (validation_id_param = 2 AND secondvalidation_tag = 'DECEASED') OR 
            (validation_id_param = 3 AND thirdvalidation_tag = 'DECEASED')  
        THEN 1 END) AS count_deceased,
        COUNT(CASE WHEN 
            (validation_id_param = 1 AND firstvalidation_tag = 'NVS') OR 
            (validation_id_param = 2 AND secondvalidation_tag = 'NVS') OR 
            (validation_id_param = 3 AND thirdvalidation_tag = 'NVS')  
        THEN 1 END) AS count_nvs,
        COUNT(CASE WHEN 
            (validation_id_param = 1 AND islubas_type <> 'N/A') OR 
            (validation_id_param = 2 AND islubas_type <> 'N/A') OR 
            (validation_id_param = 3 AND islubas_type <> 'N/A')  
        THEN 1 END) AS count_lubas
    FROM 
        electorates
    GROUP BY 
        electorates.brgy
    ORDER BY 
        electorates.brgy;
END;
$$ LANGUAGE plpgsql;