# ytComments

midudev channelid: UC8LeXCWOalN8SxlrPcG-PaQ
Andres garza cahnel id: UCSUwTmHIP_rlCTZeQW2oiEg

response:
Title: Patrones de Diseño para Programadores
Video ID: RHqS5kXSmGg
Thumbnail: https://i.ytimg.com/vi/RHqS5kXSmGg/hqdefault.jpg
Description: Esta página te explica Patrones de Diseño en Programación, totalmente en Español! JavaScript, Python, PHP, Golang o ...

Title: Recurso para entender cualquier código en programación
Video ID: 9eABNJsb3Wk
Thumbnail: https://i.ytimg.com/vi/9eABNJsb3Wk/hqdefault.jpg
Description: Si estás aprendiendo a programar, este recurso es esencial! Compatible con código de Python, JavaScript, C, C++ y Java.

curl -X 'POST' \
 'http://127.0.0.1:8000/summarize_comments/' \
 -H 'Content-Type: application/json' \
 -d '{
"video_id": "YOUR_VIDEO_ID",
"prompt": "Summarize these comments"
}'

curl -X 'POST' \
 'http://127.0.0.1:8000/channel_videos/' \
 -H 'Content-Type: application/json' \
 -d '{
"channel_id": "UCSUwTmHIP_rlCTZeQW2oiEg"
}'
