-- CreateTable
CREATE TABLE "experiments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "responses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "experiment_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "temperature" REAL NOT NULL,
    "top_p" REAL NOT NULL,
    "max_tokens" INTEGER NOT NULL,
    "presence_penalty" REAL NOT NULL,
    "frequency_penalty" REAL NOT NULL,
    "tokens_used" INTEGER NOT NULL,
    "latency_ms" INTEGER NOT NULL,
    "metrics_overall" REAL NOT NULL,
    "metrics_length" REAL NOT NULL,
    "metrics_coherence" REAL NOT NULL,
    "metrics_structure" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "responses_experiment_id_fkey" FOREIGN KEY ("experiment_id") REFERENCES "experiments" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
