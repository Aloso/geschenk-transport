DROP TABLE IF EXISTS secret_santa;
CREATE TABLE secret_santa (
  id          STRING PRIMARY KEY,
  created     INTEGER NOT NULL,
  `name`      TEXT NOT NULL,
  phone       TEXT,
  email       TEXT,
  `address`   TEXT NOT NULL,
  age         INTEGER NOT NULL,
  moreInfo    TEXT,
  `status`    VARCHAR(10) NOT NULL DEFAULT 'pending',
  notes       TEXT
);
