CREATE
OR REPLACE FUNCTION get_precinct_numbers_brgy(barangay TEXT) RETURNS TABLE (precinct_no text) AS $$
    SELECT DISTINCT
      precinctno as precinct_no
    FROM
      electorates
    WHERE
      brgy = barangay;
$$ language sql;