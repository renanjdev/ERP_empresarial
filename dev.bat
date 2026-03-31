@echo off
chcp 65001 >nul
title ERP - Dev Tools

:MENU
cls
echo ============================================
echo   ERP Empresarial — Ferramentas de Dev
echo ============================================
echo.
echo  SETUP
echo  [1] Instalar todas as dependencias (root + server + client)
echo  [2] Configurar .env do servidor
echo.
echo  EXECUTAR
echo  [3] Iniciar tudo  (Backend + Frontend juntos)
echo  [4] Iniciar apenas Backend  (porta 3000)
echo  [5] Iniciar apenas Frontend (porta 5173)
echo.
echo  BANCO DE DADOS
echo  [6] Prisma migrate dev  (criar/atualizar tabelas)
echo  [7] Prisma db seed      (popular dados iniciais)
echo  [8] Prisma Studio       (visualizar banco - porta 5555)
echo  [9] Prisma generate     (regenerar client)
echo.
echo  TESTES
echo  [10] Rodar testes - Backend (Vitest)
echo  [11] Rodar testes - Frontend (Vitest)
echo.
echo  BUILD
echo  [12] Build de producao (Frontend)
echo  [13] Build de producao (Backend)
echo.
echo  GIT
echo  [14] Git status + log
echo  [15] Git pull (atualizar repo)
echo.
echo  [0] Sair
echo.
set /p OPCAO="Escolha uma opcao: "

if "%OPCAO%"=="1"  goto SETUP
if "%OPCAO%"=="2"  goto ENV
if "%OPCAO%"=="3"  goto DEV_TUDO
if "%OPCAO%"=="4"  goto DEV_BACK
if "%OPCAO%"=="5"  goto DEV_FRONT
if "%OPCAO%"=="6"  goto DB_MIGRATE
if "%OPCAO%"=="7"  goto DB_SEED
if "%OPCAO%"=="8"  goto PRISMA_STUDIO
if "%OPCAO%"=="9"  goto PRISMA_GEN
if "%OPCAO%"=="10" goto TEST_BACK
if "%OPCAO%"=="11" goto TEST_FRONT
if "%OPCAO%"=="12" goto BUILD_FRONT
if "%OPCAO%"=="13" goto BUILD_BACK
if "%OPCAO%"=="14" goto GIT_STATUS
if "%OPCAO%"=="15" goto GIT_PULL
if "%OPCAO%"=="0"  goto FIM
goto MENU

:: ----------------------------------------
:SETUP
cls
echo [SETUP] Instalando dependencias...
echo.
echo --- Root (concurrently) ---
call npm install
echo.
echo --- Server ---
cd server
call npm install
cd ..
echo.
echo --- Client ---
cd client
call npm install
cd ..
echo.
echo [DONE] Dependencias instaladas!
echo.
echo Proximo passo: configure o .env (opcao 2) e rode as migrations (opcao 6).
pause
goto MENU

:: ----------------------------------------
:ENV
cls
echo [ENV] Configurando variaveis de ambiente do servidor...
echo.
if not exist "server\.env" (
    if exist ".env.example" (
        copy ".env.example" "server\.env"
        echo Arquivo server\.env criado a partir de .env.example
    ) else (
        echo Criando server\.env com valores padrao...
        (
            echo NODE_ENV=development
            echo PORT=3000
            echo DATABASE_URL=postgresql://erp:erp_secret@localhost:5432/erp_db
            echo JWT_SECRET=mude_este_secret_antes_de_usar_em_producao
            echo JWT_EXPIRES_IN=15m
            echo REFRESH_TOKEN_EXPIRES_IN=7d
            echo CLIENT_URL=http://localhost:5173
        ) > "server\.env"
    )
    echo.
    echo [!] Edite server\.env com suas configuracoes antes de continuar.
    start notepad "server\.env"
) else (
    echo [!] server\.env ja existe. Abrindo para edicao...
    start notepad "server\.env"
)
pause
goto MENU

:: ----------------------------------------
:DEV_TUDO
cls
echo [DEV] Iniciando Backend + Frontend...
echo.
start "Backend  - localhost:3000" cmd /k "cd /d %~dp0 && cd server && npm run dev"
timeout /t 2 /nobreak >nul
start "Frontend - localhost:5173" cmd /k "cd /d %~dp0 && cd client && npm run dev"
echo.
echo Servidores iniciados:
echo   API      -^> http://localhost:3000
echo   Frontend -^> http://localhost:5173
echo.
pause
goto MENU

:: ----------------------------------------
:DEV_BACK
cls
echo [BACKEND] Iniciando Fastify na porta 3000...
start "Backend - API" cmd /k "cd /d %~dp0server && npm run dev"
echo Acesse: http://localhost:3000
pause
goto MENU

:: ----------------------------------------
:DEV_FRONT
cls
echo [FRONTEND] Iniciando Vite na porta 5173...
start "Frontend - Vue" cmd /k "cd /d %~dp0client && npm run dev"
echo Acesse: http://localhost:5173
pause
goto MENU

:: ----------------------------------------
:DB_MIGRATE
cls
echo [PRISMA] Rodando migrate dev...
echo.
cd server
call npx prisma migrate dev
cd ..
pause
goto MENU

:: ----------------------------------------
:DB_SEED
cls
echo [PRISMA] Populando banco com dados iniciais...
echo.
cd server
call npx prisma db seed
cd ..
pause
goto MENU

:: ----------------------------------------
:PRISMA_STUDIO
cls
echo [PRISMA STUDIO] Abrindo em http://localhost:5555...
start "Prisma Studio" cmd /k "cd /d %~dp0server && npx prisma studio"
timeout /t 3 /nobreak >nul
echo Studio aberto em http://localhost:5555
pause
goto MENU

:: ----------------------------------------
:PRISMA_GEN
cls
echo [PRISMA] Gerando client...
cd server
call npx prisma generate
cd ..
pause
goto MENU

:: ----------------------------------------
:TEST_BACK
cls
echo [TESTES] Backend - Vitest...
echo.
cd server
call npx vitest run
cd ..
pause
goto MENU

:: ----------------------------------------
:TEST_FRONT
cls
echo [TESTES] Frontend - Vitest...
echo.
cd client
call npx vitest run
cd ..
pause
goto MENU

:: ----------------------------------------
:BUILD_FRONT
cls
echo [BUILD] Frontend (vue-tsc + vite build)...
echo.
cd client
call npm run build
cd ..
echo.
echo [DONE] Build em client/dist/
pause
goto MENU

:: ----------------------------------------
:BUILD_BACK
cls
echo [BUILD] Backend (tsc)...
echo.
cd server
call npm run build
cd ..
echo.
echo [DONE] Build em server/dist/
pause
goto MENU

:: ----------------------------------------
:GIT_STATUS
cls
echo [GIT] Status e commits recentes:
echo.
git status
echo.
echo --- Ultimos 10 commits ---
git log --oneline -10
echo.
pause
goto MENU

:: ----------------------------------------
:GIT_PULL
cls
echo [GIT] Atualizando repositorio...
echo.
git pull
echo.
pause
goto MENU

:: ----------------------------------------
:FIM
echo.
echo Ate mais!
timeout /t 2 /nobreak >nul
exit
