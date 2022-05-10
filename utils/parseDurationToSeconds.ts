const parseDurationToSeconds = (duration: string): number => {
  const match = duration.match(/P(\d+Y)?(\d+W)?(\d+D)?T(\d+H)?(\d+M)?(\d+S)?/);

  if (!match) {
    console.log(`Invalid YouTube video duration: ${duration}`);
    throw new Error("Problem with Youtube video's duration");
  }

  const [years, weeks, days, hours, minutes, seconds] = match
    .slice(1)
    .map((_) => (_ ? parseInt(_.replace(/\D/, "")) : 0));

  return (
    (((years * 365 + weeks * 7 + days) * 24 + hours) * 60 + minutes) * 60 +
    seconds
  );
};

export default parseDurationToSeconds;
