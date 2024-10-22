# ytComments

midudev channelid: UC8LeXCWOalN8SxlrPcG-PaQ
Andres garza cahnel id: UCSUwTmHIP_rlCTZeQW2oiEg

response:
Title: Patrones de Diseño para Programadores
Video ID: RHqS5kXSmGg
Thumbnail: https://i.ytimg.com/vi/RHqS5kXSmGg/hqdefault.jpg
Description: Esta página te explica Patrones de Diseño en Programación, totalmente en Español! JavaScript, Python, PHP, Golang o ...

uvicorn main:app --reload
ENVIRONMENT=development uvicorn src.main:app --reload
fastapi dev main.py

## CURL

Test Sign up
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

Test Login:
curl -X POST "http://127.0.0.1:8000/token/" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "username=johndoe1@example.com&password=pass123"

Test Logout
curl -X POST "http://127.0.0.1:8000/logout/" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5kb2UxQGV4YW1wbGUuY29tIiwiZXhwIjoxNzI2MTE1Mjc0fQ.iIa5yw4wNfLKcaxx7zqsvq8bKfcO1qn6FMC4XMTGOIY"

Test Acces Protection
curl -X POST "http://127.0.0.1:8000/summarize_comments/" \
-H "Authorization: Bearer sdafsdfdsfasdfcvzxcv" \
-H "Content-Type: application/json" \
-d '{"video_id": "some_video_id", "prompt": "Summarize this video"}'

curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MjY2OTc1NDZ9.kf-fMtpdN7ZzYSJny50O7Zr8vnYJHeq7zqXOIgGg1oQ" http://127.0.0.1:8000/users/1/channels/

curl -X POST http://127.0.0.1:8000/users/1/channels/ \
 -H "Content-Type: application/json" \
 -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MjY2OTc1NDZ9.kf-fMtpdN7ZzYSJny50O7Zr8vnYJHeq7zqXOIgGg1oQ" \
 -d '{"channel_id": "UCNEWCHANNEL123", "user_id": 1}'
