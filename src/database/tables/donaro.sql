-- all the tables and queries needed to run the project. MySQL

CREATE DATABASE donaro;
USE donaro ;

CREATE TABLE IF NOT EXISTS usuario (
  cd_usuario INT NOT NULL AUTO_INCREMENT,
  nm_usuario VARCHAR(45) NOT NULL,
  cd_cpf_usuario VARCHAR(11),
  cd_cnpj_usuario VARCHAR(14),
  dt_nascimento_usuario DATE,
  cd_celular_usuario VARCHAR(11) NOT NULL,
  sg_estado_usuario VARCHAR(2) NOT NULL,
  nm_cidade_usuario VARCHAR(80) NOT NULL,
  cd_foto_usuario VARCHAR(200) DEFAULT 'default.png',
  cd_senha_usuario VARCHAR(200) NOT NULL,
  cd_email_usuario VARCHAR(75) NOT NULL,
  cd_deletado_usuario TINYINT,
  cd_isAdmin_usuario TINYINT NOT NULL DEFAULT 0,
  qt_advertencias_usuario INT NOT NULL DEFAULT 0,
  CONSTRAINT pk_usuario PRIMARY KEY (cd_usuario)
);

CREATE TABLE IF NOT EXISTS pedido (
  cd_pedido INT NOT NULL AUTO_INCREMENT,
  cd_usuario_pedido INT,
  nm_titulo_pedido VARCHAR(45) NOT NULL,
  dt_encerramento_pedido DATETIME NOT NULL,
  dt_createdAt_pedido TIMESTAMP NOT NULL DEFAULT current_timestamp,
  nm_cidade_pedido VARCHAR(45) NOT NULL,
  sg_estado_pedido VARCHAR(2) NOT NULL,
  ds_acao_pedido TEXT NOT NULL,
  cd_deletado_pedido TINYINT,
  qt_total_pedido INT,
  cd_imagem_pedido VARCHAR(255) NOT NULL DEFAULT 'default.png',
  qt_doacoes_pedido INT NOT NULL DEFAULT 0,
  CONSTRAINT pk_pedido PRIMARY KEY (cd_pedido),
  CONSTRAINT fk_pedido_usuario FOREIGN KEY (cd_usuario_pedido)
  REFERENCES usuario(cd_usuario)
  ON DELETE SET NULL
  );

CREATE TABLE IF NOT EXISTS solicitacao (
  cd_solicitacao INT NOT NULL AUTO_INCREMENT,
  cd_pedido_solicitacao INT NOT NULL,
  ds_comentario_solicitacao TEXT,
  dt_createdAt_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  dt_deliveredAt_solicitacao DATETIME,
  cd_situacao_solicitacao VARCHAR(45) DEFAULT 'A CONFIRMAR',
  cd_usuario_solicitacao INT NOT NULL,
  CONSTRAINT pk_solicitacao PRIMARY KEY (cd_solicitacao),
  CONSTRAINT fk_solicitacao_pedido FOREIGN KEY (cd_pedido_solicitacao)
  REFERENCES pedido(cd_pedido),
  CONSTRAINT fk_solicitacao_usuario FOREIGN KEY (cd_usuario_solicitacao)
  REFERENCES usuario(cd_usuario)
);

CREATE TABLE IF NOT EXISTS donation(
	cd_donation INT NOT NULL AUTO_INCREMENT,
	nm_alimento_donation VARCHAR(80),
    qt_contribuicao_donation INT,
    cd_solicitacao_donation INT NOT NULL,
    cd_pedido_donation INT NOT NULL,
    CONSTRAINT pk_donation PRIMARY KEY(cd_donation, cd_solicitacao_donation),
    CONSTRAINT fk_donation_solicitacao FOREIGN KEY(cd_solicitacao_donation)
    REFERENCES solicitacao(cd_solicitacao)
);

CREATE TABLE IF NOT EXISTS notificacao (
	cd_notificacao INT NOT NULL AUTO_INCREMENT, 
	cd_usuario_notificacao INT NOT NULL,
    ds_notificacao TEXT NOT NULL,
    dt_createdAt_notificacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    cd_solicitacao_notificacao INT,
    CONSTRAINT pk_notificacao PRIMARY KEY (cd_notificacao),
    CONSTRAINT fk_notificacao_usuario FOREIGN KEY (cd_usuario_notificacao)
    REFERENCES usuario(cd_usuario),
    CONSTRAINT fk_notificacao_solicitacao FOREIGN KEY (cd_solicitacao_notificacao)
    REFERENCES solicitacao(cd_solicitacao)
);

