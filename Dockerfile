FROM python:3.10-slim AS builder

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

FROM python:3.10-slim

WORKDIR /app
COPY --from=builder /root/.local /root/.local

# Install tectonic for LaTeX compilation
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    bzip2 \
    libfontconfig1 \
    && curl --proto '=https' --tlsv1.2 -fsSL https://drop-sh.fullyjustified.net | sh \
    && mv tectonic /usr/local/bin/ \
    && rm -rf /var/lib/apt/lists/*

COPY backend/ ./backend/

ENV PATH=/root/.local/bin:$PATH

# Download spaCy model
RUN python -m spacy download en_core_web_sm
ENV PYTHONPATH=/app

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
