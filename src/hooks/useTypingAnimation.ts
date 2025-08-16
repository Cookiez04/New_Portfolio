import { useState, useEffect } from 'react';

interface UseTypingAnimationProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

interface UseTypingAnimationReturn {
  displayText: string;
  isDeleting: boolean;
  currentWordIndex: number;
}

export const useTypingAnimation = ({
  words,
  typingSpeed = 150,
  deletingSpeed = 100,
  pauseDuration = 2000
}: UseTypingAnimationProps): UseTypingAnimationReturn => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;

    const currentWord = words[currentWordIndex];
    let timeoutId: NodeJS.Timeout;

    const handleTyping = () => {
      if (isPaused) {
        timeoutId = setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, pauseDuration);
        return;
      }

      if (!isDeleting) {
        // Typing phase
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
          timeoutId = setTimeout(handleTyping, typingSpeed);
        } else {
          // Word is complete, pause before deleting
          setIsPaused(true);
          timeoutId = setTimeout(handleTyping, 0);
        }
      } else {
        // Deleting phase
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
          timeoutId = setTimeout(handleTyping, deletingSpeed);
        } else {
          // Word is deleted, move to next word
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          timeoutId = setTimeout(handleTyping, typingSpeed);
        }
      }
    };

    timeoutId = setTimeout(handleTyping, typingSpeed);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [displayText, isDeleting, currentWordIndex, isPaused, words, typingSpeed, deletingSpeed, pauseDuration]);

  return {
    displayText,
    isDeleting,
    currentWordIndex
  };
};