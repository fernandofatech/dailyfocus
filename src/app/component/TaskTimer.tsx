import React, { useState, useEffect } from "react";

type TaskTimerProps = {
  startTime?: number;
};

const TaskTimer: React.FC<TaskTimerProps> = ({ startTime }) => {
  const [elapsedTime, setElapsedTime] = useState<string>("");

  useEffect(() => {
    if (!startTime) {
      setElapsedTime("N/A");
      return;
    }

    const calculateTime = (startTime: number) => {
      const now = Date.now();
      const seconds = Math.floor((now - startTime) / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    };

    const interval = setInterval(() => {
      setElapsedTime(calculateTime(startTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return <span>{elapsedTime}</span>;
};

export default TaskTimer;
