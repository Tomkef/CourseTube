export default function parseChapters(str: string, videoDuration: number) {
  const regExp =
    /\({0,1}(?<time>\d{1,2}:\d{1,2}:?\d{0,2})\){0,1}[^[[:alnum:]]*(?<title>.*$)/gm;
  let match = regExp.exec(str);

  let chapters = [];
  let id = 0;
  while (match !== null) {
    let timeInSeconds = timeStringtoSeconds(match.groups.time);
    chapters.push({
      id: id,
      time: timeInSeconds,
      title: match.groups.title.trim(),
      viewed: false,
    });
    id++;
    match = regExp.exec(str);
  }

  if (chapters.length === 0) {
    return chapters;
  }

  addChaptersDuration(chapters, videoDuration);

  return chapters;
}

function timeStringtoSeconds(timeString: string): number {
  let timeInSeconds = 0;
  let timeArray = timeString.split(":").reverse();
  timeInSeconds += parseInt(timeArray[0]);
  timeInSeconds += parseInt(timeArray[1]) * 60;
  if (timeArray.length === 3) {
    timeInSeconds += parseInt(timeArray[2]) * 60 * 60;
  }

  return timeInSeconds;
}

function addChaptersDuration(chapters, videoDuration: number): void {
  for (let index = 0; index < chapters.length - 1; index++) {
    chapters[index].duration = chapters[index + 1].time - chapters[index].time;
  }

  chapters[chapters.length - 1].duration =
    videoDuration - chapters[chapters.length - 1].time;
}
