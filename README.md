<br>
<p align="center">
  <img src="https://i.imgur.com/SaiVvCZ.png" width="400px" heigth="400px">
</p>
<h3 align="center">
  Impulsionando campanhas de combate à fome!
  <!-- Boosting hunger-fighting campaigns !-->
</h3>

<h2>💻 O que é?</h2>

O **Donaro** é uma plataforma desenvolvida na ETEC Aristóteles Ferreira (Brasil, Santos-SP) como trabalho de conclusão de curso. Seu objetivo é impulsionar campanhas de combate à fome, conectando as pessoas que pretendem doar alimentos com quem se mobiliza para arrecadá-los e distribuir para pessoas necessitadas.<br><br>
**Link do vídeo da apresentação do projeto:** <a href="https://youtu.be/fDCPJaXxt7s">https://youtu.be/fDCPJaXxt7s</a>

<h2>🙋 Desenvolvedores</h2>

**Pedro Petenucci**: Backend e Banco de Dados<br>
<a target="_blank" href="https://www.linkedin.com/in/pedropetenucci/">
  <img alt="Linkedin badge" src="https://img.shields.io/badge/-Pedro%20Petenucci-0077B5?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/pedropetenucci/" />
</a>

**Yago Mouro**: Frontend<br>
<a target="_blank" href="https://www.linkedin.com/in/yagomouro/">
  <img alt="Linkedin badge" src="https://img.shields.io/badge/-Yago%20Mouro-0077B5?style=flat-square&logo=Linkedin&logoColor=white&link=https://https://www.linkedin.com/in/yagomouro/" />
</a>

**Nathan Carvalho**: Layout<br>
<a target="_blank" href="https://www.linkedin.com/in/nathancarvalho/">
  <img alt="Linkedin badge" src="https://img.shields.io/badge/-Nathan%20Carvalho-0077B5?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/nathancarvalho/">
</a>

<h2>🚀 Como rodar?</h2>

<h3>Requisitos para rodar o projeto:</h3>
<ul>
  <li>Instalar o NodeJS (https://nodejs.org/en/)</li>
  <li>Instalar o MySQL (qualquer versão acima da 5.6)</li>
</ul>
<h3>Procedimentos:</h3>
<ul>
  <li>Baixe ou clone o projeto para o seu computador.</li>
</ul>

```bash
  $ git clone https://github.com/pednucci/donaro.git
```
  

<ul>
  <li>Crie uma conexão com o banco de dados no MySQL e execute o script "donaro.sql" para a criação das tabelas dentro da pasta "tables" em "database"
    <a href="https://github.com/pednucci/donaro/tree/master/src/database/tables"><i><strong>(donaro/src/database/tables/donaro.sql)</strong></i></a></li>
  <li>No diretório raíz do projeto, crie um arquivo com o nome .env (você pode copiar o .env.example e mudar seu nome para .env)</li>
  <li>Copie as informações do arquivo .env.example para o .env</li>
  <li>Dentro do .env, preencha os campos com início DB com as informações da conexão com o banco de dados que você criou no MySQL,
    e em SECRET, escreva qualquer coisa, essa variável de ambiente é o segredo da sessão, ele serve para calcular o hash da sessão.
    <strong>Siga o exemplo abaixo:</strong></li>
</ul>

 ```bash
  DB_HOST=localhost
  DB_NAME=donaro
  DB_USER=root
  DB_PASS=root
  SECRET=19ejasdjn21sjia1
 ```
<ul>
  <li>Abra o CMD (ou bash) e dentro dele entre no diretório do projeto</li>
  <li>Após isso, digite o que está no exemplo abaixo, nessa mesma ordem:</li>
</ul>

```bash
# Instalar as dependências
$ npm install

# Iniciar o projeto
$ npm start
```
