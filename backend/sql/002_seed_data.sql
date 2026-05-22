INSERT INTO tenants (name)
VALUES
  ('Standard Chartered Bank'),
  ('KiwiRail');

INSERT INTO users (
  tenant_id,
  name,
  email,
  password_hash,
  role
)
VALUES
  (
    1,
    'Shumit',
    'shumit@scb.com',
    '$2b$10$nq3qp0fAP5.qaJDESbEWG.BPVYArGFXrYEbk3ZOQRKnpF..DlSNLG',
    'superadmin'
  ),
  (
    1,
    'Sarah',
    'sarah@scb.com',
    '$2b$10$nq3qp0fAP5.qaJDESbEWG.BPVYArGFXrYEbk3ZOQRKnpF..DlSNLG',
    'admin'
  ),
  (
    2,
    'Mike',
    'mike@kiwirail.co.nz',
    '$2b$10$nq3qp0fAP5.qaJDESbEWG.BPVYArGFXrYEbk3ZOQRKnpF..DlSNLG',
    'admin'
  ),
  (
    2,
    'Emma',
    'emma@kiwirail.co.nz',
    '$2b$10$nq3qp0fAP5.qaJDESbEWG.BPVYArGFXrYEbk3ZOQRKnpF..DlSNLG',
    'user'
  );

INSERT INTO incidents (
  tenant_id,
  title,
  description,
  severity,
  status,
  assigned_to
)
VALUES
  (
    1,
    'SWIFT payment delay',
    'Delayed inward remittance processing',
    'High',
    'Open',
    'Shumit'
  ),
  (
    1,
    'Compliance review backlog',
    'AML review queue growing rapidly',
    'Medium',
    'In Progress',
    'Sarah'
  ),
  (
    2,
    'Rail sensor outage',
    'Track monitoring sensors offline',
    'Critical',
    'Open',
    'Mike'
  );