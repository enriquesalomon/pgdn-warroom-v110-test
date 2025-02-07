CREATE
OR REPLACE FUNCTION get_counts_unvalidated_per_brgy (validation_id_param BIGINT) RETURNS TABLE (brgy TEXT, electorate_count BIGINT) AS $$
DECLARE
    validation_column text;
BEGIN
    -- Determine which validation column to use based on the validation_id_param
    IF validation_id_param = 1 THEN
        validation_column := 'first_validation';
    ELSE
        validation_column := 'second_validation';
    END IF;

    RETURN QUERY EXECUTE format(
        'SELECT 
            brgy::text AS brgy, 
            COUNT(*) AS electorate_count
        FROM 
            electorates
        WHERE 
            precinctleader IS NOT NULL 
            AND %I = false
        GROUP BY 
            brgy
        ORDER BY 
            brgy;',
        validation_column
    );
END;
$$ LANGUAGE plpgsql;