CREATE TABLE movies(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(80),
    file_path VARCHAR(200) NOT NULL UNIQUE
);

CREATE TABLE series(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(80),
    series_title VARCHAR(80),
    episode INTEGER,
    season INTEGER,
    file_path VARCHAR(200) NOT NULL
);
