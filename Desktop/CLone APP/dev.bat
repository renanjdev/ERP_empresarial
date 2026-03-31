@echo off
chcp 65001 >nul
title ERP Dev Tools

:MENU
cls
echo ============================================
echo   ERP - Ferramentas de Desenvolvimento
echo ============================================
echo.
echo  [1] Setup inicial (instalar dependencias)
echo  [2] Iniciar Backend (API Fastify)
echo  [3] Iniciar Frontend (Vue 3 + Vite)
echo  [4] Iniciar tudo (Backend + Frontend)
echo  [5] Rodar testes - Backend
echo  [6] Rodar testes - Frontend
echo  [7] Rodar testes - Tudo
echo  [8] Build de producao
echo  [9] Docker Compose (PostgreSQL + Redis + MinIO)
echo  [10] Prisma - migrations
echo  [11] Prisma - Studio (visualizar banco)
echo  [12] Git - status e log
echo  [13] Abrir documentacao
echo  [0] Sair
echo.
set /p OPCAO="Escolha uma opcao: "

if "%OPCAO%"=="1"  goto SETUP
if "%OPCAO%"=="2"  goto BACKEND
if "%OPCAO%"=="3"  goto FRONTEND
if "%OPCAO%"=="4"  goto TUDO
if "%OPCAO%"=="5"  goto TEST_BACK
if "%OPCAO%"=="6"  goto TEST_FRONT
if "%OPCAO%"=="7"  goto TEST_TUDO
if "%OPCAO%"=="8"  goto BUILD
if "%OPCAO%"=="9"  goto DOCKER
if "%OPCAO%"=="10" goto PRISMA_MIGRATE
if "%OPCAO%"=="11" goto PRISMA_STUDIO
if "%OPCAO%"=="12" goto GIT_STATUS
if "%OPCAO%"=="13" goto DOCS
if "%OPCAO%"=="0"  goto FIM
goto MENU

:: ----------------------------------------
:SETUP
cls
echo [SETUP] Instalando dependencias...
echo.

if exist "backend" (
    echo --- Backend ---
    cd backend
    call npm install
    if not exist ".env" (
        echo Criando .env do backend a partir do exemplo...
        copy .env.example .env
    )
    cd ..
) else (
    echo [AVISO] Pasta 'backend' nao encontrada. Crie o projeto primeiro.
)

if exist "frontend" (
    echo --- Frontend ---
    cd frontend
    call npm install
    if not exist ".env" (
        echo Criando .env do frontend a partir do exemplo...
        copy .env.example .env
    )
    cd ..
) else (
    echo [AVISO] Pasta 'frontend' nao encontrada. Crie o projeto primeiro.
)

echo.
echo [DONE] Setup concluido!
pause
goto MENU

:: ----------------------------------------
:BACKEND
cls
echo [BACKEND] Iniciando API Fastify na porta 3000...
echo.
if exist "backend" (
    start "Backend - API" cmd /k "cd backend && npm run dev"
) else (
    echo [ERRO] Pasta 'backend' nao encontrada.
    pause
)
goto MENU

:: ----------------------------------------
:FRONTEND
cls
echo [FRONTEND] Iniciando Vue 3 + Vite na porta 5173...
echo.
if exist "frontend" (
    start "Frontend - Vue" cmd /k "cd frontend && npm run dev"
) else (
    echo [ERRO] Pasta 'frontend' nao encontrada.
    pause
)
goto MENU

:: ----------------------------------------
:TUDO
cls
echo [TUDO] Iniciando Backend + Frontend...
echo.
if exist "backend" (
    start "Backend - API" cmd /k "cd backend && npm run dev"
    timeout /t 3 /nobreak >nul
)
if exist "frontend" (
    start "Frontend - Vue" cmd /k "cd frontend && npm run dev"
)
echo.
echo Servidores iniciados:
echo   Backend  -> http://localhost:3000
echo   Frontend -> http://localhost:5173
echo   API Docs -> http://localhost:3000/docs
echo.
pause
goto MENU

