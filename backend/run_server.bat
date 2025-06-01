@echo off
echo Запуск FastAPI сервера...
call venv\Scripts\activate
uvicorn main:app --reload
pause
