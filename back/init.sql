-- sql setup
SELECT 'CREATE DATABASE estoque'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'estoque')\gexec

\connect estoque gelson

CREATE TABLE IF NOT EXISTS produtos (
    id_prod SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    quantidade DECIMAL(10, 2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS compra (
    id_compra SERIAL PRIMARY KEY,
    id_prod INT,
    vendedor VARCHAR(255) NOT NULL,
    quantidade DECIMAL(10, 2) NOT NULL,
    valor_unitario NUMERIC(10, 2) NOT NULL,
    valor_total NUMERIC(10, 2),
    data_compra DATE DEFAULT CURRENT_DATE,
    data_pagamento DATE DEFAULT CURRENT_DATE,
    CONSTRAINT fk_produto FOREIGN KEY(id_prod) REFERENCES produtos(id_prod)
);

CREATE TABLE IF NOT EXISTS venda (
    id_venda SERIAL PRIMARY KEY,
    id_prod INT,
    comprador VARCHAR(255) NOT NULL,
    quantidade DECIMAL(10, 2) NOT NULL,
    valor_unitario NUMERIC(10, 2) NOT NULL,
    valor_total NUMERIC(10, 2),
    data_venda DATE DEFAULT CURRENT_DATE,
    data_recebimento DATE DEFAULT CURRENT_DATE,
    CONSTRAINT fk_produto FOREIGN KEY(id_prod) REFERENCES produtos(id_prod)
);

-- functions
CREATE OR REPLACE FUNCTION log_calc_total()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.quantidade IS NOT NULL AND NEW.valor_unitario IS NOT NULL THEN
        NEW.valor_total = NEW.quantidade * NEW.valor_unitario;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_qnt_compra()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE produtos
    SET quantidade = quantidade + NEW.quantidade
    WHERE id_prod = NEW.id_prod;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_qnt_venda()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE produtos
    SET quantidade = quantidade - NEW.quantidade
    WHERE id_prod = NEW.id_prod;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_qnt_upd_compra()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE produtos
    SET quantidade = quantidade + (NEW.quantidade - OLD.quantidade)
    WHERE id_prod = NEW.id_prod;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_qnt_upd_venda()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE produtos
    SET quantidade = quantidade - (NEW.quantidade - OLD.quantidade)
    WHERE id_prod = NEW.id_prod;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_qnt_dlt_compra()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE produtos
    SET quantidade = quantidade - OLD.quantidade
    WHERE id_prod = OLD.id_prod;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_qnt_dlt_venda()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE produtos
    SET quantidade = quantidade + OLD.quantidade
    WHERE id_prod = OLD.id_prod;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- triggers
CREATE TRIGGER trg_calc_total_compra
BEFORE INSERT OR UPDATE ON compra
FOR EACH ROW
EXECUTE FUNCTION log_calc_total();

CREATE TRIGGER trg_calc_total_venda
BEFORE INSERT OR UPDATE ON venda
FOR EACH ROW
EXECUTE FUNCTION log_calc_total();

CREATE TRIGGER trg_qnt_compra
AFTER INSERT ON compra
FOR EACH ROW
EXECUTE FUNCTION log_qnt_compra();

CREATE TRIGGER trg_qnt_venda
AFTER INSERT ON venda
FOR EACH ROW
EXECUTE FUNCTION log_qnt_venda();

CREATE TRIGGER trg_qnt_upd_compra
AFTER UPDATE ON compra
FOR EACH ROW
EXECUTE FUNCTION log_qnt_upd_compra();

CREATE TRIGGER trg_qnt_upd_venda
AFTER UPDATE ON venda
FOR EACH ROW
EXECUTE FUNCTION log_qnt_upd_venda();

CREATE TRIGGER trg_qnt_dlt_compra
AFTER DELETE ON compra
FOR EACH ROW
EXECUTE FUNCTION log_qnt_dlt_compra();

CREATE TRIGGER trg_qnt_dlt_venda
AFTER DELETE ON venda
FOR EACH ROW
EXECUTE FUNCTION log_qnt_dlt_venda();