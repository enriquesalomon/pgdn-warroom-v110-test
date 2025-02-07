CREATE OR REPLACE FUNCTION get_topleaders_team_counts(brgy_param VARCHAR)
RETURNS TABLE (
  id INT,
  precinctno VARCHAR,
  firstname VARCHAR,
  middlename VARCHAR,
  lastname VARCHAR,
  brgy VARCHAR,
  is_gm BOOLEAN,
  is_agm BOOLEAN,
  is_legend BOOLEAN,
  is_elite BOOLEAN,
  gm_team_count INT,
  agm_team_count INT,
  legend_team_count INT,
  elite_team_count INT
)
LANGUAGE sql
AS $$
  SELECT
    e.id,
    e.precinctno,
    e.firstname,
    e.middlename,
    e.lastname,
    e.brgy,
    e.is_gm,
    e.is_agm,
    e.is_legend,
    e.is_elite,
    COUNT(DISTINCT t_gm.id) AS gm_team_count,
    COUNT(DISTINCT t_agm.id) AS agm_team_count,
    COUNT(DISTINCT t_legend.id) AS legend_team_count,
    COUNT(DISTINCT t_elite.id) AS elite_team_count
  FROM 
    electorates e
  LEFT JOIN
    team t_gm ON e.id = t_gm.gm_id AND e.is_gm IS NOT NULL
  LEFT JOIN
    team t_agm ON e.id = t_agm.agm_id AND e.is_agm IS NOT NULL
  LEFT JOIN
    team t_legend ON e.id = t_legend.legend_id AND e.is_legend IS NOT NULL
  LEFT JOIN
    team t_elite ON e.id = t_elite.elite_id AND e.is_elite IS NOT NULL  
  WHERE
    (e.is_gm IS NOT NULL 
    OR e.is_agm IS NOT NULL 
    OR e.is_legend IS NOT NULL 
    OR e.is_elite IS NOT NULL)
    AND e.brgy = brgy_param
    AND e.brgy = brgy_param -- Filtering by brgy parameter
  GROUP BY
    e.id;
$$;