CREATE
OR REPLACE FUNCTION count_electorates_unvalidated () RETURNS TABLE (brgy CHARACTER VARYING, electorate_count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT electorates.brgy, COUNT(*) AS electorate_count
    FROM electorates
    WHERE electorates.precinctleader IS NULL AND electorates.voters_type IS NULL
    GROUP BY electorates.brgy;
END;
$$ LANGUAGE plpgsql;