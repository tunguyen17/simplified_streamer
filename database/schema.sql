CREATE TABLE movies(
    id INTEGER UNIQUE,
    title VARCHAR(80),
    file_path VARCHAR(200) NOT NULL
);

INSERT INTO movies VALUES(
    0,
    "tosh.0 sample",
    "videos/sample.mp4" 
);
