CREATE
OR REPLACE FUNCTION get_voters_scanned_count_by_brgy () RETURNS TABLE (brgy TEXT, COUNT BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    voters_scans.brgy,  -- Explicitly specify the table name
    COUNT(*) AS count
  FROM
    voters_scans
  GROUP BY
    voters_scans.brgy  -- Explicitly specify the table name
  ORDER BY
    voters_scans.brgy ASC;  -- Explicitly specify the table name
END;
$$ LANGUAGE plpgsql;