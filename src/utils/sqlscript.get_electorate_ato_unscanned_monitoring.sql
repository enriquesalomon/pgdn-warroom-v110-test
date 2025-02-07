CREATE
OR REPLACE FUNCTION get_electorate_ato_unscanned_monitoring (
  val_id BIGINT,
  brgy_param TEXT,
  searchTerm TEXT,
  page INT
) RETURNS TABLE (
  id BIGINT,
  precinctno TEXT,
  firstname TEXT,
  middlename TEXT,
  lastname TEXT,
  brgy TEXT,
  purok TEXT,
  leader_firstname TEXT,
  leader_lastname TEXT,
  total_count BIGINT
) AS $$
DECLARE
    from_index BIGINT;
BEGIN
    from_index := (page - 1) * 100;

    RETURN QUERY
    SELECT
        ev.id,
        e.precinctno::TEXT,  -- Explicitly cast to TEXT
        e.firstname::TEXT,  -- Explicitly cast to TEXT
        e.middlename::TEXT,  -- Explicitly cast to TEXT
        e.lastname::TEXT,  -- Explicitly cast to TEXT
        e.brgy::TEXT,  -- Explicitly cast to TEXT
        e.purok::TEXT,  -- Explicitly cast to TEXT
        t.firstname::TEXT AS leader_firstname,  -- Explicitly cast to TEXT
        t.lastname::TEXT AS leader_lastname,  -- Explicitly cast to TEXT
        count(*) OVER() AS total_count
    FROM
        electorate_validations ev
        JOIN electorates e ON ev.electorate_id = e.id
        JOIN team t ON ev.leader_id = t.id
    WHERE
        ev.validation_id = val_id
        AND ev.result = 1
        AND e.brgy = brgy_param
        AND e.final_validation = FALSE
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