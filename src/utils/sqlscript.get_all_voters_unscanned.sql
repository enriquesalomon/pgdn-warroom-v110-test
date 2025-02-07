CREATE OR REPLACE FUNCTION get_all_voters_unscanned(
brgy_param TEXT,
searchTerm TEXT,
page INTEGER
) RETURNS SETOF electorates AS $$
DECLARE
from_index BIGINT;
to_index BIGINT;
BEGIN
from_index := (page - 1) * 100;
to_index := from_index + 100 - 1;
RETURN QUERY 
SELECT e.*
FROM electorates e
JOIN electorate_validations ev ON ev.electorate_id = e.id
WHERE e.brgy = brgy_param
AND e.precinctleader IS NOT NULL
AND ev.validation_id = 3
AND ev.result = 1
AND (
searchTerm IS NULL
OR e.firstname ILIKE '%' || searchTerm || '%'
OR e.lastname ILIKE '%' || searchTerm || '%'
OR e.middlename ILIKE '%' || searchTerm || '%'
)
ORDER BY e.firstname
LIMIT 100 OFFSET from_index;
END;
$$ LANGUAGE plpgsql;