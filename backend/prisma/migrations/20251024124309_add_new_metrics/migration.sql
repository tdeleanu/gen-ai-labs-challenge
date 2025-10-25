/*
  Warnings:

  - You are about to drop the column `frequency_penalty` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the column `presence_penalty` on the `responses` table. All the data in the column will be lost.
  - Added the required column `metrics_completeness` to the `responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metrics_readability` to the `responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metrics_specificity` to the `responses` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_responses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "experiment_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "temperature" REAL NOT NULL,
    "top_p" REAL NOT NULL,
    "max_tokens" INTEGER NOT NULL,
    "tokens_used" INTEGER NOT NULL,
    "latency_ms" INTEGER NOT NULL,
    "metrics_overall" REAL NOT NULL,
    "metrics_length" REAL NOT NULL,
    "metrics_coherence" REAL NOT NULL,
    "metrics_structure" REAL NOT NULL,
    "metrics_readability" REAL NOT NULL,
    "metrics_completeness" REAL NOT NULL,
    "metrics_specificity" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "responses_experiment_id_fkey" FOREIGN KEY ("experiment_id") REFERENCES "experiments" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_responses" ("created_at", "experiment_id", "id", "latency_ms", "max_tokens", "metrics_coherence", "metrics_length", "metrics_overall", "metrics_structure", "temperature", "text", "tokens_used", "top_p") SELECT "created_at", "experiment_id", "id", "latency_ms", "max_tokens", "metrics_coherence", "metrics_length", "metrics_overall", "metrics_structure", "temperature", "text", "tokens_used", "top_p" FROM "responses";
DROP TABLE "responses";
ALTER TABLE "new_responses" RENAME TO "responses";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
