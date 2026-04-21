import { Server, Socket } from "socket.io";
import { GameInstance } from "./engine";
import { onMatchEnd } from "./persistence";

type PlayerInQueue = {
  socket: Socket;
  id: string;
  mmr: number;
};

let queue: PlayerInQueue[] = [];
const matches = new Map<string, GameInstance>();

export function handleMatchmaking(socket: Socket, io: Server) {
  socket.on("join_queue", (data: { id: string; mmr?: number }) => {
    console.log(`Player ${data.id} joining queue`);
    queue.push({ socket, id: data.id, mmr: data.mmr || 1000 });

    if (queue.length >= 2) {
      const [p1, p2] = queue.splice(0, 2);
      const matchId = `match_${Date.now()}`;

      p1.socket.join(matchId);
      p2.socket.join(matchId);

      const game = new GameInstance(
        matchId,
        [p1.id, p2.id],
        io,
        async (winnerId) => {
          console.log(`Game ${matchId} ended. Winner: ${winnerId}`);
          matches.delete(matchId);
          try {
            await onMatchEnd(matchId, winnerId);
          } catch (err) {
            console.error(`Error adding match ${matchId} to queue`, err);
          }
        }
      );

      matches.set(matchId, game);

      [p1, p2].forEach((p) => {
        p.socket.on("input", (input: { type: "build" | "spawn"; payload?: any }) => {
          game.addInput({
            playerId: p.id,
            type: input.type,
            payload: input.payload,
          });
        });
      });

      io.to(matchId).emit("match_found", { matchId, players: [p1.id, p2.id] });
      game.start();
    }
  });

  socket.on("disconnect", () => {
    queue = queue.filter((p) => p.socket.id !== socket.id);
  });
}
