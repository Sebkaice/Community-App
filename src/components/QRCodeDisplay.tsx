import React from 'react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  label?: string;
  sublabel?: string;
  showLogo?: boolean;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 200,
  label,
  sublabel,
  showLogo = true,
}) => {
  // Generate a deterministic SVG matrix pattern based on the string value
  const generateMatrix = (seedStr: string, size = 21) => {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i);
      hash |= 0;
    }

    const grid: boolean[][] = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => false)
    );

    // Standard finder patterns (top-left, top-right, bottom-left)
    const addFinder = (r: number, c: number) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (
            i === 0 || i === 6 || j === 0 || j === 6 ||
            (i >= 2 && i <= 4 && j >= 2 && j <= 4)
          ) {
            grid[r + i][c + j] = true;
          }
        }
      }
    };

    addFinder(0, 0);
    addFinder(0, size - 7);
    addFinder(size - 7, 0);

    // Fill data area pseudo-randomly with hash seed
    let seed = Math.abs(hash);
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Skip finder areas
        if ((r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7)) {
          continue;
        }
        // Skip center logo area
        if (showLogo && r >= 8 && r <= 12 && c >= 8 && c <= 12) {
          continue;
        }
        seed = (seed * 9301 + 49297) % 233280;
        grid[r][c] = seed / 233280 > 0.45;
      }
    }

    return grid;
  };

  const matrixSize = 21;
  const matrix = generateMatrix(value, matrixSize);
  const cellSize = size / matrixSize;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl">
      <div
        className="relative bg-white p-4 rounded-xl shadow-inner flex items-center justify-center"
        style={{ width: size + 32, height: size + 32 }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {matrix.map((row, r) =>
            row.map((cell, c) => {
              if (!cell) return null;
              return (
                <rect
                  key={`${r}-${c}`}
                  x={c * cellSize}
                  y={r * cellSize}
                  width={cellSize - 0.5}
                  height={cellSize - 0.5}
                  rx={cellSize > 8 ? 1.5 : 0}
                  fill="#18181b"
                />
              );
            })
          )}
        </svg>

        {showLogo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-10 h-10 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center shadow-md">
              <span className="text-zinc-950 font-extrabold text-xs tracking-tighter">PELOTON</span>
            </div>
          </div>
        )}
      </div>

      {label && <p className="mt-3 text-xs font-semibold text-zinc-200 tracking-wide uppercase">{label}</p>}
      {sublabel && <p className="text-[11px] text-zinc-400 mt-0.5">{sublabel}</p>}
    </div>
  );
};
