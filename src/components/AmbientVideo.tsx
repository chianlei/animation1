import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { media } from "../data/site";
export default function AmbientVideo({
  file,
  poster,
  label,
}: {
  file: string;
  poster?: string;
  label: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const visible = useInView(video);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (visible && !reduced) void video.current?.play().catch(() => {});
    else video.current?.pause();
  }, [visible, reduced]);
  return (
    <video
      ref={video}
      src={media(file)}
      poster={poster ? media(poster) : undefined}
      muted
      loop
      playsInline
      controls={Boolean(reduced)}
      preload="none"
      aria-label={label}
    />
  );
}
