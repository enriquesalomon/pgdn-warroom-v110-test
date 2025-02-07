CREATE
OR REPLACE FUNCTION get_summary_counts_per_barangay () RETURNS TABLE (
  brgy VARCHAR,
  warriors BIGINT,
  baco_count BIGINT,
  gm_count BIGINT,
  agm_count BIGINT,
  legend_count BIGINT,
  elite_count BIGINT,
  jehovah_count BIGINT,
  inc_count BIGINT,
  ot_count BIGINT,
  unvalidated_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.brgy,
    COALESCE(t.warriors, 0) AS warriors,
    COALESCE(b.baco_count, 0) AS baco_count,
    COALESCE(b.gm_count, 0) AS gm_count,
    COALESCE(b.agm_count, 0) AS agm_count,
    COALESCE(b.legend_count, 0) AS legend_count,
    COALESCE(b.elite_count, 0) AS elite_count,
    COALESCE(b.jehovah_count, 0) AS jehovah_count,
    COALESCE(b.inc_count, 0) AS inc_count,
    COALESCE(b.ot_count, 0) AS ot_count,
    COALESCE(b.unvalidated_count, 0) AS unvalidated_count
  FROM
    (
      SELECT DISTINCT
        e.brgy
      FROM
        electorates e
    ) e
    LEFT JOIN (
      SELECT
        t.brgy,
        COUNT(*) AS warriors
      FROM
        electorates t
      WHERE
        t.precinctleader IS NOT NULL
      GROUP BY
        t.brgy
    ) t ON e.brgy = t.brgy
    LEFT JOIN (
      SELECT
        b.brgy,
        SUM(
          CASE
            WHEN b.isbaco = TRUE THEN 1
            ELSE 0
          END
        ) AS baco_count,
        SUM(
          CASE
            WHEN b.is_gm = TRUE THEN 1
            ELSE 0
          END
        ) AS gm_count,
        SUM(
          CASE
            WHEN b.is_agm = TRUE THEN 1
            ELSE 0
          END
        ) AS agm_count,
        SUM(
          CASE
            WHEN b.is_legend = TRUE THEN 1
            ELSE 0
          END
        ) AS legend_count,
        SUM(
          CASE
            WHEN b.is_elite = TRUE THEN 1
            ELSE 0
          END
        ) AS elite_count,
        SUM(
          CASE
            WHEN b.voters_type = 'JEHOVAH' THEN 1
            ELSE 0
          END
        ) AS jehovah_count,
        SUM(
          CASE
            WHEN b.voters_type = 'INC' THEN 1
            ELSE 0
          END
        ) AS inc_count,
        SUM(
          CASE
            WHEN b.voters_type = 'OT' THEN 1
            ELSE 0
          END
        ) AS ot_count,
        SUM(
          CASE
            WHEN b.precinctleader IS NULL
            AND b.voters_type IS NULL
            AND b.isbaco IS NULL
            AND b.is_gm IS NULL
            AND b.is_agm IS NULL
            AND b.is_legend IS NULL
            AND b.is_elite IS NULL THEN 1
            ELSE 0
          END
        ) AS unvalidated_count
      FROM
        electorates b
      GROUP BY
        b.brgy
    ) b ON e.brgy = b.brgy
  ORDER BY
    e.brgy;

END;
$$ LANGUAGE plpgsql;