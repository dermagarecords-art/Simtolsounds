type Props = { status: string; active: boolean; error: boolean };

export function PlaybackProgress({ status, active, error }: Props) {
  const message = error ? "AUDIO FILE UNAVAILABLE" : active ? status.toUpperCase() : "";
  return <p className="track-status" role="status" aria-live="polite">{message}</p>;
}
