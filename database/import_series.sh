#!/bin/bash

# source https://stackoverflow.com/questions/9612090/how-to-loop-through-file-names-returned-by-find
# source https://stackoverflow.com/questions/10986794/remove-part-of-path-on-unix

shopt -s globstar

SERIES_DIRPATH="../media/video/series"

#fix this so that we don't need to remove tmp_db.csv everytime
if test -f csv/series_db.csv; then
    rm csv/series_db.csv
    echo "series_db.csv removed."
fi

if test -f csv/series_seasons_db.csv; then
    rm csv/series_seasons_db.csv
    echo "series_seasons_db.csv removed."
fi

if test -f csv/series_episodes_db.csv; then
    rm csv/series_episodes_db.csv
    echo "series_episodes_db.csv removed."
fi

I=1
J=1
K=1

IFS=$(echo -en "\n\b")
for i in $SERIES_DIRPATH/*; do
    series_name="$(basename "$i")"
    echo "$I,\"$series_name\""  >> csv/series_db.csv
    for j in "$i"/*; do
        season_name="$(basename "$j")"
        echo "$J,$I,\"$season_name\""  >> csv/series_seasons_db.csv
        play_order=1
        for z in `ls -v "$j/"*.mp4`; do
            if [[ ${z: -4} == ".mp4" ]]
            then
                episode_name="$(basename "$z")"
                FILEPATH="$(echo $z | cut -d'/' -f2-)"
                echo "$K,$I,$J,\"${episode_name%.*}\",\"$FILEPATH\",$play_order"  >> csv/series_episodes_db.csv
                K=$((K+1))
                play_order=$((play_order+1))
            fi
        done
        J=$((J+1))
    done
    I=$((I+1))
done

echo -e ".separator ","\n.import csv/series_db.csv series" | sqlite3 media.db
echo -e ".separator ","\n.import csv/series_seasons_db.csv series_seasons" | sqlite3 media.db
echo -e ".separator ","\n.import csv/series_episodes_db.csv series_episodes" | sqlite3 media.db
