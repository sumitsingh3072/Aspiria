FROM python:3.10-slim AS builder

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

FROM python:3.10-slim

WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY backend/ ./backend/

ENV PATH=/root/.local/bin:$PATH
ENV PYTHONPATH=/app

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
