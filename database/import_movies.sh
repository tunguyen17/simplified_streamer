#!/bin/bash

# source https://stackoverflow.com/questions/9612090/how-to-loop-through-file-names-returned-by-find
# source https://stackoverflow.com/questions/10986794/remove-part-of-path-on-unix

shopt -s globstar

MOVIE_DIRPATH="../media/video/movie"

#fix this so that we don't need to remove tmp_db.csv everytime
if test -f movie_db.csv; then
    rm movie_db.csv
    echo "movie_db.csv removed."
fi

I=1

for i in $MOVIE_DIRPATH/*; do
    #echo $i 
    FILENAME="$(basename "$i")"
    #echo $FILENAME
    for j in "$i"/*; do
        if [[ ${j: -4} == ".mp4" ]]
        then
            FILEPATH="$(echo $j | cut -d'/' -f2-)"
            #echo $FILEPATH
            echo "$I,\"$FILENAME\",\"$FILEPATH\""  >> movie_db.csv
            I=$((I+1))
        fi
    done
done

echo -e ".separator ","\n.import movie_db.csv movies" | sqlite3 media.db
