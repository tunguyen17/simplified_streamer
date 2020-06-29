# simplified_streamer

Container formats (has video tracks and audio tracks)
- mpeg 4 | mp4 : apple stuff
- ogg opensource
- flash | adobe
- WebM | open source | tailored toward html5
- avi | microsoft simple time

video codec (code and decode) 
- nowaday, video don't usually store frame by frame, but the differences from one frame to the next -> put more work on computation instead of storage -> higher compression rate -> smaller file size 

lossless video is too big for the web. Focus on lossy video codecs -> information is being irretrivably loss during encoding. 


video codec
- Theora - open source - ogg 

- vp8 - google owned 

audio codec 

bandwidth is precious

tricking your ears into not noticing the parts that are missing

Need to make an encoding workflow
- 1 version of WebM (.webm)
- 1 versuib that uses H.264 baseline video and AAC low complexity audio in an MP4 container (.mp4)
- 1 version that uses Theora video and Vorbis audio in an Ogg container (.ogv) `
- link all 3 video files from a single <video> element, and fall back to Flash-based video player. 

Example 

<video width="320" height="240" controls>
  <source src="pr6.mp4"  type="video/mp4; codecs=avc1.42E01E,mp4a.40.2">
  <source src="pr6.webm" type="video/webm; codecs=vp8,vorbis">
  <source src="pr6.ogv"  type="video/ogg; codecs=theora,vorbis">
</video>


See video infor 

mplayer -vo null -ao null -identify -frames 0 

or 

ffprobe -v error -show_format -show_streams a.mp4

ffmpeg -i input.avi -c:v libx264 -crf 23 -c:a aac -movflags faststart output.mp4

# Scratch area

Video router to a id tag instead of file path, look up on database and get the file path

Add tv series using folder and pattern matching

If video_player is focused, change the background for its container

# batch proces

ls | sort -nt'(' -k2
sort -V
