FROM python:3.11-slim

WORKDIR /app

#  для PostgreSQL
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*


COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


COPY . .

# для логов
RUN mkdir -p /app/logs


RUN ls -la /app/


EXPOSE 5000

# Команда запуска
CMD ["python", "run.py"]