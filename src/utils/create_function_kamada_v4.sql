create
or replace function calculate_projected_data_kamada_v4() returns table (
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
    voters_ot bigint,
    voters_inc bigint,
    voters_jehovah bigint
) as $$

SELECT 
e.brgy AS barangay, 
COUNT(*) AS voters,
(ROUND(COUNT(*) * (s.projected_winning_votes / 100.0),0))  AS projected_winning_votes,
ROUND((ROUND(COUNT(*) * (s.projected_winning_votes / 100.0),0)) / s.max_teammembers_included_leader,0) AS projected_tower,
ROUND(ROUND(ROUND(COUNT(*) * (s.projected_winning_votes / 100.0),0) / s.max_teammembers_included_leader,0),0) * (s.max_teammembers_included_leader - 1) AS projected_members,
COALESCE(t.team_count, 0) AS organized_tower,
ROUND((COALESCE(t.team_count, 0)) / ROUND(ROUND(ROUND(COUNT(*) * (s.projected_winning_votes / 100.0),0) / s.max_teammembers_included_leader,0),0) * 100.0,2) AS organized_tower_percent,
COALESCE(p.org_mem, 0) AS organized_member,
ROUND((COALESCE(p.org_mem, 0) / (((COUNT(*)  * (s.projected_winning_votes / 100.0)) / s.max_teammembers_included_leader) * (s.max_teammembers_included_leader - 1))) * 100.0,2)
AS member_percent,
COALESCE(t.team_count, 0) + COALESCE(p.org_mem, 0) as total_organized_voters,
ROUND(((COALESCE(t.team_count, 0) + COALESCE(p.org_mem, 0)) / (COUNT(*) * (s.projected_winning_votes / 100.0))) * 100.0,2) as voters_percent,
va.voters_ato AS voters_ato,
vo.voters_ot AS voters_ot,
vi.voters_inc as voters_inc,
vj.voters_jehovah as voters_jehovah
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
     WHERE result=1
     GROUP BY brgy) va
     ON e.brgy = va.brgy
LEFT JOIN 
    ( SELECT brgy, COUNT(*) as voters_ot
     FROM electorate_validations
     WHERE result=4
     GROUP BY brgy) vo
     ON e.brgy = vo.brgy
LEFT JOIN 
    ( SELECT brgy, COUNT(*) as voters_inc
     FROM electorate_validations
     WHERE result=5
     GROUP BY brgy) vi
     ON e.brgy = vi.brgy
LEFT JOIN 
    ( SELECT brgy, COUNT(*) as voters_jehovah
     FROM electorate_validations
     WHERE result=6
     GROUP BY brgy) vj
     ON e.brgy = vj.brgy      
GROUP BY 
    e.brgy, s.projected_winning_votes, s.max_teammembers_included_leader, t.team_count, organized_member,va.voters_ato,vo.voters_ot,vi.voters_inc,vj.voters_jehovah
ORDER BY 
    e.brgy ASC;

$$ language sql;