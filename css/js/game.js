class MinecraftGame {
    constructor() {
        this.currentScreen = 'loading';
        this.world = null;
        this.player = null;
        this.renderer = null;
        this.isPaused = false;
        this.keys = {};
        this.mouse = { x: 0, y: 0, locked: false };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showLoadingScreen();
        
        // Simulate loading progress
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                setTimeout(() => {
                    this.showMainMenu();
                }, 500);
            }
            this.updateLoadingProgress(progress);
        }, 200);
    }

    setupEventListeners() {
        // Menu buttons
        document.getElementById('singleplayer-btn').addEventListener('click', () => this.startSingleplayer());
        document.getElementById('multiplayer-btn').addEventListener('click', () => this.showMultiplayerMenu());
        document.getElementById('settings-btn').addEventListener('click', () => this.showSettingsMenu());
        document.getElementById('about-btn').addEventListener('click', () => this.showAbout());
        
        // Multiplayer menu
        document.getElementById('connect-direct').addEventListener('click', () => this.connectToServer());
        document.getElementById('back-to-main').addEventListener('click', () => this.showMainMenu());
        
        // Settings menu
        document.getElementById('save-settings').addEventListener('click', () => this.saveSettings());
        document.getElementById('back-to-main-settings').addEventListener('click', () => this.showMainMenu());
        
        // Pause menu
        document.getElementById('resume-game').addEventListener('click', () => this.resumeGame());
        document.getElementById('save-quit').addEventListener('click', () => this.saveAndQuit());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Mouse controls
        document.addEventListener('click', () => this.requestPointerLock());
        document.addEventListener('pointerlockchange', () => this.handlePointerLockChange());
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Window events
        window.addEventListener('resize', () => this.handleResize());
    }

    showLoadingScreen() {
        document.getElementById('loading-screen').style.display = 'flex';
        this.currentScreen = 'loading';
    }

    updateLoadingProgress(progress) {
        const progressBar = document.querySelector('.progress');
        progressBar.style.width = progress + '%';
        
        const loadingText = document.querySelector('.loading-text');
        if (progress < 30) {
            loadingText.textContent = 'Loading textures...';
        } else if (progress < 60) {
            loadingText.textContent = 'Generating world...';
        } else if (progress < 90) {
            loadingText.textContent = 'Initializing renderer...';
        } else {
            loadingText.textContent = 'Almost ready...';
        }
    }

    showMainMenu() {
        this.hideAllScreens();
        document.getElementById('main-menu').classList.remove('hidden');
        this.currentScreen = 'main';
    }

    hideAllScreens() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        document.getElementById('loading-screen').style.display = 'none';
    }

    showMultiplayerMenu() {
        this.hideAllScreens();
        document.getElementById('multiplayer-menu').classList.remove('hidden');
        this.currentScreen = 'multiplayer';
    }

    showSettingsMenu() {
        this.hideAllScreens();
        document.getElementById('settings-menu').classList.remove('hidden');
        this.currentScreen = 'settings';
    }

    startSingleplayer() {
        this.hideAllScreens();
        document.getElementById('game-screen').classList.remove('hidden');
        this.currentScreen = 'game';
        
        this.initGame();
        this.startGameLoop();
    }

    initGame() {
        // Initialize Three.js scene
        this.renderer = new
