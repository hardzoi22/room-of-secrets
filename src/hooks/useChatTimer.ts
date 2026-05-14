import { useState, useEffect, useRef, useCallback } from 'react';

export const useChatTimer = (initialTime: number, onEnd: () => void) => {
  const [time, setTime] = useState(initialTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onEndRef = useRef(onEnd);

  // Обновляем onEnd без перезапуска таймера
  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  const start = useCallback((newTime?: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    setTime(newTime ?? initialTime);
    
    intervalRef.current = setInterval(() => {
      setTime(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onEndRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [initialTime]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const extend = useCallback((seconds: number) => {
    setTime(prev => prev + seconds);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { time, start, stop, extend, formatTime: formatTime(time) };
};