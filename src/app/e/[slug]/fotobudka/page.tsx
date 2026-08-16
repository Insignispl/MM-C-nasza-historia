"use client";

import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { Camera, CheckCircle2, Circle, FlipHorizontal2, Loader2, RefreshCw, Send, Video } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Mode = "photo" | "video";
type Status = "loading" | "ready" | "countdown" | "recording" | "preview" | "sending" | "done" | "unavailable";

export default function PhotoBoothPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = useMemo(() => createClient(), []);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const burstRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const [eventId, setEventId] = useState("");
  const [coupleName, setCoupleName] = useState("");
  const [mode, setMode] = useState<Mode>("photo");
  const [status, setStatus] = useState<Status>("loading");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [asset, setAsset] = useState<Blob | null>(null);
  const [assetUrl, setAssetUrl] = useState("");
  const [guestName, setGuestName] = useState("");
  const [camera, setCamera] = useState<"user" | "environment">("user");
  const [frameStyle, setFrameStyle] = useState("classic");
  const [captureDelay, setCaptureDelay] = useState(3);
  const [burstCount, setBurstCount] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    params.then(async ({ slug }) => {
      const { data } = await supabase.from("events").select("id,couple_name,kiosk_enabled,kiosk_countdown_seconds,kiosk_burst_count,kiosk_frame_style").eq("slug", slug).single();
      if (!data?.kiosk_enabled) { setStatus("unavailable"); return; }
      setEventId(data.id);
      setCoupleName(data.couple_name);
      setCaptureDelay(data.kiosk_countdown_seconds);
      setBurstCount(data.kiosk_burst_count);
      setFrameStyle(data.kiosk_frame_style);
      await startCamera("photo", camera);
    });
    return () => stopCamera();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function stopCamera() { streamRef.current?.getTracks().forEach((track) => track.stop()); streamRef.current = null; }

  async function startCamera(nextMode: Mode, facing: "user" | "environment") {
    stopCamera();
    try {
      const nextStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: nextMode === "video" });
      streamRef.current = nextStream;
      if (videoRef.current) videoRef.current.srcObject = nextStream;
      setStatus("ready");
      setError("");
    } catch {
      setError("Nie udało się uruchomić aparatu lub mikrofonu. Zezwól przeglądarce na dostęp.");
      setStatus("ready");
    }
  }

  async function switchMode(nextMode: Mode) {
    setMode(nextMode);
    await startCamera(nextMode, camera);
  }

  async function flipCamera() {
    const nextCamera = camera === "user" ? "environment" : "user";
    setCamera(nextCamera);
    await startCamera(mode, nextCamera);
  }

  function runCountdown(action: () => void) {
    if (!captureDelay) { action(); return; }
    setStatus("countdown");
    let value = captureDelay;
    setCountdown(value);
    const timer = window.setInterval(() => {
      value -= 1;
      setCountdown(value || null);
      if (value <= 0) { window.clearInterval(timer); action(); }
    }, 1000);
  }

  function takePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return Promise.resolve(null);
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
  }

  async function capturePhoto() {
    burstRef.current = [];
    for (let index = 0; index < burstCount; index += 1) {
      const blob = await takePhoto();
      if (blob) burstRef.current.push(blob);
      if (index < burstCount - 1) await new Promise((resolve) => window.setTimeout(resolve, 450));
    }
    if (burstRef.current[0]) preview(burstRef.current[0]);
  }

  function recordVideo() {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current, { mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus") ? "video/webm;codecs=vp9,opus" : "video/webm" });
    recorderRef.current = recorder;
    recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
    recorder.onstop = () => preview(new Blob(chunksRef.current, { type: "video/webm" }));
    recorder.start();
    setStatus("recording");
    window.setTimeout(() => recorder.state === "recording" && recorder.stop(), 8000);
  }

  function preview(blob: Blob) {
    stopCamera();
    setAsset(blob);
    setAssetUrl(URL.createObjectURL(blob));
    setStatus("preview");
  }

  async function submit() {
    if (!asset || !eventId) return;
    setStatus("sending");
    const assets = mode === "photo" && burstRef.current.length ? burstRef.current : [asset];
    const timestamp = Date.now();
    const results = await Promise.all(assets.map(async (item, index) => {
      const extension = mode === "video" ? "webm" : "jpg";
      const path = `events/${eventId}/photobooth-${timestamp}-${index + 1}.${extension}`;
      const file = new File([item], `story-atelier-${timestamp}-${index + 1}.${extension}`, { type: item.type });
      const { error: uploadError } = await supabase.storage.from("event-media").upload(path, file);
      if (uploadError) return uploadError;
      const { data: url } = supabase.storage.from("event-media").getPublicUrl(path);
      const { error: insertError } = await supabase.from("event_media").insert({ event_id: eventId, type: mode === "video" ? "video" : "image", storage_path: path, public_url: url.publicUrl, guest_name: guestName || "Gość fotobudki", source: "kiosk", approved: false });
      return insertError;
    }));
    const error = results.find(Boolean);
    if (error) { setError(error.message); setStatus("preview"); return; }
    setStatus("done");
  }

  function reset() {
    if (assetUrl) URL.revokeObjectURL(assetUrl);
    burstRef.current = [];
    setAsset(null); setAssetUrl(""); setGuestName(""); setCountdown(null); setError(""); startCamera(mode, camera);
  }

  if (status === "unavailable") return <main className="flex min-h-screen items-center justify-center bg-[#1b1120] p-6 text-center text-white"><div><h1 className="font-serif text-4xl">Fotobudka jest niedostępna</h1><p className="mt-3 text-white/70">Fotograf nie włączył jeszcze tego trybu.</p></div></main>;

  return <main className="min-h-screen bg-[#1b1120] p-4 text-white sm:p-8"><div className={`mx-auto min-h-[calc(100vh-2rem)] max-w-6xl rounded-[2.5rem] border p-5 shadow-2xl sm:p-10 ${frameStyle === "neon" ? "border-fuchsia-400 shadow-fuchsia-500/30" : frameStyle === "film" ? "border-amber-200/70 bg-[#0b0b0b]" : frameStyle === "minimal" ? "border-white/15 bg-[#141018]" : "border-white/10 bg-gradient-to-br from-[#4b2e56] to-[#18101c]"}`}><header className="text-center"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">Story Atelier · Fotobudka</p><h1 className="mt-2 font-serif text-4xl sm:text-6xl">{coupleName || "Ładujemy wydarzenie…"}</h1><p className="mt-3 text-white/70">Zatrzymaj tę chwilę. Zdjęcie{burstCount > 1 ? ` × ${burstCount}` : ""} lub 8-sekundowy film.</p></header><div className="mx-auto mt-7 flex max-w-md rounded-2xl bg-black/25 p-1"><button onClick={() => switchMode("photo")} className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold ${mode === "photo" ? "bg-white text-[#2d1735]" : "text-white/70"}`}><Camera className="mr-2 inline h-4 w-4" /> Zdjęcie</button><button onClick={() => switchMode("video")} className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold ${mode === "video" ? "bg-white text-[#2d1735]" : "text-white/70"}`}><Video className="mr-2 inline h-4 w-4" /> Wideo</button></div><section className="relative mx-auto mt-7 flex max-w-4xl items-center justify-center overflow-hidden rounded-[2rem] bg-black aspect-video"><video ref={videoRef} autoPlay playsInline muted={mode === "photo"} className={status === "ready" || status === "countdown" || status === "recording" ? "h-full w-full object-cover" : "hidden"} /><canvas ref={canvasRef} className="hidden" />{asset && mode === "photo" && <Image src={assetUrl} alt="Podgląd z fotobudki" fill unoptimized sizes="(max-width: 1200px) 100vw, 80vw" className="object-contain" />}{asset && mode === "photo" && burstRef.current.length > 1 && <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/65 px-4 py-2 text-sm font-semibold">Seria {burstRef.current.length} zdjęć</span>}{asset && mode === "video" && <video src={assetUrl} controls autoPlay playsInline className="h-full w-full object-contain" />}{status === "loading" && <Loader2 className="h-10 w-10 animate-spin" />}{countdown !== null && <span className="absolute inset-0 flex items-center justify-center bg-black/30 font-serif text-[9rem] text-white animate-pulse">{countdown}</span>}{status === "recording" && <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold"><Circle className="h-3 w-3 fill-current" /> Nagrywanie</span>}</section>{error && <p className="mx-auto mt-4 max-w-4xl rounded-xl bg-red-500/15 p-3 text-center text-sm text-red-100">{error}</p>}{status === "done" ? <div className="mt-7 text-center"><CheckCircle2 className="mx-auto h-16 w-16 text-emerald-300" /><h2 className="mt-3 font-serif text-3xl">Wspomnienie zapisane!</h2><p className="mt-2 text-white/70">Po akceptacji pojawi się w albumie Pary.</p><Button onClick={reset} className="mt-5"><RefreshCw className="mr-2 h-4 w-4" /> Kolejna chwila</Button></div> : status === "preview" ? <div className="mx-auto mt-6 flex max-w-4xl flex-col gap-3 sm:flex-row"><input value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="Twoje imię (opcjonalnie)" className="h-12 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 text-white outline-none placeholder:text-white/50" /><Button onClick={submit} className="h-12 gap-2"><Send className="h-4 w-4" /> Wyślij do albumu</Button><Button onClick={reset} variant="outline" className="h-12 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"><RefreshCw className="h-4 w-4" /></Button></div> : <div className="mt-6 flex justify-center gap-3"><Button onClick={() => runCountdown(mode === "photo" ? capturePhoto : recordVideo)} disabled={status !== "ready"} className="h-14 rounded-full px-8 text-base">{mode === "photo" ? <Camera className="mr-2 h-5 w-5" /> : <Video className="mr-2 h-5 w-5" />}{mode === "photo" ? "Zrób zdjęcie" : "Nagraj 8 sekund"}</Button><Button onClick={flipCamera} variant="outline" className="h-14 w-14 rounded-full border-white/30 bg-transparent p-0 text-white hover:bg-white/10 hover:text-white"><FlipHorizontal2 className="h-5 w-5" /></Button></div>}</div></main>;
}
