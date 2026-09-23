import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const ALGORITHMS = [
  'Bubble Sort',
  'Selection Sort',
  'Insertion Sort',
  'Quick Sort',
  'Merge Sort',
  'Heap Sort'
];

export default function App() {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(80);
  const [delay, setDelay] = useState(10);
  const [selectedAlgo, setSelectedAlgo] = useState('Bubble Sort');
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // States for bar highlights
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);

  // Metrics
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);

  const isSortingRef = useRef(false);
  const isPausedRef = useRef(false);
  const delayRef = useRef(delay);

  useEffect(() => {
    delayRef.current = delay;
  }, [delay]);

  useEffect(() => {
    resetArray();
  }, [arraySize]);

  const resetArray = () => {
    stopSorting();
    const newArr = [];
    for (let i = 0; i < arraySize; i++) {
      newArr.push(Math.floor(Math.random() * 280) + 20);
    }
    setArray(newArr);
    setComparing([]);
    setSwapping([]);
    setSortedIndices([]);
    setComparisons(0);
    setSwaps(0);
  };

  const stopSorting = () => {
    isSortingRef.current = false;
    setIsSorting(false);
    setIsPaused(false);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Step runner routine for frame delays & pause controls
  const step = async (type, i, j, cmpCountRef, swpCountRef) => {
    while (isPausedRef.current) {
      await sleep(100);
      if (!isSortingRef.current) return false;
    }
    if (!isSortingRef.current) return false;

    if (type === 'compare') {
      setComparing([i, j]);
      setSwapping([]);
      cmpCountRef.current++;
      setComparisons(cmpCountRef.current);
    } else if (type === 'swap' || type === 'overwrite') {
      setSwapping([i, j]);
      swpCountRef.current++;
      setSwaps(swpCountRef.current);
    } else if (type === 'sorted') {
      setSortedIndices((prev) => [...prev, i]);
    }

    await sleep(delayRef.current);
    return true;
  };

  const handleStartSort = async () => {
    if (isSorting) {
      setIsPaused(!isPaused);
      isPausedRef.current = !isPaused;
      return;
    }

    isSortingRef.current = true;
    setIsSorting(true);
    setIsPaused(false);
    isPausedRef.current = false;

    let arr = [...array];
    const cmpCountRef = { current: 0 };
    const swpCountRef = { current: 0 };

    // --- 1. BUBBLE SORT ---
    if (selectedAlgo === 'Bubble Sort') {
      let n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          if (!(await step('compare', j, j + 1, cmpCountRef, swpCountRef))) return;
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            setArray([...arr]);
            if (!(await step('swap', j, j + 1, cmpCountRef, swpCountRef))) return;
          }
        }
        await step('sorted', n - 1 - i, -1, cmpCountRef, swpCountRef);
      }
      await step('sorted', 0, -1, cmpCountRef, swpCountRef);

    // --- 2. SELECTION SORT ---
    } else if (selectedAlgo === 'Selection Sort') {
      let n = arr.length;
      for (let i = 0; i < n; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          if (!(await step('compare', minIdx, j, cmpCountRef, swpCountRef))) return;
          if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx !== i) {
          [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
          setArray([...arr]);
          if (!(await step('swap', i, minIdx, cmpCountRef, swpCountRef))) return;
        }
        await step('sorted', i, -1, cmpCountRef, swpCountRef);
      }

    // --- 3. INSERTION SORT ---
    } else if (selectedAlgo === 'Insertion Sort') {
      let n = arr.length;
      for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
          if (!(await step('compare', j, j + 1, cmpCountRef, swpCountRef))) return;
          arr[j + 1] = arr[j];
          j--;
          setArray([...arr]);
          if (!(await step('swap', j + 1, j + 2, cmpCountRef, swpCountRef))) return;
        }
        arr[j + 1] = key;
        setArray([...arr]);
      }
      setSortedIndices(Array.from({ length: n }, (_, idx) => idx));

    // --- 4. QUICK SORT ---
    } else if (selectedAlgo === 'Quick Sort') {
      const quickSortHelper = async (low, high) => {
        if (low < high) {
          let pivot = arr[high];
          let i = low - 1;
          for (let j = low; j < high; j++) {
            if (!(await step('compare', j, high, cmpCountRef, swpCountRef))) return -1;
            if (arr[j] < pivot) {
              i++;
              [arr[i], arr[j]] = [arr[j], arr[i]];
              setArray([...arr]);
              if (!(await step('swap', i, j, cmpCountRef, swpCountRef))) return -1;
            }
          }
          [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
          setArray([...arr]);
          if (!(await step('swap', i + 1, high, cmpCountRef, swpCountRef))) return -1;

          let pIdx = i + 1;
          await step('sorted', pIdx, -1, cmpCountRef, swpCountRef);

          if ((await quickSortHelper(low, pIdx - 1)) === -1) return -1;
          if ((await quickSortHelper(pIdx + 1, high)) === -1) return -1;
        } else if (low >= 0 && low < arr.length) {
          await step('sorted', low, -1, cmpCountRef, swpCountRef);
        }
        return 0;
      };
      await quickSortHelper(0, arr.length - 1);

    // --- 5. MERGE SORT ---
    } else if (selectedAlgo === 'Merge Sort') {
      const merge = async (start, mid, end) => {
        let left = arr.slice(start, mid + 1);
        let right = arr.slice(mid + 1, end + 1);
        let i = 0, j = 0, k = start;

        while (i < left.length && j < right.length) {
          if (!(await step('compare', start + i, mid + 1 + j, cmpCountRef, swpCountRef))) return -1;
          if (left[i] <= right[j]) {
            arr[k] = left[i];
            i++;
          } else {
            arr[k] = right[j];
            j++;
          }
          setArray([...arr]);
          if (!(await step('overwrite', k, k, cmpCountRef, swpCountRef))) return -1;
          k++;
        }

        while (i < left.length) {
          arr[k] = left[i];
          setArray([...arr]);
          if (!(await step('overwrite', k, k, cmpCountRef, swpCountRef))) return -1;
          i++; k++;
        }
        while (j < right.length) {
          arr[k] = right[j];
          setArray([...arr]);
          if (!(await step('overwrite', k, k, cmpCountRef, swpCountRef))) return -1;
          j++; k++;
        }
        return 0;
      };

      const mergeSortHelper = async (start, end) => {
        if (start >= end) return 0;
        let mid = Math.floor((start + end) / 2);
        if ((await mergeSortHelper(start, mid)) === -1) return -1;
        if ((await mergeSortHelper(mid + 1, end)) === -1) return -1;
        if ((await merge(start, mid, end)) === -1) return -1;
        return 0;
      };

      if ((await mergeSortHelper(0, arr.length - 1)) !== -1) {
        setSortedIndices(Array.from({ length: arr.length }, (_, idx) => idx));
      }

    // --- 6. HEAP SORT ---
    } else if (selectedAlgo === 'Heap Sort') {
      let n = arr.length;

      const heapify = async (size, i) => {
        let largest = i;
        let l = 2 * i + 1;
        let r = 2 * i + 2;

        if (l < size) {
          if (!(await step('compare', l, largest, cmpCountRef, swpCountRef))) return -1;
          if (arr[l] > arr[largest]) largest = l;
        }
        if (r < size) {
          if (!(await step('compare', r, largest, cmpCountRef, swpCountRef))) return -1;
          if (arr[r] > arr[largest]) largest = r;
        }

        if (largest !== i) {
          [arr[i], arr[largest]] = [arr[largest], arr[i]];
          setArray([...arr]);
          if (!(await step('swap', i, largest, cmpCountRef, swpCountRef))) return -1;
          if ((await heapify(size, largest)) === -1) return -1;
        }
        return 0;
      };

      // Build heap
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        if ((await heapify(n, i)) === -1) return;
      }

      // Extract elements from heap
      for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        setArray([...arr]);
        if (!(await step('swap', 0, i, cmpCountRef, swpCountRef))) return;
        await step('sorted', i, -1, cmpCountRef, swpCountRef);
        if ((await heapify(i, 0)) === -1) return;
      }
      await step('sorted', 0, -1, cmpCountRef, swpCountRef);
    }

    setComparing([]);
    setSwapping([]);
    setIsSorting(false);
    isSortingRef.current = false;
  };

  return (
    <div className="app-container">
      <div className="header-bar">
        <h1 className="title">Visual Sorting</h1>
        <div className="metrics-group">
          <div className="metric-item">
            CMP <span>{comparisons}</span>
          </div>
          <div className="metric-item">
            SWP <span>{swaps}</span>
          </div>
          <div className="metric-item">
            ACC <span>0</span>
          </div>
        </div>
      </div>

      <div className="visualizer-card">
        {array.map((value, idx) => {
          let bgColor = '#38bdf8';

          if (swapping.includes(idx)) {
            bgColor = '#ef4444';
          } else if (comparing.includes(idx)) {
            bgColor = '#eab308';
          } else if (sortedIndices.includes(idx)) {
            bgColor = '#22c55e';
          }

          return (
            <div
              key={idx}
              className="array-bar"
              style={{
                height: `${value}px`,
                backgroundColor: bgColor
              }}
            />
          );
        })}
      </div>

      <div className="controls-grid">
        <div className="card-panel">
          <div className="algo-grid">
            {ALGORITHMS.map((algo) => (
              <button
                key={algo}
                className={`btn-algo ${selectedAlgo === algo ? 'active' : ''}`}
                onClick={() => {
                  if (!isSorting) setSelectedAlgo(algo);
                }}
              >
                {algo}
              </button>
            ))}
          </div>
        </div>

        <div className="card-panel">
          <div className="action-row">
            <button className="btn-primary" onClick={handleStartSort}>
              {isSorting ? (isPaused ? 'Resume' : 'Pause') : 'Start'}
            </button>
            <button
              className="btn-secondary"
              onClick={resetArray}
              disabled={isSorting && !isPaused}
            >
              Shuffle
            </button>
          </div>

          <div className="slider-group">
            <div className="slider-control">
              <div className="slider-label">
                <span>Array size</span>
                <span>{arraySize} bars</span>
              </div>
              <input
                type="range"
                min="15"
                max="180"
                value={arraySize}
                disabled={isSorting}
                onChange={(e) => setArraySize(Number(e.target.value))}
              />
            </div>

            <div className="slider-control">
              <div className="slider-label">
                <span>Delay</span>
                <span>{delay} ms</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={delay}
                onChange={(e) => setDelay(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}