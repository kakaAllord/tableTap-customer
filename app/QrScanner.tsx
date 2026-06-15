"use client";

import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

interface QrScannerProps {
  onScan: (tableNumber: number) => void;
  /** When provided, a "Cancel" button is shown so the user can dismiss the scanner. */
  onCancel?: () => void;
}

// Pulls the table number out of a "TABLE-TAP:{table-number}" payload.
// Tolerates surrounding whitespace and is case-insensitive.
export function parseTableQr(raw: string): number | null {
  const match = raw.trim().match(/TABLE-TAP:\s*(\d+)/i);
  if (!match) return null;
  const n = parseInt(match[1], 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export default function QrScanner({ onScan, onCancel }: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const handledRef = useRef(false);

  const [error, setError] = useState<string | null>(null);
  const [manualValue, setManualValue] = useState("");

  // Fires once a valid table QR is found (or manually entered).
  const handleResult = (tableNumber: number) => {
    if (handledRef.current) return;
    handledRef.current = true;
    stopCamera();
    onScan(tableNumber);
  };

  const stopCamera = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    let cancelled = false;
    // Prefer the platform BarcodeDetector when available (Android Chrome, etc.),
    // otherwise decode frames with jsQR.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const BarcodeDetectorCtor = (globalThis as any).BarcodeDetector;
    let detector: { detect: (src: CanvasImageSource) => Promise<{ rawValue: string }[]> } | null =
      null;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        video.setAttribute("playsinline", "true");
        await video.play();

        if (BarcodeDetectorCtor) {
          try {
            detector = new BarcodeDetectorCtor({ formats: ["qr_code"] });
          } catch {
            detector = null;
          }
        }

        scanLoop();
      } catch {
        setError(
          "Camera unavailable. Allow camera access or enter your table number below."
        );
      }
    };

    const scanLoop = async () => {
      const video = videoRef.current;
      if (!video || handledRef.current) return;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        try {
          if (detector) {
            const codes = await detector.detect(video);
            for (const code of codes) {
              const table = parseTableQr(code.rawValue);
              if (table) return handleResult(table);
            }
          } else {
            const canvas = canvasRef.current;
            if (canvas) {
              const w = video.videoWidth;
              const h = video.videoHeight;
              if (w && h) {
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext("2d", { willReadFrequently: true });
                if (ctx) {
                  ctx.drawImage(video, 0, 0, w, h);
                  const imageData = ctx.getImageData(0, 0, w, h);
                  const result = jsQR(imageData.data, w, h, {
                    inversionAttempts: "dontInvert",
                  });
                  if (result) {
                    const table = parseTableQr(result.data);
                    if (table) return handleResult(table);
                  }
                }
              }
            }
          }
        } catch {
          // Ignore transient decode errors and keep scanning.
        }
      }

      rafRef.current = requestAnimationFrame(scanLoop);
    };

    start();

    return () => {
      cancelled = true;
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseInt(manualValue, 10);
    if (Number.isFinite(n) && n > 0) {
      handleResult(n);
    } else {
      setError("Please enter a valid table number.");
    }
  };

  return (
    <div className="scanner-screen">
      <div className="scanner-inner">
        <h1 className="scanner-title">Scan your table QR</h1>
        <p className="scanner-subtitle">
          Point your camera at the <strong>TableTap</strong> code on your table to start ordering.
        </p>

        <div className="scanner-viewport">
          <video ref={videoRef} className="scanner-video" muted playsInline />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <div className="scanner-frame" aria-hidden="true">
            <span className="scanner-corner tl" />
            <span className="scanner-corner tr" />
            <span className="scanner-corner bl" />
            <span className="scanner-corner br" />
            <div className="scanner-laser" />
          </div>
        </div>

        {error && <div className="scanner-error">{error}</div>}

        <form className="scanner-manual" onSubmit={handleManualSubmit}>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            className="scanner-manual-input"
            placeholder="Or enter table number"
            value={manualValue}
            onChange={(e) => setManualValue(e.target.value)}
          />
          <button type="submit" className="scanner-manual-btn">
            Go
          </button>
        </form>

        {onCancel && (
          <button
            type="button"
            className="scanner-cancel"
            onClick={() => {
              stopCamera();
              onCancel();
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
