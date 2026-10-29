import { useEffect, useRef, useState } from 'react';
import { Mic, Square, AlertCircle, AudioLines } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onError: (msg: string) => void;
}

// Stub for backend speech-to-text integration.
interface SpeechRecognitionResult {
  transcript: string;
}

type RecognitionState = 'idle' | 'listening' | 'unsupported';

export function VoiceInput({ onTranscript, onError }: VoiceInputProps) {
  const [state, setState] = useState<RecognitionState>('idle');
  const [transcript, setTranscript] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const recRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setState('unsupported');
      return;
    }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.onresult = (e: any) => {
      let text = '';
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      setTranscript(text);
      onTranscript(text);
    };
    rec.onerror = () => {
      onError('Voice capture error. Please try again.');
      stop();
    };
    recRef.current = rec;
    return () => {
      stop();
      recRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = () => {
    if (!recRef.current) return;
    setTranscript('');
    setElapsed(0);
    recRef.current.start();
    setState('listening');
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
  };

  const stop = () => {
    try {
      recRef.current?.stop();
    } catch {
      /* noop */
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setState('idle');
  };

  if (state === 'unsupported') {
    return (
      <div className="rounded-2xl border border-navy-200 bg-navy-50/40 p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-navy-100 text-navy-400">
          <Mic className="h-6 w-6" />
        </span>
        <p className="mt-4 font-display text-base font-semibold text-navy-800">
          Voice input not supported in this browser
        </p>
        <p className="mt-1.5 text-sm text-navy-500 max-w-xs mx-auto">
          Please use a Chromium-based browser (Chrome or Edge) for speech recognition, or switch
          to text or image input.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-2xl border border-navy-200 bg-navy-50/40 p-6">
        <div className="flex flex-col items-center text-center">
          <button
            onClick={state === 'listening' ? stop : start}
            className={`relative grid h-20 w-20 place-items-center rounded-full transition-all ${
              state === 'listening'
                ? 'bg-red-500 text-white'
                : 'bg-brand-600 text-white hover:bg-brand-700'
            }`}
            aria-label={state === 'listening' ? 'Stop recording' : 'Start recording'}
          >
            {state === 'listening' && (
              <>
                <span className="absolute inset-0 rounded-full bg-red-400 animate-pulse-ring" />
                <span
                  className="absolute inset-0 rounded-full bg-red-400 animate-pulse-ring"
                  style={{ animationDelay: '0.8s' }}
                />
              </>
            )}
            <span className="relative">
              {state === 'listening' ? (
                <Square className="h-7 w-7" fill="currentColor" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </span>
          </button>
          <p className="mt-4 font-display text-sm font-semibold text-navy-800">
            {state === 'listening' ? `Listening… ${elapsed}s` : 'Tap to record symptoms'}
          </p>
          <p className="mt-1 text-xs text-navy-500">
            Describe the plant's condition aloud — the transcript will appear below.
          </p>
        </div>

        {transcript && (
          <div className="mt-5 rounded-xl border border-navy-100 bg-white p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-navy-500">
              <AudioLines className="h-3.5 w-3.5 text-brand-600" />
              Live transcript
            </p>
            <p className="mt-2 text-sm text-navy-800 leading-relaxed">{transcript}</p>
          </div>
        )}
      </div>
      <p className="mt-3 flex items-start gap-1.5 text-[11px] text-navy-400">
        <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        Uses the browser SpeechRecognition API. In production, audio may instead be streamed to a
        server-side speech-to-text service before NLP classification.
      </p>
    </div>
  );
}
