GRANFACE ODONTOLOGIA — DEMONSTRAÇÃO FRONT-END

VERSAO ONLINE
Apresentacao: https://guiisantozs.github.io/granface-odontologia/
Repositorio publico: https://github.com/guiisantozs/granface-odontologia
Publicacao automatica: cada push na branch main compila o projeto e atualiza o GitHub Pages.
O GitHub Pages publica somente os arquivos estaticos gerados em dist/.
Para executar os testes contra a versao online no PowerShell:
$env:GRANFACE_TEST_URL='https://guiisantozs.github.io/granface-odontologia/'; npx playwright test

COMO ABRIR
Clique duas vezes em ABRIR-GRANFACE.cmd.
O navegador abrirá o endereço informado pelo Vite (normalmente http://127.0.0.1:4173).
Mantenha a janela do terminal aberta durante a apresentação.
É necessário Node.js instalado. As dependências já estão instaladas nesta pasta.

COMANDOS
npm install           Instalar dependências em outro computador.
npm run dev           Iniciar apresentação local.
npm run build         Verificar TypeScript e gerar a versão estática em dist/.
npm run preview       Servir a versão compilada.
npx playwright test   Executar as verificações de interação no Chrome instalado.
Para os testes, deixe npm run dev rodando em http://127.0.0.1:5173.

COMPARTILHAR SEM HOSPEDAGEM (WINDOWS)
Pacote pronto: entrega/GRANFACE-APRESENTACAO-WINDOWS.zip (aproximadamente 4,7 MB).
Envie esse ZIP, extraia por completo e execute ABRIR-GRANFACE.cmd dentro da pasta extraida.
O pacote utiliza PowerShell/.NET do Windows para servir os arquivos apenas em 127.0.0.1.
Nao requer Node.js, npm, Python, instalacao de dependencias ou conexao com a internet.
Mantenha a janela do terminal aberta durante o uso. Feche-a para encerrar.
Para recriar depois de alteracoes: npm run build e powershell -NoProfile -File scripts/package-portable.ps1.

PARA GRAVAR
Use Chrome ou Edge com aceleração gráfica habilitada, zoom de 100% e janela maximizada.
Aguarde o dente 3D aparecer. Percorra a página lentamente para mostrar as entradas.
Passe pelos cinco tratamentos; use as setas dos especialistas; explore objetivos,
tons, dentes e ângulos no simulador; arraste o comparador e complete o formulário.

ESCOPO
Todo o comportamento acontece no navegador, com React e estados locais.
Sem back-end, banco de dados, autenticação, WhatsApp, envio ou armazenamento de dados.
O formulário apenas valida os campos e abre um modal demonstrativo.
Nenhum agendamento real é realizado. Nenhum diagnóstico ou cálculo clínico é produzido.

REFERÊNCIA E ATIVOS
O layout foi implementado a partir da análise dos frames de odo.mp4, com a sequência
e a organização das seções, adaptando azul/branco para preto/dourado da Granface.
Frames para conferência: reference/contact-sheet.jpg e reference/frame-*.jpg.
O vídeo original tem 720×540 pixels e inclui moldura e transições de apresentação;
a página reproduz o conteúdo do site, sem a moldura do vídeo.
A logo original fornecida foi copiada para public/assets/granface-original.jpg.
O cabeçalho e o rodapé usam public/assets/granface-transparent.png, versão com fundo removido da logo fornecida, mantendo o recorte visual por CSS.
O dente e as arcadas são modelos próprios em Three.js, sem ativos do site de referência.
Os objetos dos tratamentos foram renderizados dos modelos 3D próprios e animados por CSS.
Renderizações locais: public/assets/model-tooth.png, model-arch.png, model-implant.png.
O elemento decorativo de arcada no formulário é um vetor original.

VALIDAÇÃO
Compilação TypeScript e Vite concluída com sucesso.
Dois testes completos no Chrome aprovados: desktop 1440×900 e mobile 390×844 com toque.
Verificados: seções, imagens locais, expansão dos cinco cards, carrossel,
objetivos/tons/ângulos/rotação e seleção de dentes 3D, comparador por mouse/teclado/toque,
formulário, modal centralizado, fechamento por Escape e ausência de overflow horizontal.
Também verificada a ausência de erros JavaScript, chamadas externas durante o uso
e armazenamento em localStorage/sessionStorage.
Capturas da última validação: test-results/.

Fotografias de banco são ilustrativas, sem vínculo com a clínica ou profissionais reais.
Os perfis exibem áreas de atuação, sem nomes ou credenciais inventados.
O comparador usa dois estados gerados por IA da mesma pessoa fictícia, no mesmo enquadramento: dentes amarelados e desalinhados à esquerda, sorriso alinhado e claro à direita.
As imagens são ilustrativas e não representam resultados clínicos. Não há depoimentos falsos.
Ativo: public/assets/smile-comparison-pair.png. Prompts e modo de geração: docs/image-prompts.txt.
Contato, endereço e redes sociais ficam identificados como demonstrativos.

FONTES E LICENÇAS DAS FOTOGRAFIAS
Consultório: Kari Bjorn Photography / Unsplash
https://unsplash.com/photos/a-dental-room-with-a-desk-and-chairs-Fdku_oMrDvk
Sorriso: Lesly Juarez / Unsplash
https://unsplash.com/photos/long-black-haired-woman-smiling-close-up-photography-1AhGNGKuhR0
Licença: https://unsplash.com/license
Perfil 1: Klaus Nielsen / Pexels
https://www.pexels.com/photo/doctor-in-uniform-with-stethoscope-in-clinic-6303550/
Perfil 2: Gustavo Fring / Pexels
https://www.pexels.com/photo/portrait-of-smiling-doctor-7446991/
Perfil 3: Tessy Agbonome / Pexels
https://www.pexels.com/photo/smiling-doctor-portrait-19963165/
Licença: https://www.pexels.com/license/
Todas as fotografias estão incluídas localmente em public/assets/.
