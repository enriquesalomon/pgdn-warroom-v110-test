CREATE OR REPLACE FUNCTION count_affiliates_per_barangay()
RETURNS TABLE(barangay character varying, count_affiliates bigint) AS $$
BEGIN
    RETURN QUERY
    SELECT electorates.brgy as barangay, COUNT(*) AS count_affiliates
    FROM electorates
    WHERE islubas_type IS NOT NULL AND islubas_type <> 'N/A'
    GROUP BY electorates.brgy;
END;
$$ LANGUAGE plpgsql;
