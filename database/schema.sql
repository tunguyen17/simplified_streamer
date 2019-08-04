CREATE TABLE movies(
    id INTEGER UNIQUE,
    title VARCHAR(80),
    file_path VARCHAR(200) NOT NULL
);

CREATE TABLE series(
    id INTEGER UNIQUE,
    title VARCHAR(80),
    series_title VARCHAR(80),
    episode INTEGER,
    season INTEGER,
    file_path VARCHAR(200) NOT NULL
);

INSERT INTO movies VALUES(
    0,
    "tosh.0 sample",
    "videos/sample.mp4" 
);
