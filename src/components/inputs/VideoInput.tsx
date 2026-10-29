import { useEffect, useRef, useState } from 'react';
import { Video, VideoOff, Camera, AlertCircle, RefreshCw } from 'lucide-react';

interface VideoInputProps {
  onCapture: (file: File) => void;
  preview: string | null;
  onError: (msg: string) => void;
}

export function VideoInput({ onCapture, preview, onError }: VideoInputProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [camError, setCamError] = useState('');

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setActive(false);
  };

  const startCamera = async () => {
    setCamError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);
    } catch {
      const msg = 'Could not access the camera. Please grant camera permission or use image upload.';
      setCamError(msg);
      onError(msg);
    }
  };

  useEffect(() => {
    return () => stopStream();
  }, []);

  const capture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'live-capture.jpg', { type: 'image/jpeg' });
        onCapture(file);
        stopStream();
      }
    }, 'image/jpeg', 0.92);
  };

  return (
    <div>
      <div className="rounded-2xl border border-navy-200 bg-navy-50/40 p-4">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Captured leaf"
              className="rounded-xl object-cover w-full h-64 shadow-card"
            />
            <button
              onClick={startCamera}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-navy-950 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-navy-800"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retake
            </button>
          </div>
        ) : (
          <>
            <div className="relative rounded-xl overflow-hidden bg-navy-950 aspect-video flex items-center justify-center">
              <video
                ref={videoRef}
                playsInline
                muted
                className={`w-full h-full object-cover ${active ? '' : 'hidden'}`}
              />
              {!active && (
                <div className="text-center px-6">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-navy-200">
                    <Video className="h-6 w-6" />
                  </span>
                  <p className="mt-3 text-sm text-navy-200">Camera is off</p>
                  <p className="text-xs text-navy-400">Tap below to start the live feed</p>
                </div>
              )}
            </div>

            {camError && (
              <p className="mt-3 text-xs text-red-600">{camError}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              {!active ? (
                <button
                  onClick={startCamera}
                  className="btn-primary !py-2.5"
                >
                  <Video className="h-4 w-4" />
                  Start Camera
                </button>
              ) : (
                <>
                  <button onClick={capture} className="btn-primary !py-2.5">
                    <Camera className="h-4 w-4" />
                    Capture Frame
                  </button>
                  <button onClick={stopStream} className="btn-ghost !py-2.5">
                    <VideoOff className="h-4 w-4" />
                    Stop
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
      <p className="mt-3 flex items-start gap-1.5 text-[11px] text-navy-400">
        <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        Live video uses your device camera to capture a single frame for analysis. No video is
        stored or transmitted in this demo. Grant camera permission when prompted.
      </p>
    </div>
  );
}