:: ----------------------------------------
:TEST_BACK
cls
echo [TESTES] Rodando testes do backend (Vitest)...
echo.
if exist "backend" (
    cd backend
    call npm run test
    cd ..
) else (
    echo [ERRO] Pasta 'backend' nao encontrada.
)
pause
goto MENU

:: ----------------------------------------
:TEST_FRONT
cls
echo [TESTES] Rodando testes do frontend (Vitest)...
echo.
if exist "frontend" (
    cd frontend
    call npm run test
    cd ..
) else (
    echo [ERRO] Pasta 'frontend' nao encontrada.
)
pause
goto MENU

:: ----------------------------------------
:TEST_TUDO
cls
echo [TESTES] Rodando todos os testes...
echo.
if exist "backend" (
    echo --- Backend ---
    cd backend
    call npm run test
    cd ..
)
if exist "frontend" (
    echo --- Frontend ---
    cd frontend
    call npm run test
    cd ..
)
pause
goto MENU

:: ----------------------------------------
:BUILD
cls
echo [BUILD] Gerando build de producao...
echo.
if exist "frontend" (
    echo --- Frontend build ---
    cd frontend
    call npm run build
    cd ..
)
if exist "backend" (
    echo --- Backend build ---
    cd backend
    call npm run build
    cd ..
)
echo.
echo [DONE] Build concluido!
pause
goto MENU

:: ----------------------------------------
:DOCKER
cls
echo [DOCKER] Iniciando servicos (PostgreSQL + Redis + MinIO)...
echo.
if exist "docker-compose.yml" (
    docker compose up -d
    echo.
    echo Servicos rodando:
    echo   PostgreSQL -> localhost:5432
    echo   Redis      -> localhost:6379
    echo   MinIO      -> http://localhost:9000  (console: :9001)
    echo.
    echo Para parar: docker compose down
) else (
    echo [AVISO] docker-compose.yml nao encontrado.
    echo Crie o arquivo na raiz do projeto conforme o PLANO_BACKEND.md
)
pause
goto MENU

:: ----------------------------------------
:PRISMA_MIGRATE
cls
echo [PRISMA] Rodando migrations...
echo.
if exist "backend" (
    cd backend
    echo Opcoes:
    echo  [1] prisma migrate dev   (desenvolvimento)
    echo  [2] prisma migrate reset (resetar banco)
    echo  [3] prisma db push       (sincronizar sem migration)
    echo  [4] prisma generate      (gerar client)
    echo.
    set /p PM="Escolha: "
    if "%PM%"=="1" call npx prisma migrate dev
    if "%PM%"=="2" call npx prisma migrate reset
    if "%PM%"=="3" call npx prisma db push
    if "%PM%"=="4" call npx prisma generate
    cd ..
) else (
    echo [ERRO] Pasta 'backend' nao encontrada.
)
pause
goto MENU

:: ----------------------------------------
:PRISMA_STUDIO
cls
echo [PRISMA STUDIO] Abrindo visualizador do banco...
echo.
if exist "backend" (
    start "Prisma Studio" cmd /k "cd backend && npx prisma studio"
    timeout /t 3 /nobreak >nul
    echo Prisma Studio -> http://localhost:5555
) else (
    echo [ERRO] Pasta 'backend' nao encontrada.
)
pause
goto MENU

:: ----------------------------------------
:GIT_STATUS
cls
echo [GIT] Status do repositorio...
echo.
git status
echo.
echo --- Ultimos commits ---
git log --oneline -10
echo.
pause
goto MENU

:: ----------------------------------------
:DOCS
cls
echo [DOCS] Abrindo documentacao...
echo.
start "" "gestaoclick_mapeamento.md"
start "" "PLANO_DESENVOLVIMENTO.md"
start "" "PLANO_BACKEND.md"
echo Arquivos abertos!
pause
goto MENU

:: ----------------------------------------
:FIM
echo.
echo Ate mais!
timeout /t 2 /nobreak >nul
exit
