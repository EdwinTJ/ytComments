# ytComments

midudev channelid: UC8LeXCWOalN8SxlrPcG-PaQ
Andres garza cahnel id: UCSUwTmHIP_rlCTZeQW2oiEg

response:
Title: Patrones de Diseño para Programadores
Video ID: RHqS5kXSmGg
Thumbnail: https://i.ytimg.com/vi/RHqS5kXSmGg/hqdefault.jpg
Description: Esta página te explica Patrones de Diseño en Programación, totalmente en Español! JavaScript, Python, PHP, Golang o ...

uvicorn main:app --reload

## CURL

curl -X POST "http://127.0.0.1:8000/users/" \
 -H "Content-Type: application/json" \
 -d '{"name": "John Doe1", "email": "johndoe1@example.com","password":"pass123"}'

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

curl -X GET "http://127.0.0.1:8000/users/1"
