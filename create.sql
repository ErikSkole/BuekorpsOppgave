CREATE TABLE companies (
  company_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE platoons (
  platoon_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  companies_company_id INTEGER,
  FOREIGN KEY(companies_company_id) REFERENCES companies(company_id)
);

CREATE TABLE users (
  user_id INTEGER PRIMARY KEY,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  platoons_platoon_id INTEGER,
  platoons_company_id INTEGER,
  first_name TEXT,
  last_name TEXT,
  phone INTEGER,
  email TEXT,
  FOREIGN KEY(platoons_platoon_id) REFERENCES platoons(platoon_id),
  FOREIGN KEY(platoons_company_id) REFERENCES companies(company_id)
);

INSERT INTO companies (company_id, name) VALUES (1, 'Kompani 1');
INSERT INTO companies (company_id, name) VALUES (2, 'Kompani 2');

INSERT INTO platoons (platoon_id, name, companies_company_id) VALUES (1, 'Peletong 1', 1);
INSERT INTO platoons (platoon_id, name, companies_company_id) VALUES (2, 'Peletong 2', 1);
INSERT INTO platoons (platoon_id, name, companies_company_id) VALUES (3, 'Peletong 1', 2);
INSERT INTO platoons (platoon_id, name, companies_company_id) VALUES (4, 'Peletong 2', 2);

