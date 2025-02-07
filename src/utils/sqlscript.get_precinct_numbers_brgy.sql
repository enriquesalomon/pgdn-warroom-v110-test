-- Create a function to select distinct precinct numbers based on the input barangay
CREATE
OR REPLACE FUNCTION get_precinct_numbers_brgy(barangay TEXT) RETURNS TABLE (precinct_no text) AS $$
    SELECT DISTINCT
      precinctno as precinct_no
    FROM
      electorates
    WHERE
      brgy = barangay
     ORDER BY precinctno ASC;
$$ language sql;