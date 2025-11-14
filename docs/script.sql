use loja_db;
create table if not exists produtos(
	 id_produto int primary key auto_increment, 
	 nome_produto varchar(100) not null, 
	 valor_produto decimal(10,2) not null
);


SELECT *from produtos;

create table if not exists clientes(
	 id_cliente int primary key auto_increment, 
	 nome_cliente varchar(100) not null, 
	 cpf_cliente char(11) UNIQUE
);

SELECT *from clientes;

CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido INT NOT NULL AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    data_pedido DATE NOT NULL,
  PRIMARY KEY (id_pedido, id_cliente),
  CONSTRAINT fk_pedidos_clientes FOREIGN KEY (id_cliente)
    REFERENCES clientes (id_cliente)
);

SELECT *from pedidos;


CREATE TABLE IF NOT EXISTS itens_pedido (
    id_item INT NOT NULL AUTO_INCREMENT,
    id_pedido INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade DECIMAL(7,3) NOT NULL,
    valor_item DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id_item),
  CONSTRAINT fk_itens_pedido_pedidos FOREIGN KEY (id_pedido)
    REFERENCES pedidos (id_pedido),
  CONSTRAINT fk_itens_pedido_produtos FOREIGN KEY (id_produto)
    REFERENCES produtos (id_produto)
);


SELECT * from itens_pedido;


-- atualiza o valor_total do pedido caso um item swja alterado
DELIMITER $$
CREATE TRIGGER trg_atualiza_valor_pedido_after_update
AFTER UPDATE ON itens_pedido
FOR EACH ROW
BEGIN
  -- só atualiza se a quantidade ou valor mudarem
  IF NEW.quantidade <> OLD.quantidade
    OR NEW.valor_item <> OLD.valor_item THEN

    UPDATE pedidos
    SET valor_total = valor_total
        -(OLD.quantidade * OLD.valor_item )
        +(NEW.quantidade * NEW.valor_item )
    WHERE id_pedido = NEW.id_pedido;

  END IF;
END $$

use loja_db;
create table if not exists produtos(
	 id_produto int primary key auto_increment, 
	 nome_produto varchar(100) not null, 
	 valor_produto decimal(10,2) not null
);


SELECT *from produtos;

create table if not exists clientes(
	 id_cliente int primary key auto_increment, 
	 nome_cliente varchar(100) not null, 
	 cpf_cliente char(11) UNIQUE
);

SELECT *from clientes;

CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido INT NOT NULL AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    data_pedido DATE NOT NULL,
  PRIMARY KEY (id_pedido, id_cliente),
  CONSTRAINT fk_pedidos_clientes FOREIGN KEY (id_cliente)
    REFERENCES clientes (id_cliente)
);

SELECT *from pedidos;


CREATE TABLE IF NOT EXISTS itens_pedido (
    id_item INT NOT NULL AUTO_INCREMENT,
    id_pedido INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade DECIMAL(7,3) NOT NULL,
    valor_item DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id_item),
  CONSTRAINT fk_itens_pedido_pedidos FOREIGN KEY (id_pedido)
    REFERENCES pedidos (id_pedido),
  CONSTRAINT fk_itens_pedido_produtos FOREIGN KEY (id_produto)
    REFERENCES produtos (id_produto)
);


SELECT * from itens_pedido;



-- atualiza o valor_total do pedido caso um item swja alterado
DELIMITER $$
CREATE TRIGGER trg_atualiza_valor_pedido_after_update
AFTER UPDATE ON itens_pedido
FOR EACH ROW
BEGIN
  -- só atualiza se a quantidade ou valor mudarem
  IF NEW.quantidade <> OLD.quantidade
    OR NEW.valor_item <> OLD.valor_item THEN

    UPDATE pedidos
    SET valor_total = valor_total
        -(OLD.quantidade * OLD.valor_item )
        +(NEW.quantidade * NEW.valor_item )
    WHERE id_pedido = NEW.id_pedido;

  END IF;
END $$

DELIMITER ;