CREATE TABLE IF NOT EXISTS chat (
  cd_chat INT NOT NULL AUTO_INCREMENT,
  cd_pedido_chat INT NOT NULL,
  cd_solicitacao_chat INT NOT NULL,
  cd_userPedido_chat INT NOT NULL,
  cd_userSoli_chat INT NOT NULL,
  CONSTRAINT pk_chat PRIMARY KEY (cd_chat),
  CONSTRAINT fk_chat_solicitacao FOREIGN KEY (cd_userSoli_chat, cd_solicitacao_chat)
  REFERENCES solicitacao(cd_usuario_solicitacao, cd_solicitacao),
  CONSTRAINT fk_chat_pedido FOREIGN KEY (cd_userPedido_chat, cd_pedido_chat)
  REFERENCES pedido(cd_usuario_pedido, cd_pedido)
 );

CREATE TABLE IF NOT EXISTS mensagem (
  cd_mensagem INT NOT NULL AUTO_INCREMENT,
  ds_conteudo_mensagem VARCHAR(200) NOT NULL,
  cd_chat_mensagem INT NOT NULL,
  cd_usuario_mensagem INT NOT NULL,
  dt_time_mensagem DATETIME NOT NULL DEFAULT current_timestamp,
  CONSTRAINT pk_mensagem PRIMARY KEY (cd_mensagem),
  CONSTRAINT fk_mensagem_chat FOREIGN KEY (cd_chat_mensagem)
  REFERENCES chat(cd_chat),
  CONSTRAINT fk_mensagem_usuario FOREIGN KEY (cd_usuario_mensagem)
  REFERENCES usuario(cd_usuario)
 );
 
 CREATE TABLE IF NOT EXISTS produto (
	cd_produto INT NOT NULL AUTO_INCREMENT,
    nm_produto VARCHAR(90) NOT NULL,
    sg_medida_produto VARCHAR(10) NOT NULL,
    nm_tipoFisico_produto VARCHAR(45) NOT NULL,
    CONSTRAINT pk_produto PRIMARY KEY (cd_produto)
);

CREATE TABLE IF NOT EXISTS alimento (
  nm_alimento VARCHAR(80) NOT NULL,
  cd_pedido_alimento INT NOT NULL,
  nm_medida_alimento VARCHAR(45) NOT NULL,
  qt_alimento INT NOT NULL,
  qt_doada_alimento INT DEFAULT 0,
  CONSTRAINT pk_alimento PRIMARY KEY (nm_alimento, cd_pedido_alimento),
  CONSTRAINT fk_alimento_pedido FOREIGN KEY (cd_pedido_alimento)
  REFERENCES pedido(cd_pedido)
);

CREATE TABLE IF NOT EXISTS denuncia (
	cd_denuncia INT NOT NULL AUTO_INCREMENT,
	cd_usuario_denuncia INT NOT NULL,
    nm_motivo_denuncia VARCHAR(100) NOT NULL,
    nm_situacao_denuncia VARCHAR(45) NOT NULL DEFAULT 'Pendente',
    dt_createdAt_denuncia DATETIME DEFAULT CURRENT_TIMESTAMP,
    ds_descricao_denuncia TEXT NOT NULL,
    cd_pedido_denunciado INT,
    cd_usuario_denunciado INT,
    cd_solicitacao_denunciada INT,
    CONSTRAINT pk_denuncia PRIMARY KEY(cd_denuncia),
    CONSTRAINT fk_denuncia_usuario FOREIGN KEY (cd_usuario_denuncia)
    REFERENCES usuario (cd_usuario),
    CONSTRAINT fk_denuncia_pedido FOREIGN KEY (cd_pedido_denunciado)
    REFERENCES pedido (cd_pedido),
    CONSTRAINT fk_denuncia_solicitacao FOREIGN KEY (cd_solicitacao_denunciada)
    REFERENCES solicitacao (cd_solicitacao)
);

-- drop database donaro;