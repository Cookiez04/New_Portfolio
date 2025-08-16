import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Play, Zap, Brain, Gamepad2, BarChart3, Terminal, Sparkles, X, Shuffle, RotateCcw, Code, FileText, Trash2, Square } from 'lucide-react';

const CreativeLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('colorizer');
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>(['Welcome to Kiezz\'s Interactive Terminal!', 'Available commands: help, about, skills, projects, contact, clear, whoami, date, ls', '']);
  const [sortingArray, setSortingArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90, 45, 88, 76]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [currentAlgorithm, setCurrentAlgorithm] = useState<string>('bubble');
  const [sortingSpeed, setSortingSpeed] = useState<number>(200);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [snakeGame, setSnakeGame] = useState<{
    score: number;
    isPlaying: boolean;
    snake: {x: number, y: number}[];
    food: {x: number, y: number};
    direction: {x: number, y: number};
    gameOver: boolean;
  }>({
    score: 0,
    isPlaying: false,
    snake: [{x: 10, y: 10}],
    food: {x: 15, y: 15},
    direction: {x: 0, y: 0},
    gameOver: false
  });

  // Tetris Game State
  const [tetrisGame, setTetrisGame] = useState({
    board: Array(20).fill(null).map(() => Array(10).fill({ filled: false, color: '' })),
    currentPiece: null,
    currentPosition: { x: 4, y: 0 },
    isPlaying: false,
    gameOver: false,
    score: 0,
    lines: 0,
    level: 1
  });
  const [showTetrisModal, setShowTetrisModal] = useState(false);

  // Memory Game State
  const [memoryGame, setMemoryGame] = useState({
    cards: [],
    flippedCards: [],
    matchedPairs: [],
    moves: 0,
    gameWon: false,
    isPlaying: false
  });
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  // Sound Synthesizer State
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [masterGain, setMasterGain] = useState<GainNode | null>(null);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [activeNotes, setActiveNotes] = useState<Map<string, {
    oscillator: OscillatorNode;
    gainNode: GainNode;
    filterNode: BiquadFilterNode;
  }>>(new Map());
  
  // Oscillator Settings
  const [oscillatorSettings, setOscillatorSettings] = useState({
    waveform: 'sine' as OscillatorType,
    frequency: 440,
    detune: 0,
    volume: 0.3
  });
  
  // Filter Settings
  const [filterSettings, setFilterSettings] = useState({
    type: 'lowpass' as BiquadFilterType,
    frequency: 1000,
    Q: 1,
    gain: 0
  });
  
  // Envelope Settings (ADSR)
  const [envelopeSettings, setEnvelopeSettings] = useState({
    attack: 0.1,
    decay: 0.3,
    sustain: 0.7,
    release: 0.5
  });
  
  // Effects Settings
  const [effectsSettings, setEffectsSettings] = useState({
    reverbEnabled: false,
    reverbAmount: 0.3,
    delayEnabled: false,
    delayTime: 0.3,
    delayFeedback: 0.4,
    distortionEnabled: false,
    distortionAmount: 20
  });
  
  // UI State
  const [currentOctave, setCurrentOctave] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('default');

  // Interactive functions
  const typeWriter = async (text: string, callback: (char: string) => void) => {
    for (let i = 0; i < text.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 20));
      callback(text.slice(0, i + 1));
    }
  };

  const handleTerminalCommand = async (command: string) => {
    const cmd = command.toLowerCase().trim();
    let response = '';
    
    switch (cmd) {
      case 'help':
        response = 'Available commands: help, about, skills, projects, contact, clear, whoami, date, ls, joke';
        break;
      case 'about':
        response = 'Ahmad Zuhairy (Kiezz) - Full-stack developer passionate about creating amazing web experiences.';
        break;
      case 'skills':
        response = 'JavaScript, TypeScript, React, Next.js, Node.js, Python, PostgreSQL, MongoDB, and more!';
        break;
      case 'projects':
        response = 'Check out my projects section above! Featured: Kira by Kiezz, TaskFlow, and more.';
        break;
      case 'contact':
        response = 'Email: kiezzyee@gmail.com | GitHub: github.com/kiezz | Instagram: @ki3zzy';
        break;
      case 'clear':
        setTerminalHistory(['']);
        return;
      case 'whoami':
        response = 'kiezz - The developer who turns coffee into code ☕';
        break;
      case 'date':
        response = new Date().toString();
        break;
      case 'ls':
        response = 'projects/  skills/  experience/  contact/  README.md';
        break;
      case 'joke':
        const jokes = [
          'Why do programmers prefer dark mode? Because light attracts bugs! 🐛',
          'How many programmers does it take to change a light bulb? None, that\'s a hardware problem.',
          'Why do Java developers wear glasses? Because they can\'t C#!',
          'A SQL query goes into a bar, walks up to two tables and asks: "Can I join you?"'
        ];
        response = jokes[Math.floor(Math.random() * jokes.length)];
        break;
      default:
        response = `Command not found: ${command}. Type 'help' for available commands.`;
    }
    
    // Add command to history immediately
    setTerminalHistory(prev => [...prev, `kiezz@portfolio:~$ ${command}`, '', '']);
    
    // Type out the response with animation
    let currentResponse = '';
    await typeWriter(response, (partialText) => {
      currentResponse = partialText;
      setTerminalHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 2] = currentResponse;
        return newHistory;
      });
    });
  };
  
  const handleTerminalKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTerminalCommand(terminalInput);
      setTerminalInput('');
    }
  };

  // Audio Context and Synthesizer Functions
  const initializeAudio = React.useCallback(async () => {
    if (isAudioInitialized) return;
    
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gain = context.createGain();
      gain.gain.value = 0.5;
      gain.connect(context.destination);
      
      setAudioContext(context);
      setMasterGain(gain);
      setIsAudioInitialized(true);
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }, [isAudioInitialized]);
  
  const noteToFrequency = (note: string, octave: number): number => {
    const noteMap: { [key: string]: number } = {
      'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
      'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
    };
    const noteNumber = noteMap[note];
    return 440 * Math.pow(2, (octave - 4) + (noteNumber - 9) / 12);
  };
  
  const playNote = React.useCallback((note: string, octave: number = currentOctave) => {
    if (!audioContext || !masterGain) return;
    
    const noteKey = `${note}${octave}`;
    if (activeNotes.has(noteKey)) return;
    
    const frequency = noteToFrequency(note, octave);
    
    // Create oscillator
    const oscillator = audioContext.createOscillator();
    oscillator.type = oscillatorSettings.waveform;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.detune.setValueAtTime(oscillatorSettings.detune, audioContext.currentTime);
    
    // Create gain node for envelope
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    
    // Create filter
    const filterNode = audioContext.createBiquadFilter();
    filterNode.type = filterSettings.type;
    filterNode.frequency.setValueAtTime(filterSettings.frequency, audioContext.currentTime);
    filterNode.Q.setValueAtTime(filterSettings.Q, audioContext.currentTime);
    
    // Connect nodes
    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(masterGain);
    
    // Apply envelope (Attack)
    const now = audioContext.currentTime;
    const attackTime = envelopeSettings.attack;
    const decayTime = envelopeSettings.decay;
    const sustainLevel = envelopeSettings.sustain * oscillatorSettings.volume;
    
    gainNode.gain.linearRampToValueAtTime(oscillatorSettings.volume, now + attackTime);
    gainNode.gain.linearRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
    
    oscillator.start();
    
    setActiveNotes(prev => new Map(prev.set(noteKey, { oscillator, gainNode, filterNode })));
  }, [audioContext, masterGain, currentOctave, oscillatorSettings, filterSettings, envelopeSettings, activeNotes]);
  
  const stopNote = React.useCallback((note: string, octave: number = currentOctave) => {
    const noteKey = `${note}${octave}`;
    const noteData = activeNotes.get(noteKey);
    
    if (!noteData || !audioContext) return;
    
    const { oscillator, gainNode } = noteData;
    const now = audioContext.currentTime;
    const releaseTime = envelopeSettings.release;
    
    // Apply release envelope
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(0, now + releaseTime);
    
    oscillator.stop(now + releaseTime);
    
    setActiveNotes(prev => {
      const newMap = new Map(prev);
      newMap.delete(noteKey);
      return newMap;
    });
  }, [audioContext, currentOctave, envelopeSettings, activeNotes]);
  
  const stopAllNotes = React.useCallback(() => {
    activeNotes.forEach((noteData, noteKey) => {
      const note = noteKey.slice(0, -1);
      const octave = parseInt(noteKey.slice(-1));
      stopNote(note, octave);
    });
  }, [activeNotes, stopNote]);
  
  const loadPreset = (presetName: string) => {
    const presets: { [key: string]: any } = {
      default: {
        oscillator: { waveform: 'sine', volume: 0.3, detune: 0 },
        filter: { type: 'lowpass', frequency: 1000, Q: 1 },
        envelope: { attack: 0.1, decay: 0.3, sustain: 0.7, release: 0.5 }
      },
      bass: {
        oscillator: { waveform: 'sawtooth', volume: 0.4, detune: 0 },
        filter: { type: 'lowpass', frequency: 300, Q: 2 },
        envelope: { attack: 0.05, decay: 0.2, sustain: 0.8, release: 0.3 }
      },
      lead: {
        oscillator: { waveform: 'square', volume: 0.3, detune: 5 },
        filter: { type: 'lowpass', frequency: 2000, Q: 3 },
        envelope: { attack: 0.02, decay: 0.1, sustain: 0.6, release: 0.8 }
      },
      pad: {
        oscillator: { waveform: 'sine', volume: 0.2, detune: 0 },
        filter: { type: 'lowpass', frequency: 800, Q: 0.5 },
        envelope: { attack: 0.5, decay: 0.8, sustain: 0.9, release: 1.2 }
      }
    };
    
    const preset = presets[presetName];
    if (preset) {
      setOscillatorSettings(prev => ({ ...prev, ...preset.oscillator }));
      setFilterSettings(prev => ({ ...prev, ...preset.filter }));
      setEnvelopeSettings(prev => ({ ...prev, ...preset.envelope }));
      setSelectedPreset(presetName);
    }
  };
  
  // Audio initialization on component mount
  React.useEffect(() => {
    // Auto-initialize audio context when component mounts
    const handleUserInteraction = () => {
      initializeAudio();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [initializeAudio]);
  
  // Keyboard event handling for virtual keyboard
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isAudioInitialized) return;
      
      const keyMap: { [key: string]: string } = {
        'a': 'C', 'w': 'C#', 's': 'D', 'e': 'D#', 'd': 'E', 'f': 'F',
        't': 'F#', 'g': 'G', 'y': 'G#', 'h': 'A', 'u': 'A#', 'j': 'B'
      };
      
      const note = keyMap[e.key.toLowerCase()];
      if (note && !e.repeat) {
        playNote(note);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!isAudioInitialized) return;
      
      const keyMap: { [key: string]: string } = {
        'a': 'C', 'w': 'C#', 's': 'D', 'e': 'D#', 'd': 'E', 'f': 'F',
        't': 'F#', 'g': 'G', 'y': 'G#', 'h': 'A', 'u': 'A#', 'j': 'B'
      };
      
      const note = keyMap[e.key.toLowerCase()];
      if (note) {
        stopNote(note);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isAudioInitialized, playNote, stopNote]);
  
  // Cleanup audio context on unmount
  React.useEffect(() => {
    return () => {
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [audioContext]);

  // Memory Game Functions
  const MEMORY_SYMBOLS = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺'];
  
  const generateMemoryCards = () => {
    const symbols = [...MEMORY_SYMBOLS, ...MEMORY_SYMBOLS]; // Duplicate for pairs
    const shuffled = symbols.sort(() => Math.random() - 0.5);
    return shuffled.map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false
    }));
  };
  
  const startMemoryGame = () => {
    const cards = generateMemoryCards();
    setMemoryGame({
      cards,
      flippedCards: [],
      matchedPairs: [],
      moves: 0,
      gameWon: false,
      isPlaying: true
    });
  };
  
  const resetMemoryGame = () => {
    setMemoryGame({
      cards: [],
      flippedCards: [],
      matchedPairs: [],
      moves: 0,
      gameWon: false,
      isPlaying: false
    });
  };
  
  const flipCard = (cardId: number) => {
    if (!memoryGame.isPlaying || memoryGame.gameWon) return;
    
    const card = memoryGame.cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || memoryGame.flippedCards.length >= 2) return;
    
    const newFlippedCards = [...memoryGame.flippedCards, cardId];
    const updatedCards = memoryGame.cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    
    setMemoryGame(prev => ({
      ...prev,
      cards: updatedCards,
      flippedCards: newFlippedCards
    }));
    
    if (newFlippedCards.length === 2) {
      const [firstId, secondId] = newFlippedCards;
      const firstCard = updatedCards.find(c => c.id === firstId);
      const secondCard = updatedCards.find(c => c.id === secondId);
      
      setTimeout(() => {
        if (firstCard?.symbol === secondCard?.symbol) {
          // Match found
          const newMatchedPairs = [...memoryGame.matchedPairs, firstCard.symbol];
          const finalCards = updatedCards.map(c => 
            c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
          );
          
          setMemoryGame(prev => ({
            ...prev,
            cards: finalCards,
            flippedCards: [],
            matchedPairs: newMatchedPairs,
            moves: prev.moves + 1,
            gameWon: newMatchedPairs.length === MEMORY_SYMBOLS.length
          }));
        } else {
          // No match, flip back
          const resetCards = updatedCards.map(c => 
            c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
          );
          
          setMemoryGame(prev => ({
            ...prev,
            cards: resetCards,
            flippedCards: [],
            moves: prev.moves + 1
          }));
        }
      }, 1000);
    }
  };

  // Tetris Pieces with proper rotations
  const TETRIS_PIECES = {
    I: [[[1,1,1,1]], [[1],[1],[1],[1]]],
    O: [[[1,1],[1,1]]],
    T: [[[0,1,0],[1,1,1]], [[1,0],[1,1],[1,0]], [[1,1,1],[0,1,0]], [[0,1],[1,1],[0,1]]],
    S: [[[0,1,1],[1,1,0]], [[1,0],[1,1],[0,1]]],
    Z: [[[1,1,0],[0,1,1]], [[0,1],[1,1],[1,0]]],
    J: [[[1,0,0],[1,1,1]], [[1,1],[1,0],[1,0]], [[1,1,1],[0,0,1]], [[0,1],[0,1],[1,1]]],
    L: [[[0,0,1],[1,1,1]], [[1,0],[1,0],[1,1]], [[1,1,1],[1,0,0]], [[1,1],[0,1],[0,1]]]
  };

  // Colors for each piece type
  const PIECE_COLORS = {
    I: 'bg-cyan-500',
    O: 'bg-yellow-500',
    T: 'bg-purple-500',
    S: 'bg-green-500',
    Z: 'bg-red-500',
    J: 'bg-blue-500',
    L: 'bg-orange-500'
  };

  const getRandomPiece = () => {
    const pieces = Object.keys(TETRIS_PIECES);
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)] as keyof typeof TETRIS_PIECES;
    return {
      type: randomPiece,
      shape: TETRIS_PIECES[randomPiece][0],
      rotation: 0,
      color: PIECE_COLORS[randomPiece]
    };
  };

  const rotatePiece = (piece: any) => {
    const rotations = TETRIS_PIECES[piece.type as keyof typeof TETRIS_PIECES];
    const nextRotation = (piece.rotation + 1) % rotations.length;
    return {
      ...piece,
      shape: rotations[nextRotation],
      rotation: nextRotation
    };
  };

  const isValidPosition = (board: any[][], piece: any, position: {x: number, y: number}) => {
    if (!piece) return false;
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = position.x + x;
          const newY = position.y + y;
          
          if (newX < 0 || newX >= 10 || newY >= 20 || (newY >= 0 && board[newY][newX].filled)) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const placePiece = (board: any[][], piece: any, position: {x: number, y: number}) => {
    const newBoard = board.map(row => row.map(cell => ({...cell})));
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = { filled: true, color: piece.color };
          }
        }
      }
    }
    return newBoard;
  };

  const clearLines = (board: any[][]) => {
    const newBoard: any[][] = [];
    let linesCleared = 0;
    
    for (let y = 0; y < board.length; y++) {
      if (!board[y].every(cell => cell.filled)) {
        newBoard.push(board[y].map(cell => ({...cell})));
      } else {
        linesCleared++;
      }
    }
    
    while (newBoard.length < 20) {
      newBoard.unshift(Array(10).fill(null).map(() => ({ filled: false, color: '' })));
    }
    
    return { board: newBoard, linesCleared };
  };

  // Snake Game Logic
  const generateFood = () => {
    return {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20)
    };
  };

  const moveSnake = () => {
    setSnakeGame(prev => {
      if (!prev.isPlaying || prev.gameOver) return prev;

      const newSnake = [...prev.snake];
      const head = { ...newSnake[0] };
      head.x += prev.direction.x;
      head.y += prev.direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        return { ...prev, gameOver: true, isPlaying: false };
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return { ...prev, gameOver: true, isPlaying: false };
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === prev.food.x && head.y === prev.food.y) {
        return {
          ...prev,
          snake: newSnake,
          food: generateFood(),
          score: prev.score + 10
        };
      } else {
        newSnake.pop();
        return {
          ...prev,
          snake: newSnake
        };
      }
    });
  };

  const handleSnakeKeyPress = (e: KeyboardEvent) => {
    if (!snakeGame.isPlaying) return;

    const { key } = e;
    setSnakeGame(prev => {
      let newDirection = { ...prev.direction };
      
      switch (key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (prev.direction.y === 0) newDirection = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (prev.direction.y === 0) newDirection = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (prev.direction.x === 0) newDirection = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (prev.direction.x === 0) newDirection = { x: 1, y: 0 };
          break;
      }
      
      return { ...prev, direction: newDirection };
    });
  };

  const startSnakeGame = () => {
    setSnakeGame({
      score: 0,
      isPlaying: true,
      snake: [{x: 10, y: 10}],
      food: generateFood(),
      direction: { x: 1, y: 0 },
      gameOver: false
    });
  };

  const resetSnakeGame = () => {
    setSnakeGame({
      score: 0,
      isPlaying: false,
      snake: [{x: 10, y: 10}],
      food: {x: 15, y: 15},
      direction: {x: 0, y: 0},
      gameOver: false
    });
  };

  // Tetris Game Functions
  const startTetrisGame = () => {
    const newPiece = getRandomPiece();
    setTetrisGame({
      board: Array(20).fill(null).map(() => Array(10).fill(null).map(() => ({ filled: false, color: '' }))),
      currentPiece: newPiece,
      currentPosition: { x: 4, y: 0 },
      isPlaying: true,
      gameOver: false,
      score: 0,
      lines: 0,
      level: 1
    });
  };

  const resetTetrisGame = () => {
    setTetrisGame({
      board: Array(20).fill(null).map(() => Array(10).fill(null).map(() => ({ filled: false, color: '' }))),
      currentPiece: null,
      currentPosition: { x: 4, y: 0 },
      isPlaying: false,
      gameOver: false,
      score: 0,
      lines: 0,
      level: 1
    });
  };

  const moveTetrisPiece = useCallback((direction: {x: number, y: number}) => {
    setTetrisGame(prev => {
      if (!prev.isPlaying || !prev.currentPiece) return prev;

      const newPosition = {
        x: prev.currentPosition.x + direction.x,
        y: prev.currentPosition.y + direction.y
      };

      if (isValidPosition(prev.board, prev.currentPiece, newPosition)) {
        return {
          ...prev,
          currentPosition: newPosition
        };
      } else if (direction.y > 0) {
        // Piece can't move down, place it
        const newBoard = placePiece(prev.board, prev.currentPiece, prev.currentPosition);
        const { board: clearedBoard, linesCleared } = clearLines(newBoard);
        const newPiece = getRandomPiece();
        const newPiecePosition = { x: 4, y: 0 };

        if (!isValidPosition(clearedBoard, newPiece, newPiecePosition)) {
          // Game over
          return {
            ...prev,
            gameOver: true,
            isPlaying: false
          };
        }

        const points = linesCleared * 100 * prev.level;
        return {
          ...prev,
          board: clearedBoard,
          currentPiece: newPiece,
          currentPosition: newPiecePosition,
          score: prev.score + points,
          lines: prev.lines + linesCleared,
          level: Math.floor((prev.lines + linesCleared) / 10) + 1
        };
      }
      return prev;
    });
  }, []);

  const rotateTetrisPiece = useCallback(() => {
    setTetrisGame(prev => {
      if (!prev.isPlaying || !prev.currentPiece) return prev;

      const rotatedPiece = rotatePiece(prev.currentPiece);
      if (isValidPosition(prev.board, rotatedPiece, prev.currentPosition)) {
        return {
          ...prev,
          currentPiece: rotatedPiece
        };
      }
      return prev;
    });
  }, []);

  const handleTetrisKeyPress = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        event.preventDefault();
        moveTetrisPiece({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        event.preventDefault();
        moveTetrisPiece({ x: 1, y: 0 });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        event.preventDefault();
        moveTetrisPiece({ x: 0, y: 1 });
        break;
      case 'ArrowUp':
      case 'w':
      case 'W':
      case ' ':
        event.preventDefault();
        rotateTetrisPiece();
        break;
    }
  }, [moveTetrisPiece, rotateTetrisPiece]);

  // Game loop effects
  useEffect(() => {
    if (snakeGame.isPlaying && !snakeGame.gameOver) {
      const gameInterval = setInterval(moveSnake, 150);
      return () => clearInterval(gameInterval);
    }
  }, [snakeGame.isPlaying, snakeGame.gameOver, snakeGame.direction]);

  useEffect(() => {
    if (!tetrisGame.isPlaying || tetrisGame.gameOver) return;

    const gameLoop = setInterval(() => {
      moveTetrisPiece({ x: 0, y: 1 });
    }, Math.max(50, 500 - (tetrisGame.level - 1) * 50));

    return () => clearInterval(gameLoop);
  }, [tetrisGame.isPlaying, tetrisGame.gameOver, tetrisGame.level, moveTetrisPiece]);

  // Keyboard event listeners
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (snakeGame.isPlaying && !snakeGame.gameOver) {
        handleSnakeKeyPress(event);
      }
      if (tetrisGame.isPlaying && !tetrisGame.gameOver) {
        handleTetrisKeyPress(event);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [snakeGame.isPlaying, snakeGame.gameOver, tetrisGame.isPlaying, tetrisGame.gameOver]);
  
  // Sorting Algorithms
  const quickSort = async (arr: number[], low: number = 0, high: number = arr.length - 1) => {
    if (low < high) {
      const pi = await partition(arr, low, high);
      await quickSort(arr, low, pi - 1);
      await quickSort(arr, pi + 1, high);
    }
  };

  const partition = async (arr: number[], low: number, high: number) => {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setSortingArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, sortingSpeed));
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setSortingArray([...arr]);
    await new Promise(resolve => setTimeout(resolve, sortingSpeed));
    return i + 1;
  };

  const mergeSort = async (arr: number[], left: number = 0, right: number = arr.length - 1) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      await mergeSort(arr, left, mid);
      await mergeSort(arr, mid + 1, right);
      await merge(arr, left, mid, right);
    }
  };

  const merge = async (arr: number[], left: number, mid: number, right: number) => {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      k++;
      setSortingArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, sortingSpeed));
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      i++;
      k++;
      setSortingArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, sortingSpeed));
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      j++;
      k++;
      setSortingArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, sortingSpeed));
    }
  };

  // Bogo Sort (Random Sort)
  const bogoSort = async () => {
    setIsAnimating(true);
    let arr = [...sortingArray];
    let attempts = 0;
    const maxAttempts = 100; // Prevent infinite loop
    
    const isSorted = (array: number[]) => {
      for (let i = 0; i < array.length - 1; i++) {
        if (array[i] > array[i + 1]) return false;
      }
      return true;
    };
    
    const shuffle = (array: number[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
    
    while (!isSorted(arr) && attempts < maxAttempts) {
      arr = shuffle([...arr]);
      setSortingArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    setIsAnimating(false);
  };

  // Heap Sort
  const heapSort = async () => {
    setIsAnimating(true);
    let arr = [...sortingArray];
    const n = arr.length;

    const heapify = async (arr: number[], n: number, i: number) => {
      let largest = i;
      let left = 2 * i + 1;
      let right = 2 * i + 2;

      if (left < n && arr[left] > arr[largest]) {
        largest = left;
      }

      if (right < n && arr[right] > arr[largest]) {
        largest = right;
      }

      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        setSortingArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, 100));
        await heapify(arr, n, largest);
      }
    };

    // Build heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(arr, n, i);
    }

    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      setSortingArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, 100));
      await heapify(arr, i, 0);
    }

    setIsAnimating(false);
  };

  // Counting Sort
  const countingSort = async () => {
    setIsAnimating(true);
    let arr = [...sortingArray];
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min + 1;
    const count = new Array(range).fill(0);
    const output = new Array(arr.length);

    // Count occurrences
    for (let i = 0; i < arr.length; i++) {
      count[arr[i] - min]++;
    }

    // Change count[i] to actual position
    for (let i = 1; i < count.length; i++) {
      count[i] += count[i - 1];
    }

    // Build output array
    for (let i = arr.length - 1; i >= 0; i--) {
      output[count[arr[i] - min] - 1] = arr[i];
      count[arr[i] - min]--;
      setSortingArray([...output.slice(0, arr.length)]);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setSortingArray([...output]);
    setIsAnimating(false);
  };

  // Radix Sort
  const radixSort = async () => {
    setIsAnimating(true);
    let arr = [...sortingArray];
    const max = Math.max(...arr);

    const countingSortForRadix = async (arr: number[], exp: number) => {
      const output = new Array(arr.length);
      const count = new Array(10).fill(0);

      for (let i = 0; i < arr.length; i++) {
        count[Math.floor(arr[i] / exp) % 10]++;
      }

      for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
      }

      for (let i = arr.length - 1; i >= 0; i--) {
        output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
        count[Math.floor(arr[i] / exp) % 10]--;
      }

      for (let i = 0; i < arr.length; i++) {
        arr[i] = output[i];
      }
      
      setSortingArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, 200));
    };

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      await countingSortForRadix(arr, exp);
    }

    setIsAnimating(false);
  };

  const selectionSort = async () => {
    const arr = [...sortingArray];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setSortingArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, sortingSpeed));
      }
    }
  };

  const insertionSort = async () => {
    setIsAnimating(true);
    const arr = [...sortingArray];
    const n = arr.length;

    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
        setSortingArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, sortingSpeed));
      }
      arr[j + 1] = key;
      setSortingArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, sortingSpeed));
    }
    
    setIsAnimating(false);
  };

  const generateRandomArrayInteractive = () => {
    if (isAnimating) return;
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
    setSortingArray(newArray);
  };

  const bubbleSortInteractive = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const arr = [...sortingArray];
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          // Swap elements
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setSortingArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
    }
    
    setIsAnimating(false);
  };





  const labFeatures = [
    {id: 'playground',
      title: 'Sound Synthesizer',
      description: 'Interactive audio synthesis with oscillators, filters, and real-time effects.',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'visualizer',
      title: 'Algorithm Visualizer',
      description: 'Watch sorting algorithms come to life with animated visualizations.',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'games',
      title: 'Mini Games',
      description: 'Classic games built with modern web technologies.',
      icon: <Gamepad2 className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'terminal',
      title: 'Interactive Terminal',
      description: 'A simulated terminal with custom commands and Easter eggs.',
      icon: <Terminal className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <section id="creative-lab" className="section-padding bg-gradient-to-b from-black to-gray-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Creative <span className="gradient-text">Lab</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-red-500 mx-auto mb-8" />
          <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Interactive coding playground where you can experiment with algorithms, play games, and explore creative programming concepts in real-time.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {labFeatures.map((feature, index) => (
            <motion.button
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(feature.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === feature.id
                  ? `bg-gradient-to-r ${feature.color} text-white shadow-lg`
                  : 'glass-effect text-gray-400 hover:text-white'
              }`}
            >
              <div className={activeTab === feature.id ? 'text-white' : `text-transparent bg-gradient-to-r ${feature.color} bg-clip-text`}>
                {feature.icon}
              </div>
              <span className="font-medium">{feature.title}</span>
            </motion.button>
          ))}
        </div>

        {/* Interactive Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-effect p-8 rounded-lg mb-16"
        >
          {activeTab === 'playground' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-blue-400 mb-4">Sound Synthesizer</h3>
                <p className="text-gray-400 text-sm">Create and manipulate sounds with oscillators, filters, and effects</p>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center mb-6">
                <button
                  onClick={initializeAudio}
                  disabled={isAudioInitialized}
                  className={`px-6 py-2 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 ${
                    isAudioInitialized 
                      ? 'bg-green-600 text-white cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {isAudioInitialized ? 'Audio Ready' : 'Initialize Audio'}
                </button>
                
                <button
                  onClick={stopAllNotes}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Square className="w-4 h-4" />
                  Stop All
                </button>
                
                <select
                  value={selectedPreset}
                  onChange={(e) => loadPreset(e.target.value)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="default">Default</option>
                  <option value="bass">Bass</option>
                  <option value="lead">Lead</option>
                  <option value="pad">Pad</option>
                </select>
              </div>
              
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Virtual Keyboard */}
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Sparkles className="w-5 h-5" />
                    <h4 className="font-semibold">Virtual Keyboard</h4>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-400">Octave: {currentOctave}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentOctave(Math.max(1, currentOctave - 1))}
                          className="px-2 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
                        >
                          -
                        </button>
                        <button
                          onClick={() => setCurrentOctave(Math.min(7, currentOctave + 1))}
                          className="px-2 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map((note) => (
                        <button
                          key={note}
                          onMouseDown={() => playNote(note)}
                          onMouseUp={() => stopNote(note)}
                          onMouseLeave={() => stopNote(note)}
                          className={`px-3 py-6 rounded text-sm font-medium transition-all ${
                            note.includes('#') 
                              ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600' 
                              : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-300'
                          } ${activeNotes.has(`${note}${currentOctave}`) ? 'ring-2 ring-blue-400' : ''}`}
                        >
                          {note}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Oscillator Controls */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-purple-400">
                    <Zap className="w-5 h-5" />
                    <h4 className="font-semibold">Oscillator</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Waveform</label>
                      <select
                        value={oscillatorSettings.waveform}
                        onChange={(e) => setOscillatorSettings(prev => ({ ...prev, waveform: e.target.value as OscillatorType }))}
                        className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                      >
                        <option value="sine">Sine</option>
                        <option value="square">Square</option>
                        <option value="sawtooth">Sawtooth</option>
                        <option value="triangle">Triangle</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Volume: {oscillatorSettings.volume.toFixed(2)}</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={oscillatorSettings.volume}
                        onChange={(e) => setOscillatorSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Detune: {oscillatorSettings.detune}</label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        step="1"
                        value={oscillatorSettings.detune}
                        onChange={(e) => setOscillatorSettings(prev => ({ ...prev, detune: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Filter & Envelope Controls */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <Brain className="w-5 h-5" />
                    <h4 className="font-semibold">Filter & Envelope</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Filter Type</label>
                      <select
                        value={filterSettings.type}
                        onChange={(e) => setFilterSettings(prev => ({ ...prev, type: e.target.value as BiquadFilterType }))}
                        className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                      >
                        <option value="lowpass">Low Pass</option>
                        <option value="highpass">High Pass</option>
                        <option value="bandpass">Band Pass</option>
                        <option value="notch">Notch</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Cutoff: {filterSettings.frequency}Hz</label>
                      <input
                        type="range"
                        min="20"
                        max="20000"
                        step="10"
                        value={filterSettings.frequency}
                        onChange={(e) => setFilterSettings(prev => ({ ...prev, frequency: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Resonance: {filterSettings.Q.toFixed(1)}</label>
                      <input
                        type="range"
                        min="0.1"
                        max="10"
                        step="0.1"
                        value={filterSettings.Q}
                        onChange={(e) => setFilterSettings(prev => ({ ...prev, Q: parseFloat(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Attack: {envelopeSettings.attack.toFixed(2)}s</label>
                      <input
                        type="range"
                        min="0.01"
                        max="2"
                        step="0.01"
                        value={envelopeSettings.attack}
                        onChange={(e) => setEnvelopeSettings(prev => ({ ...prev, attack: parseFloat(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Release: {envelopeSettings.release.toFixed(2)}s</label>
                      <input
                        type="range"
                        min="0.01"
                        max="3"
                        step="0.01"
                        value={envelopeSettings.release}
                        onChange={(e) => setEnvelopeSettings(prev => ({ ...prev, release: parseFloat(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-400">
                <p>Interactive sound synthesizer with real-time audio generation</p>
                <p className="mt-1">Click and hold keys to play notes, adjust parameters to shape your sound!</p>
              </div>
            </div>
          )}

          {activeTab === 'visualizer' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-green-400 mb-4">Advanced Algorithm Visualizer</h3>
                <p className="text-gray-400 text-sm">Watch different sorting algorithms in action with visual animations</p>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center mb-6">
                <select
                  value={currentAlgorithm}
                  onChange={(e) => setCurrentAlgorithm(e.target.value)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                >
                  <option value="bubble">Bubble Sort</option>
                  <option value="quick">Quick Sort</option>
                  <option value="merge">Merge Sort</option>
                  <option value="selection">Selection Sort</option>
                  <option value="insertion">Insertion Sort</option>
                  <option value="heap">Heap Sort</option>
                  <option value="counting">Counting Sort</option>
                  <option value="radix">Radix Sort</option>
                  <option value="bogo">Bogo Sort (Random)</option>
                </select>
                
                <button
                  onClick={generateRandomArrayInteractive}
                  disabled={isAnimating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Shuffle className="w-4 h-4" />
                  New Array
                </button>
                
                <button
                  onClick={() => {
                    if (isAnimating) return;
                    const algorithms: { [key: string]: () => Promise<void> } = {
                      bubble: bubbleSortInteractive,
                      quick: () => quickSort([...sortingArray]),
                      merge: () => mergeSort([...sortingArray]),
                      selection: selectionSort,
                      insertion: insertionSort,
                      heap: heapSort,
                      counting: countingSort,
                      radix: radixSort,
                      bogo: bogoSort
                    };
                    algorithms[currentAlgorithm]?.();
                  }}
                  disabled={isAnimating}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {isAnimating ? 'Sorting...' : 'Start Sort'}
                </button>
                
                <button
                  onClick={() => {
                    setSortingArray([64, 34, 25, 12, 22, 11, 90, 5, 77, 30, 45, 60]);
                    setIsAnimating(false);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-end justify-center gap-1 h-64">
                  {sortingArray.map((value, index) => (
                    <motion.div
                      key={index}
                      className="bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg transition-all duration-300 flex items-end justify-center text-white text-xs font-bold pb-1"
                      style={{
                        height: `${(value / Math.max(...sortingArray)) * 200}px`,
                        width: '24px',
                        minHeight: '20px'
                      }}
                      layout
                      transition={{ duration: 0.2 }}
                    >
                      <span className="mb-1">{value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-400">
                <p>Algorithm: <span className="text-green-400 font-semibold">{currentAlgorithm.charAt(0).toUpperCase() + currentAlgorithm.slice(1)} Sort</span></p>
                <p className="mt-1">Choose from 9 different sorting algorithms and watch them visualize step by step!</p>
              </div>
            </div>
          )}

          {activeTab === 'games' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-purple-400 mb-4">Mini Games Collection</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="glass-effect p-6 rounded-lg text-center">
                  <div className="text-4xl mb-4">🐍</div>
                  <h4 className="text-lg font-bold mb-2">Snake Game</h4>
                  <p className="text-gray-400 text-sm mb-4">Classic snake game built with React</p>
                  <button 
                    onClick={() => setShowModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                  >
                    Play Snake
                  </button>
                </div>
                
                <div className="glass-effect p-6 rounded-lg text-center">
                  <div className="text-4xl mb-4">🧩</div>
                  <h4 className="text-lg font-bold mb-2">Tetris</h4>
                  <p className="text-gray-400 text-sm mb-4">Block-stacking puzzle game</p>
                  <button 
                    onClick={() => setShowTetrisModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                  >
                    Play Tetris
                  </button>
                </div>
                
                <div className="glass-effect p-6 rounded-lg text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h4 className="text-lg font-bold mb-2">Memory Game</h4>
                  <p className="text-gray-400 text-sm mb-4">Test your memory skills</p>
                  <button 
                    onClick={() => setShowMemoryModal(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                  >
                    Play Memory
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'terminal' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Interactive Terminal</h3>
              
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm h-96 overflow-y-auto">
                <div className="space-y-1">
                  {terminalHistory.map((line, index) => (
                    <div key={index} className={`${
                      line.startsWith('kiezz@portfolio:~$') ? 'text-green-400' : 'text-gray-300'
                    }`}>
                      {line}
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center text-green-400 mt-2">
                  <span>kiezz@portfolio:~$</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyPress={handleTerminalKeyPress}
                    className="bg-transparent border-none outline-none text-white ml-2 flex-1"
                    placeholder="Type 'help' for available commands"
                    autoFocus
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Snake Game Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">Snake Game</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="text-center">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-2xl">🐍</div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-400">Score: {snakeGame.score}</p>
                        {snakeGame.gameOver && (
                          <p className="text-red-400 text-sm font-semibold">Game Over!</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Game Canvas */}
                    <div className="bg-gray-900 rounded-lg p-2 mb-4 mx-auto" style={{width: 'fit-content'}}>
                      <div className="grid grid-cols-20 gap-0" style={{gridTemplateColumns: 'repeat(20, 12px)'}}>
                        {Array.from({ length: 400 }, (_, index) => {
                          const x = index % 20;
                          const y = Math.floor(index / 20);
                          const isSnake = snakeGame.snake.some(segment => segment.x === x && segment.y === y);
                          const isHead = snakeGame.snake[0]?.x === x && snakeGame.snake[0]?.y === y;
                          const isFood = snakeGame.food.x === x && snakeGame.food.y === y;
                          
                          return (
                            <div
                              key={index}
                              className={`w-3 h-3 ${
                                isFood
                                  ? 'bg-red-500 rounded-full'
                                  : isHead
                                  ? 'bg-green-300 rounded-sm'
                                  : isSnake
                                  ? 'bg-green-500 rounded-sm'
                                  : 'bg-gray-800'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 justify-center mb-4">
                      {!snakeGame.isPlaying && !snakeGame.gameOver && (
                        <button
                          onClick={startSnakeGame}
                          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-semibold"
                        >
                          <Play className="w-4 h-4" />
                          Start Game
                        </button>
                      )}
                      
                      {snakeGame.isPlaying && (
                        <button
                          onClick={() => setSnakeGame(prev => ({ ...prev, isPlaying: false }))}
                          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-semibold"
                        >
                          <Square className="w-4 h-4" />
                          Pause
                        </button>
                      )}
                      
                      <button
                        onClick={resetSnakeGame}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                      </button>
                    </div>
                    
                    <div className="text-xs text-gray-400 space-y-1">
                      <p>Use arrow keys or WASD to control the snake</p>
                      <p>Eat the red food to grow and increase your score!</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tetris Game Modal */}
        <AnimatePresence>
          {showTetrisModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowTetrisModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">Tetris</h3>
                  <button
                    onClick={() => setShowTetrisModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-left">
                      <p className="text-lg font-bold text-blue-400">Score: {tetrisGame.score}</p>
                      <p className="text-sm text-gray-400">Lines: {tetrisGame.lines}</p>
                      <p className="text-sm text-gray-400">Level: {tetrisGame.level}</p>
                    </div>
                    <div className="text-4xl">🧩</div>
                  </div>
                  
                  {tetrisGame.gameOver && (
                    <div className="text-center mb-4">
                      <p className="text-red-400 text-lg font-semibold">Game Over!</p>
                    </div>
                  )}
                  
                  {/* Tetris Board */}
                  <div className="bg-gray-900 rounded-lg p-2 mb-4 mx-auto" style={{width: 'fit-content'}}>
                    <div className="grid gap-0" style={{gridTemplateColumns: 'repeat(10, 16px)', gridTemplateRows: 'repeat(20, 16px)'}}>
                      {tetrisGame.board.map((row, y) =>
                        row.map((cell, x) => {
                          let isCurrentPiece = false;
                          let currentPieceColor = '';
                          if (tetrisGame.currentPiece && tetrisGame.isPlaying) {
                            for (let py = 0; py < tetrisGame.currentPiece.shape.length; py++) {
                              for (let px = 0; px < tetrisGame.currentPiece.shape[py].length; px++) {
                                if (
                                  tetrisGame.currentPiece.shape[py][px] &&
                                  tetrisGame.currentPosition.x + px === x &&
                                  tetrisGame.currentPosition.y + py === y
                                ) {
                                  isCurrentPiece = true;
                                  currentPieceColor = tetrisGame.currentPiece.color;
                                }
                              }
                            }
                          }
                          
                          return (
                            <div
                              key={`${x}-${y}`}
                              className={`w-4 h-4 border border-gray-700 ${
                                isCurrentPiece
                                  ? currentPieceColor
                                  : cell.filled
                                  ? cell.color
                                  : 'bg-gray-800'
                              }`}
                            />
                          );
                        })
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-center mb-4">
                    {!tetrisGame.isPlaying && !tetrisGame.gameOver && (
                      <button
                        onClick={startTetrisGame}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
                      >
                        <Play className="w-4 h-4" />
                        Start Game
                      </button>
                    )}
                    
                    {tetrisGame.isPlaying && (
                      <button
                        onClick={() => setTetrisGame(prev => ({ ...prev, isPlaying: false }))}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-semibold"
                      >
                        <Square className="w-4 h-4" />
                        Pause
                      </button>
                    )}
                    
                    <button
                      onClick={resetTetrisGame}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>Use arrow keys or WASD to move pieces</p>
                    <p>Up arrow or W to rotate, Down arrow or S to drop faster</p>
                    <p>Clear lines to score points and level up!</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Memory Game Modal */}
        <AnimatePresence>
          {showMemoryModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowMemoryModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">Memory Game</h3>
                  <button
                    onClick={() => setShowMemoryModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-left">
                      <p className="text-lg font-bold text-purple-400">Moves: {memoryGame.moves}</p>
                      <p className="text-sm text-gray-400">Pairs: {memoryGame.matchedPairs.length}/{MEMORY_SYMBOLS.length}</p>
                    </div>
                    <div className="text-4xl">🎯</div>
                  </div>
                  
                  {memoryGame.gameWon && (
                    <div className="text-center mb-4">
                      <p className="text-green-400 text-lg font-semibold">You Won!</p>
                      <p className="text-sm text-gray-400">Completed in {memoryGame.moves} moves</p>
                    </div>
                  )}
                  
                  {/* Memory Game Board */}
                  <div className="grid grid-cols-4 gap-2 mb-4 max-w-xs mx-auto">
                    {memoryGame.cards.map((card) => (
                      <button
                        key={card.id}
                        onClick={() => flipCard(card.id)}
                        disabled={!memoryGame.isPlaying || memoryGame.gameWon || card.isMatched || memoryGame.flippedCards.length >= 2}
                        className={`aspect-square rounded-lg text-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
                          card.isFlipped || card.isMatched
                            ? card.isMatched
                              ? 'bg-green-500 text-white'
                              : 'bg-blue-500 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-transparent'
                        } disabled:cursor-not-allowed disabled:hover:scale-100`}
                      >
                        {card.isFlipped || card.isMatched ? card.symbol : '?'}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 justify-center mb-4">
                    {!memoryGame.isPlaying && !memoryGame.gameWon && (
                      <button
                        onClick={startMemoryGame}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 font-semibold"
                      >
                        <Play className="w-4 h-4" />
                        Start Game
                      </button>
                    )}
                    
                    <button
                      onClick={resetMemoryGame}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>Click cards to flip them and find matching pairs</p>
                    <p>Complete all pairs with the fewest moves possible!</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="glass-effect p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Ready to Code Something Amazing?</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              This interactive lab showcases practical programming skills through hands-on demonstrations. 
              Each feature represents real-world development capabilities and creative problem-solving.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#projects" className="btn-primary">
                View My Projects
              </a>
              <a href="#contact" className="btn-secondary">
                Let's Build Together
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CreativeLab;