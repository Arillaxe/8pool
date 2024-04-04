import { useCallback, useEffect, useRef } from "react";
import { Game } from "./lib/game";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game>();

  const mouseDownCallback = useCallback((e: MouseEvent) => {
    gameRef.current?.mouseStartCallback(e.clientX, e.clientY);
  }, []);

  const mouseMoveCallback = useCallback((e: MouseEvent) => {
    gameRef.current?.mouseMoveCallback(e.clientX, e.clientY);
  }, []);

  const mouseUpCallback = useCallback((e: MouseEvent) => {
    gameRef.current?.mouseEndCallback(e.clientX, e.clientY);
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      gameRef.current = new Game(canvasRef.current);

      gameRef.current.init();

      window.addEventListener("mousedown", mouseDownCallback);
      window.addEventListener("mousemove", mouseMoveCallback);
      window.addEventListener("mouseup", mouseUpCallback);

      return () => {
        gameRef.current!.stop();

        window.removeEventListener("mousedown", mouseDownCallback);
        window.removeEventListener("mousemove", mouseMoveCallback);
        window.removeEventListener("mouseup", mouseUpCallback);

        delete gameRef.current;
      };
    }
  }, []);

  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  );
}

export default App;
