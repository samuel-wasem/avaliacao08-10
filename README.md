AVALIAÇÃO DE FLASHCARDS — RESPOSTAS DA PARTE TEÓRICA
Node.js e Fastify — Seção 7 do roteiro

Resposta: B.
Um ambiente de execução que roda JavaScript fora do navegador, baseado no motor V8.

2. Resposta: C.
Usa I/O não bloqueante com um event loop. Enquanto espera o resultado de uma operação, continua atendendo outras requisições.

3. Resposta: A.
npm install

4. Resposta: D.
devDependencies são usadas durante o desenvolvimento, como compilação, testes e modo watch. dependencies são necessárias para a aplicação funcionar.

5. Resposta: B.
Pausa somente aquela função async até a Promise ser resolvida, sem bloquear o event loop.

6. Resposta: A.
Um framework web para Node.js focado em desempenho, com sistema de plugins e validação de rotas por schema.

7. Resposta: C.
Registra um plugin, a função com as rotas de cards, na aplicação Fastify.

8. Resposta: D.
ID: request.params.id
Modo: request.query.modo
Nota: request.body.grade

9. Resposta: B.
Responde ao cliente com o código HTTP 201 (Created) e o card no corpo da resposta, em JSON.

10. Resposta: C.
Valida o body antes de executar o handler, responde 400 automaticamente se ele for inválido e tipa request.body no TypeScript.
