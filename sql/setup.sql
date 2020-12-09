DROP TABLE IF EXISTS boats;

CREATE TABLE boats(
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  style TEXT NOT NULL,
  color TEXT NOT NULL,
  powered TEXT NOT NULL
);