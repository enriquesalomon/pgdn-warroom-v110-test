create
or replace function calculate_projected_data_kamada_v5(validation_id_params int) returns table (
  barangay text,
    voters bigint,
    projected_winning_votes bigint,
    projected_tower bigint,
    projected_members bigint,
    organized_tower bigint,
    organized_tower_percent double precision,
    organized_member bigint,
    member_percent double precision,
    total_organized_voters bigint,
    voters_percent double precision,
    voters_ato bigint,
    voters_dili bigint,
    voters_ot bigint,
    voters_inc bigint,
    voters_jehovah bigint,
    voters_deceased bigint,
    voters_undecided bigint,
    voters_nvs bigint
) as $$

SELECT 
e.brgy AS barangay, 
COUNT(*) AS voters,
CEIL(COUNT(*) * (s.projected_winning_votes / 100.0)) AS projected_winning_votes,
CEIL(ROUND(COUNT(*) * (s.projected_winning_votes / 100.0), 0) / s.max_teammembers_included_leader) AS projected_tower,
CEIL(COUNT(*) * (s.projected_winning_votes / 100.0)) - CEIL(ROUND(COUNT(*) * (s.projected_winning_votes / 100.0), 0) / s.max_teammembers_included_leader) AS projected_members,
-- ROUND((ROUND(COUNT(*) * (s.projected_winning_votes / 100.0),0)) / s.max_teammembers_included_leader,0) AS projected_tower,
-- ROUND(ROUND(ROUND(COUNT(*) * (s.projected_winning_votes / 100.0),0) / s.max_teammembers_included_leader,0),0) * (s.max_teammembers_included_leader - 1) AS projected_members,
COALESCE(t.team_count, 0) AS organized_tower,
ROUND((COALESCE(t.team_count, 0)) / ROUND(ROUND(ROUND(COUNT(*) * (s.projected_winning_votes / 100.0),0) / s.max_teammembers_included_leader,0),0) * 100.0,2) AS organized_tower_percent,
COALESCE(p.org_mem, 0) AS organized_member,
ROUND((COALESCE(p.org_mem, 0) / (((COUNT(*)  * (s.projected_winning_votes / 100.0)) / s.max_teammembers_included_leader) * (s.max_teammembers_included_leader - 1))) * 100.0,2)
AS member_percent,
COALESCE(t.team_count, 0) + COALESCE(p.org_mem, 0) as total_organized_voters,
ROUND(((COALESCE(t.team_count, 0) + COALESCE(p.org_mem, 0)) / (COUNT(*) * (s.projected_winning_votes / 100.0))) * 100.0,2) as voters_percent,
va.voters_ato AS voters_ato,
vd.voters_dili as voters_dili,
vo.voters_ot AS voters_ot,
vi.voters_inc as voters_inc,
vj.voters_jehovah as voters_jehovah,
vdd.voters_deceased as voters_deceased,
vu.voters_undecided as voters_undecided,
vn.voters_nvs as voters_nvs
FROM 
    electorates e
JOIN 
    (SELECT projected_winning_votes, max_teammembers_included_leader FROM settings_data_analysis) s
    ON TRUE
LEFT JOIN 
    (SELECT barangay, COUNT(*) AS team_count FROM team GROUP BY barangay) t
    ON e.brgy = t.barangay
LEFT JOIN 
    (SELECT brgy, COUNT(*) AS org_mem
     FROM electorates
     WHERE precinctleader IS NOT NULL AND isleader IS NOT TRUE
     GROUP BY brgy) p
    ON e.brgy = p.brgy
LEFT JOIN 
    ( SELECT brgy, COUNT(*) as voters_ato 
     FROM electorate_validations
      WHERE result=1  AND validation_id = validation_id_params
     GROUP BY brgy) va
     ON e.brgy = va.brgy
LEFT JOIN 
    ( SELECT brgy, COUNT(*) as voters_dili
     FROM electorate_validations
     WHERE result=0  AND validation_id = validation_id_params
     GROUP BY brgy) vd
     ON e.brgy = vd.brgy
LEFT JOIN 
    ( SELECT brgy, COUNT(*) as voters_ot
     FROM electorate_validations
     WHERE result=4 AND validation_id = validation_id_params
     GROUP BY brgy) vo
     ON e.brgy = vo.brgy
LEFT JOIN 
    ( SELECT brgy, COUNT(*) as voters_inc
     FROM electorate_validations
     WHERE result=5 AND validation_id = validation_id_params
     GROUP BY brgy) vi
     ON e.brgy = vi.brgy
LEFT JOIN 
    ( SELECT brgy, COUNT(*) as voters_jehovah
     FROM electorate_validations
     WHERE result=6 AND validation_id = validation_id_params
     GROUP BY brgy) vj
     ON e.brgy = vj.brgy
LEFT JOIN 
    ( SELECT brgy, COUNT(*) as voters_deceased
     FROM electorate_validations
     WHERE result=3 AND validation_id = validation_id_params
     GROUP BY brgy) vdd
     ON e.brgy = vdd.brgy 
LEFT JOIN 
    ( SELECT brgy, COUNT(*) as voters_undecided
     FROM electorate_validations
     WHERE result=2 AND validation_id = validation_id_params
     GROUP BY brgy) vu
     ON e.brgy = vu.brgy
LEFT JOIN 
    ( SELECT brgy, COUNT(*) as voters_nvs
     FROM electorate_validations
     WHERE result=7 AND validation_id = validation_id_params
     GROUP BY brgy) vn
     ON e.brgy = vn.brgy  
GROUP BY 
    e.brgy, s.projected_winning_votes, s.max_teammembers_included_leader, t.team_count, organized_member,va.voters_ato,vd.voters_dili,vo.voters_ot,vi.voters_inc,vj.voters_jehovah,vdd.voters_deceased,vu.voters_undecided,vn.voters_nvs
ORDER BY 
    e.brgy ASC;

$$ language sql;