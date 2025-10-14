import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'tickettoride',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export class DatabaseService {
  // Jogadores
  static async createPlayer(username, email, passwordHash) {
    const query = `
      INSERT INTO players (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at
    `;
    const result = await pool.query(query, [username, email, passwordHash]);
    
    // Inicializar estatísticas
    await pool.query('INSERT INTO player_stats (player_id) VALUES ($1)', [result.rows[0].id]);
    
    return result.rows[0];
  }

  static async getPlayerByUsername(username) {
    const query = 'SELECT * FROM players WHERE username = $1';
    const result = await pool.query(query, [username]);
    return result.rows[0];
  }

  static async getPlayerStats(playerId) {
    const query = 'SELECT * FROM player_stats WHERE player_id = $1';
    const result = await pool.query(query, [playerId]);
    return result.rows[0];
  }

  static async getPlayerRanking(limit = 10) {
    const query = 'SELECT * FROM player_ranking LIMIT $1';
    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  // Partidas
  static async createGame(gameCode) {
    const query = `
      INSERT INTO games (game_code, status)
      VALUES ($1, 'waiting')
      RETURNING id, game_code, status, created_at
    `;
    const result = await pool.query(query, [gameCode]);
    return result.rows[0];
  }

  static async updateGameStatus(gameId, status, winnerId = null) {
    const query = `
      UPDATE games 
      SET status = $1, 
          winner_id = $2,
          started_at = CASE WHEN $1 = 'playing' AND started_at IS NULL THEN CURRENT_TIMESTAMP ELSE started_at END,
          finished_at = CASE WHEN $1 = 'finished' THEN CURRENT_TIMESTAMP ELSE finished_at END
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [status, winnerId, gameId]);
    return result.rows[0];
  }

  static async addPlayerToGame(gameId, playerId, playerColor) {
    const query = `
      INSERT INTO game_players (game_id, player_id, player_color)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [gameId, playerId, playerColor]);
    return result.rows[0];
  }

  static async updatePlayerScore(gameId, playerId, finalScore, trainPiecesLeft, longestPathLength) {
    const query = `
      UPDATE game_players
      SET final_score = $3, train_pieces_left = $4, longest_path_length = $5
      WHERE game_id = $1 AND player_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [gameId, playerId, finalScore, trainPiecesLeft, longestPathLength]);
    return result.rows[0];
  }

  // Rotas
  static async saveClaimedRoute(gameId, playerId, routeData) {
    const query = `
      INSERT INTO claimed_routes (game_id, player_id, route_id, city1, city2, color, length, points_earned)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const result = await pool.query(query, [
      gameId,
      playerId,
      routeData.id,
      routeData.city1,
      routeData.city2,
      routeData.color,
      routeData.length,
      routeData.points
    ]);
    return result.rows[0];
  }

  // Bilhetes de Destino
  static async saveDestinationTicket(gameId, playerId, ticketData, completed = false) {
    const query = `
      INSERT INTO destination_tickets (game_id, player_id, ticket_id, city_from, city_to, points, completed)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await pool.query(query, [
      gameId,
      playerId,
      ticketData.id,
      ticketData.from,
      ticketData.to,
      ticketData.points,
      completed
    ]);
    return result.rows[0];
  }

  static async updateDestinationTicketCompletion(gameId, playerId, ticketId, completed) {
    const query = `
      UPDATE destination_tickets
      SET completed = $4
      WHERE game_id = $1 AND player_id = $2 AND ticket_id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [gameId, playerId, ticketId, completed]);
    return result.rows[0];
  }

  // Histórico
  static async getGameHistory(limit = 20) {
    const query = 'SELECT * FROM game_history LIMIT $1';
    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  static async getPlayerGameHistory(playerId, limit = 10) {
    const query = `
      SELECT g.*, gp.final_score, gp.player_color,
             CASE WHEN g.winner_id = $1 THEN true ELSE false END as won
      FROM games g
      JOIN game_players gp ON g.id = gp.game_id
      WHERE gp.player_id = $1
      ORDER BY g.created_at DESC
      LIMIT $2
    `;
    const result = await pool.query(query, [playerId, limit]);
    return result.rows;
  }

  // Testar conexão
  static async testConnection() {
    try {
      const result = await pool.query('SELECT NOW()');
      console.log('✅ Conexão com banco de dados estabelecida:', result.rows[0].now);
      return true;
    } catch (error) {
      console.error('❌ Erro ao conectar ao banco de dados:', error.message);
      return false;
    }
  }

  // Fechar pool de conexões
  static async close() {
    await pool.end();
  }
}

export default DatabaseService;
