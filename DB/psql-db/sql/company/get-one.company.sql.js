const getCompanyById = `
  SELECT 
    company.id,
    company.contact_id,
    company.name,
    company.short_name,
    company.business_entity,
    company.status,
    company.created_at,
    company.updated_at,
    jsonb_build_object('no', contract.contract_no, 'issue_date', contract.issue_date) 
        AS contract,
    jsonb_agg(DISTINCT company_type.type) FILTER (WHERE company_type.type IS NOT NULL) 
        AS type,
    COALESCE(
        jsonb_agg(DISTINCT jsonb_build_object('name', photo.name, 'filepath', photo.filepath, 'thumbpath', photo.thumbpath)) 
        FILTER (WHERE photo.name IS NOT NULL), 
        '[]'::jsonb
    ) AS photos,
    jsonb_build_object(
        'street', address.street,
        'city', address.city,
        'postal_code', address.postal_code,
        'country', address.country
    ) AS address
    FROM companies company
    LEFT JOIN LATERAL (
    SELECT contract_no, issue_date 
    FROM contracts 
    WHERE company.id = contracts.company_id
    ORDER BY issue_date DESC 
    LIMIT 1
    ) contract ON true
    LEFT JOIN company_types company_type ON company.id = company_type.company_id
    LEFT JOIN photos photo ON company.id = photo.company_id
    LEFT JOIN address ON company.id = address.company_id
    WHERE company.id = $1
    GROUP BY company.id, contract.contract_no, contract.issue_date, address.street, address.city, address.postal_code, address.country;
`;

module.exports = { getCompanyById };
