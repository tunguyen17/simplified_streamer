# source https://stackoverflow.com/questions/9612090/how-to-loop-through-file-names-returned-by-find
# source https://stackoverflow.com/questions/10986794/remove-part-of-path-on-unix

shopt -s globstar

MOVIE_DIRPATH="../media/video/movie"
SERIES_DIRPATH="../media/video/series"

I=1

for i in $MOVIE_DIRPATH/*; do
    I=$((I+1))
    FILEPATH="$(echo $i | cut -d'/' -f5-)"
    
    echo $FILEPATH
    #FILENAME="$(basename "$i")"
    #echo "$I,\"$FILENAME\",\"$FILEPATH\"" # >> tmp_db.csv
done

# echo -e ".separator ","\n.import tmp_db.csv movies" | sqlite3 media.db
