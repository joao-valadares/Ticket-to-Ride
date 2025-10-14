-- Script de inicialização do banco de dados Ticket to Ride - Brasil

-- Criar banco de dados (executar como superuser)
-- CREATE DATABASE tickettoride;

-- Conectar ao banco de dados
-- \c tickettoride;

-- Tabela de Jogadores
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Tabela de Partidas
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    game_code VARCHAR(10) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('waiting', 'playing', 'finished')),
    winner_id INTEGER REFERENCES players(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    finished_at TIMESTAMP
);

-- Tabela de Participação em Partidas
CREATE TABLE IF NOT EXISTS game_players (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES players(id),
    player_color VARCHAR(20) NOT NULL,
    final_score INTEGER DEFAULT 0,
    train_pieces_left INTEGER DEFAULT 45,
    longest_path_length INTEGER DEFAULT 0,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(game_id, player_id)
);

-- Tabela de Rotas Reivindicadas
CREATE TABLE IF NOT EXISTS claimed_routes (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES players(id),
    route_id VARCHAR(10) NOT NULL,
    city1 VARCHAR(50) NOT NULL,
    city2 VARCHAR(50) NOT NULL,
    color VARCHAR(20) NOT NULL,
    length INTEGER NOT NULL,
    points_earned INTEGER NOT NULL,
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Bilhetes de Destino
CREATE TABLE IF NOT EXISTS destination_tickets (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES players(id),
    ticket_id VARCHAR(10) NOT NULL,
    city_from VARCHAR(50) NOT NULL,
    city_to VARCHAR(50) NOT NULL,
    points INTEGER NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    drawn_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Estatísticas de Jogadores
CREATE TABLE IF NOT EXISTS player_stats (
    player_id INTEGER PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
    total_games INTEGER DEFAULT 0,
    total_wins INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    highest_score INTEGER DEFAULT 0,
    total_routes_claimed INTEGER DEFAULT 0,
    total_destinations_completed INTEGER DEFAULT 0,
    longest_path_ever INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_games_created_at ON games(created_at DESC);
CREATE INDEX idx_game_players_game ON game_players(game_id);
CREATE INDEX idx_game_players_player ON game_players(player_id);
CREATE INDEX idx_claimed_routes_game ON claimed_routes(game_id);
CREATE INDEX idx_claimed_routes_player ON claimed_routes(player_id);
CREATE INDEX idx_destination_tickets_game ON destination_tickets(game_id);
CREATE INDEX idx_destination_tickets_player ON destination_tickets(player_id);

-- Função para atualizar estatísticas do jogador
CREATE OR REPLACE FUNCTION update_player_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar estatísticas quando um jogo termina
    IF NEW.status = 'finished' AND OLD.status != 'finished' THEN
        -- Atualizar para todos os jogadores da partida
        UPDATE player_stats ps
        SET 
            total_games = total_games + 1,
            total_wins = total_wins + CASE WHEN gp.player_id = NEW.winner_id THEN 1 ELSE 0 END,
            total_score = total_score + gp.final_score,
            highest_score = GREATEST(highest_score, gp.final_score),
            longest_path_ever = GREATEST(longest_path_ever, gp.longest_path_length),
            updated_at = CURRENT_TIMESTAMP
        FROM game_players gp
        WHERE gp.game_id = NEW.id AND gp.player_id = ps.player_id;
        
        -- Atualizar rotas e destinos completados
        UPDATE player_stats ps
        SET 
            total_routes_claimed = total_routes_claimed + (
                SELECT COUNT(*) FROM claimed_routes cr 
                WHERE cr.game_id = NEW.id AND cr.player_id = ps.player_id
            ),
            total_destinations_completed = total_destinations_completed + (
                SELECT COUNT(*) FROM destination_tickets dt 
                WHERE dt.game_id = NEW.id AND dt.player_id = ps.player_id AND dt.completed = TRUE
            )
        WHERE ps.player_id IN (SELECT player_id FROM game_players WHERE game_id = NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar estatísticas
CREATE TRIGGER trigger_update_player_stats
AFTER UPDATE ON games
FOR EACH ROW
EXECUTE FUNCTION update_player_stats();

-- Inserir alguns jogadores de exemplo (senha: 'password123' - hash simplificado para exemplo)
INSERT INTO players (username, email, password_hash) VALUES
    ('JoaoPedro', 'joao@exemplo.com', 'hash_exemplo_123'),
    ('AnnaBeatriz', 'anna@exemplo.com', 'hash_exemplo_123'),
    ('Rafael', 'rafael@exemplo.com', 'hash_exemplo_123'),
    ('Matheus', 'matheus@exemplo.com', 'hash_exemplo_123'),
    ('Ricardo', 'ricardo@exemplo.com', 'hash_exemplo_123')
ON CONFLICT (username) DO NOTHING;

-- Inicializar estatísticas para os jogadores
INSERT INTO player_stats (player_id)
SELECT id FROM players
ON CONFLICT (player_id) DO NOTHING;

-- Views úteis

-- View de ranking de jogadores
CREATE OR REPLACE VIEW player_ranking AS
SELECT 
    p.id,
    p.username,
    ps.total_games,
    ps.total_wins,
    CASE WHEN ps.total_games > 0 
        THEN ROUND((ps.total_wins::NUMERIC / ps.total_games::NUMERIC) * 100, 2)
        ELSE 0 
    END as win_percentage,
    ps.highest_score,
    ps.total_routes_claimed,
    ps.total_destinations_completed,
    ps.longest_path_ever
FROM players p
LEFT JOIN player_stats ps ON p.id = ps.player_id
ORDER BY ps.total_wins DESC, ps.highest_score DESC;

-- View de histórico de partidas
CREATE OR REPLACE VIEW game_history AS
SELECT 
    g.id as game_id,
    g.game_code,
    g.status,
    g.created_at,
    g.finished_at,
    w.username as winner,
    COUNT(DISTINCT gp.player_id) as player_count,
    MAX(gp.final_score) as highest_score
FROM games g
LEFT JOIN players w ON g.winner_id = w.id
LEFT JOIN game_players gp ON g.id = gp.game_id
GROUP BY g.id, g.game_code, g.status, g.created_at, g.finished_at, w.username
ORDER BY g.created_at DESC;

COMMENT ON TABLE players IS 'Armazena informações dos jogadores cadastrados';
COMMENT ON TABLE games IS 'Armazena informações das partidas';
COMMENT ON TABLE game_players IS 'Relaciona jogadores às partidas';
COMMENT ON TABLE claimed_routes IS 'Armazena as rotas reivindicadas durante as partidas';
COMMENT ON TABLE destination_tickets IS 'Armazena os bilhetes de destino de cada jogador';
COMMENT ON TABLE player_stats IS 'Estatísticas acumuladas dos jogadores';
