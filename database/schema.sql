CREATE TABLE movies(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(80),
    file_path VARCHAR(200) NOT NULL UNIQUE
);

CREATE TABLE series(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(80)
);

CREATE TABLE series_seasons(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    series_id INTEGER,
    title VARCHAR(80),
    FOREIGN KEY(series_id) REFERENCES series(id)
);

CREATE TABLE series_episodes(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    series_id INTEGER,
    series_seasons_id INTEGER,
    title VARCHAR(80),
    file_path VARCHAR(200) NOT NULL,
    play_order INTEGER,
    FOREIGN KEY(series_id) REFERENCES series(id),
    FOREIGN KEY(series_seasons_id) REFERENCES series_seasons(id)
);
