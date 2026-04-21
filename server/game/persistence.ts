import IORedis from "ioredis";
import { Queue, Worker } from "bullmq";
import { Pool } from "pg";

// Redis configuration
export const redis = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");

// Postgres configuration
export const db = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/ltw",
});

// Match Complete Queue
export const matchQueue = new Queue("match-complete", { connection: redis });

// Worker for processing completed matches
new Worker(
  "match-complete",
  async (job) => {
    const match = job.data;
    console.log(`Worker: Processing match ${match.id}`);
    
    try {
      await db.query(
        "INSERT INTO matches (id, winner, created_at) VALUES ($1, $2, NOW()) ON CONFLICT (id) DO NOTHING",
        [match.id, match.winnerId]
      );
      console.log(`Worker: Match ${match.id} saved to DB`);
    } catch (err) {
      console.error(`Worker: Error saving match ${match.id} to DB`, err);
    }
  },
  { connection: redis }
);

export async function onMatchEnd(matchId: string, winnerId: string) {
  await matchQueue.add("complete", { id: matchId, winnerId });
}
