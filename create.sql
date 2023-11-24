CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  platoon_id INTEGER,
  contact_info TEXT,
  FOREIGN KEY(platoon_id) REFERENCES platoons(id)
);

CREATE TABLE platoons (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  company_id INTEGER,
  FOREIGN KEY(company_id) REFERENCES companies(id)
);

CREATE TABLE companies (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE parents (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  contact_info TEXT
);

CREATE TABLE parent_child (
  parent_id INTEGER,
  child_id INTEGER,
  PRIMARY KEY(parent_id, child_id),
  FOREIGN KEY(parent_id) REFERENCES parents(id),
  FOREIGN KEY(child_id) REFERENCES users(id)
);