CREATE TABLE movies(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(80),
    file_path VARCHAR(200) NOT NULL UNIQUE
);

CREATE TABLE series(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(80)
);

CREATE TABLE series_detail(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    series_id INTEGER,
    title VARCHAR(80),
    file_path VARCHAR(200) NOT NULL,
    play_order INTEGER
);
