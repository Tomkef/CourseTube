export default function secondsToTimeString(timeInSeconds: number): string {
  const hours = Math.floor(timeInSeconds / (60 * 60));
  const minutes = Math.floor((timeInSeconds % (60 * 60)) / 60);
  const seconds = Math.floor((timeInSeconds % (60 * 60)) % 60);
  return (
    (hours > 0 ? (hours < 10 ? `0${hours}:` : `${hours}:`) : "00:") +
    (minutes > 0 ? (minutes < 10 ? `0${minutes}:` : `${minutes}:`) : "00:") +
    (seconds > 0 ? (seconds < 10 ? `0${seconds}` : `${seconds}`) : "00")
  );
}
