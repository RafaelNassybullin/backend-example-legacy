const countQuery = `
  SELECT COUNT(DISTINCT company.id)
  FROM companies company
  LEFT JOIN company_types company_type ON company.id = company_type.company_id
  WHERE 
    ($1::text IS NULL OR company.status = $1)
  AND ($2::text[] IS NULL 
  OR EXISTS (
     SELECT 1 
        FROM company_types ct 
        WHERE ct.company_id = company.id 
        AND ct.type = ANY($2::text[])
      )
  );
`;

module.exports = { countQuery };
