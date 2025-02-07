CREATE OR REPLACE FUNCTION get_electorate_validated(val_id int, brgy_param TEXT, searchTerm TEXT, page int)
RETURNS TABLE (
  id bigint,
  validation_id bigint,
  result bigint,
  precinctno VARCHAR,
  firstname VARCHAR,
  middlename VARCHAR,
  lastname VARCHAR,
  brgy VARCHAR,
  purok VARCHAR,
  isleader_type VARCHAR,
  islubas_type VARCHAR,
  leader_firstname VARCHAR,
  leader_lastname VARCHAR,
  validation_name VARCHAR,
  total_count bigint
) AS $$
DECLARE
  from_index bigint;
  to_index bigint;
BEGIN
  from_index := (page - 1) * 100;
  to_index := from_index + 100 - 1;

  RETURN QUERY
  SELECT
    ev.id,
    ev.validation_id,
    ev.result,
    e.precinctno,
    e.firstname,
    e.middlename,
    e.lastname,
    e.brgy,
    e.purok,
    e.isleader_type,
    e.islubas_type,
    t.firstname AS leader_firstname,
    t.lastname AS leader_lastname,
    sv.validation_name,
    count(*) OVER() AS total_count
  FROM
    electorate_validations ev
    JOIN electorates e ON ev.electorate_id = e.id
    JOIN team t ON ev.leader_id = t.id
    JOIN settings_validation sv ON ev.validation_id = sv.id
  WHERE
    ev.validation_id = val_id
    AND e.brgy = brgy_param
    AND (
        searchTerm IS NULL
        OR e.firstname ILIKE '%' || searchTerm || '%'
        OR e.lastname ILIKE '%' || searchTerm || '%'
        OR e.middlename ILIKE '%' || searchTerm || '%'
    )
  ORDER BY
    e.firstname
  LIMIT
    100
  OFFSET
    from_index;
END;
$$ LANGUAGE plpgsql;