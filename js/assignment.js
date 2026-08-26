document.addEventListener("DOMContentLoaded", () => {
  const video = document.querySelector(".video-wrapper video");
  const VIDEO_KEY = "sf_tutorialProgress";

  if (!video) return;

  const savedTime = localStorage.getItem(VIDEO_KEY);
  if (savedTime) {
    video.addEventListener("loadedmetadata", () => {
      video.currentTime = parseFloat(savedTime);
    });
  }

  video.addEventListener("timeupdate", () => {
    if (Math.floor(video.currentTime) % 5 === 0) {
      localStorage.setItem(VIDEO_KEY, video.currentTime);
    }
  });

  video.addEventListener("ended", () => {
    localStorage.removeItem(VIDEO_KEY);
  });
});
