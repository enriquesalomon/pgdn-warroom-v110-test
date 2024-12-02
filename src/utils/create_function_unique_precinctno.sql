CREATE
OR REPLACE FUNCTION get_unique_precinctnos () RETURNS TABLE (precinctno varchar) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT team.precinctno
    FROM team
    ORDER BY team.precinctno ASC;
END;
$$ LANGUAGE plpgsql;