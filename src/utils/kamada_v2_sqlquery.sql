--version2 query ROUNDUP---
SELECT 
    e.brgy AS barangay, 
    COUNT(*) AS voters,
    ROUND(COUNT(*) * (s.projected_turnout / 100.0),0) AS projected_turnout,
    ROUND((ROUND(COUNT(*) * (s.projected_turnout / 100.0),0)) * (s.projected_winning_votes / 100.0),0) AS projected_winning_votes,
    ROUND(ROUND((ROUND(COUNT(*) * (s.projected_turnout / 100.0),0)) * (s.projected_winning_votes / 100.0),0) / s.max_teammembers_included_leader,0) AS projected_pl,
    ROUND(ROUND(ROUND((ROUND(COUNT(*) * (s.projected_turnout / 100.0),0)) * (s.projected_winning_votes / 100.0),0) / s.max_teammembers_included_leader,0),0) * (s.max_teammembers_included_leader - 1) AS projected_members,
    COALESCE(t.team_count, 0) AS organized_pl,
  ROUND((COALESCE(t.team_count, 0)) / ROUND(ROUND(ROUND((ROUND(COUNT(*) * (s.projected_turnout / 100.0),0)) * (s.projected_winning_votes / 100.0),0) / s.max_teammembers_included_leader,0),0) * 100.0,2) AS organized_pl_percent,
    COALESCE(p.org_mem, 0) AS organized_member,
    ROUND((COALESCE(p.org_mem, 0) / ((((COUNT(*) * (s.projected_turnout / 100.0)) * (s.projected_winning_votes / 100.0)) / s.max_teammembers_included_leader) * (s.max_teammembers_included_leader - 1))) * 100.0,2)
    AS member_percent,
   COALESCE(t.team_count, 0) + COALESCE(p.org_mem, 0) as total_organized_voters,
  ROUND(((COALESCE(t.team_count, 0) + COALESCE(p.org_mem, 0)) / ((COUNT(*) * (s.projected_turnout / 100.0)) * (s.projected_winning_votes / 100.0))) * 100.0,2) as voters_percent,
  va.voters_ato AS voters_ato,
  vd.voters_dili AS voters_dili,
  vu.voters_undecided as voters_undecided
FROM 
    electorates e
JOIN 
    (SELECT projected_turnout, projected_winning_votes, max_teammembers_included_leader FROM settings_data_analysis) s
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
    ( SELECT brgy, COUNT(*) as voters_dili
     FROM electorate_validations
     WHERE result=0
     GROUP BY brgy) vd
     ON e.brgy = vd.brgy
LEFT JOIN 
    ( SELECT brgy, COUNT(*) as voters_undecided
     FROM electorate_validations
     WHERE result=2
     GROUP BY brgy) vu
     ON e.brgy = vu.brgy     
GROUP BY 
    e.brgy, s.projected_turnout, s.projected_winning_votes, s.max_teammembers_included_leader, t.team_count, organized_member,va.voters_ato,vd.voters_dili,vu.voters_undecided
ORDER BY 
    e.brgy ASC;


--version1 query NOT ROUNDUP----
-- SELECT 
--     e.brgy AS barangay, 
--     COUNT(*) AS voters,
--     COUNT(*) * (s.projected_turnout / 100.0) AS projected_turnout,
--     (COUNT(*) * (s.projected_turnout / 100.0)) * (s.projected_winning_votes / 100.0) AS projected_winning_votes,
--     ((COUNT(*) * (s.projected_turnout / 100.0)) * (s.projected_winning_votes / 100.0)) / s.max_teammembers_included_leader AS projected_pl,
--     (((COUNT(*) * (s.projected_turnout / 100.0)) * (s.projected_winning_votes / 100.0)) / s.max_teammembers_included_leader) * (s.max_teammembers_included_leader - 1) AS projected_members,
--     COALESCE(t.team_count, 0) AS organized_pl,
--   (COALESCE(t.team_count, 0)) / (((COUNT(*) * (s.projected_turnout / 100.0)) * (s.projected_winning_votes / 100.0)) / s.max_teammembers_included_leader) * 100.0 AS organized_pl_percent,
--     COALESCE(p.org_mem, 0) AS organized_member,
--     (COALESCE(p.org_mem, 0) / ((((COUNT(*) * (s.projected_turnout / 100.0)) * (s.projected_winning_votes / 100.0)) / s.max_teammembers_included_leader) * (s.max_teammembers_included_leader - 1))) * 100.0
--     AS member_percent,
--    COALESCE(t.team_count, 0) + COALESCE(p.org_mem, 0) as total_organized_voters,
--   ((COALESCE(t.team_count, 0) + COALESCE(p.org_mem, 0)) / ((COUNT(*) * (s.projected_turnout / 100.0)) * (s.projected_winning_votes / 100.0))) * 100.0 as voters_percent
-- FROM 
--     electorates e
-- JOIN 
--     (SELECT projected_turnout, projected_winning_votes, max_teammembers_included_leader FROM settings_data_analysis) s
--     ON TRUE
-- LEFT JOIN 
--     (SELECT barangay, COUNT(*) AS team_count FROM team GROUP BY barangay) t
--     ON e.brgy = t.barangay
-- LEFT JOIN 
--     (SELECT brgy, COUNT(*) AS org_mem
--      FROM electorates
--      WHERE precinctleader IS NOT NULL AND isleader IS NOT TRUE
--      GROUP BY brgy) p
--     ON e.brgy = p.brgy
-- GROUP BY 
--     e.brgy, s.projected_turnout, s.projected_winning_votes, s.max_teammembers_included_leader, t.team_count, organized_member
-- ORDER BY 
--     e.brgy ASC;
