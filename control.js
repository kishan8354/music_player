let music = new Audio();
let playBtn = document.querySelector(".fa-play");
let stopBtn = document.querySelector(".fa-stop");
let nextBtn = document.querySelector(".fa-forward-step");
let prevBtn = document.querySelector(".fa-backward-step");
let wave = document.querySelector(".wave");
let seek = document.getElementById("seek");
let bar2 = document.getElementById("bar2");
let dot = document.querySelector(".bar .dot");
let vol = document.getElementById("vol");
let volBar = document.querySelector(".vol_bar");
let volDot = document.getElementById("vol_dot");
let currentStart = document.getElementById("currentStart");
let currentEnd = document.getElementById("currentEnd");
let poster = document.getElementById("poster_music_player");
let title = document.getElementById("title");
let downloadBtn = document.getElementById("download_music");

let songs = [
  { id: 1, title: "On My Way", artist: "Alan Walker", img: "1.jpg", src: "1.mp3" },
  { id: 2, title: "Faded", artist: "Alan Walker", img: "2.jpg", src: "2.mp3" },
  { id: 3, title: "Alone", artist: "Alan Walker", img: "3.jpg", src: "3.mp3" },
  { id: 4, title: "Spectre", artist: "Alan Walker", img: "4.jpg", src: "4.mp3" },
  { id: 5, title: "Darkside", artist: "Alan Walker", img: "5.jpg", src: "5.mp3" },
  { id: 6, title: "Ignite", artist: "K-391", img: "6.jpg", src: "6.mp3" },
  { id: 7, title: "Tum Se Hi", artist: "Arijit Singh", img: "7.jpg", src: "7.mp3" },
  { id: 8, title: "Lut Gaye", artist: "Jubin Nautiyal", img: "8.jpg", src: "8.mp3" },
  { id: 9, title: "Vaaste", artist: "Dhvani Bhanushali", img: "9.jpg", src: "9.mp3" }
];

// Playlist will be set by the page (e.g., lastListened, recommendedSongs, etc.)
let currentPlaylist = JSON.parse(localStorage.getItem("lastListened") || "[]");
let currentSongIndex = 0;
let isPlaying = false;

function loadSong(id) {
  let song = songs.find(s => s.id === id);
  if (!song) return;
  music.src = `assets/audio/${song.src}`;
  poster.src = `assets/img/${song.img}`;
  title.innerHTML = `${song.title} <div class="subtitle">${song.artist}</div>`;
  downloadBtn.setAttribute("data-file", song.src);
  music.addEventListener("loadedmetadata", () => {
    currentEnd.textContent = formatTime(music.duration);
    seek.max = music.duration;
  }, { once: true });
  saveLastListened(song.id);
}

function playSong() {
  music.play();
  isPlaying = true;
  playBtn.classList.remove("fa-play");
  playBtn.classList.add("fa-pause");
  wave.classList.add("active1");
}

function pauseSong() {
  music.pause();
  isPlaying = false;
  playBtn.classList.remove("fa-pause");
  playBtn.classList.add("fa-play");
  wave.classList.remove("active1");
}

function stopSong() {
  music.pause();
  music.currentTime = 0;
  isPlaying = false;
  playBtn.classList.remove("fa-pause");
  playBtn.classList.add("fa-play");
  wave.classList.remove("active1");
  seek.value = 0;
  bar2.style.width = "0%";
  dot.style.left = "0%";
  currentStart.textContent = "0:00";
}

function playPause() {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

function nextSong() {
  if (currentPlaylist.length === 0) return;
  currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
  loadSong(currentPlaylist[currentSongIndex]);
  if (isPlaying) playSong();
}

function prevSong() {
  if (currentPlaylist.length === 0) return;
  currentSongIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
  loadSong(currentPlaylist[currentSongIndex]);
  if (isPlaying) playSong();
}

function formatTime(seconds) {
  let min = Math.floor(seconds / 60);
  let sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

function updateSeekBar() {
  seek.value = music.currentTime;
  bar2.style.width = `${(music.currentTime / music.duration) * 100}%`;
  dot.style.left = `${(music.currentTime / music.duration) * 100}%`;
  currentStart.textContent = formatTime(music.currentTime);
}

function setSeek() {
  music.currentTime = seek.value;
}

function setVolume() {
  music.volume = vol.value / 100;
  volBar.style.width = `${vol.value}%`;
  volDot.style.left = `${vol.value}%`;
}

function downloadSong() {
  let file = downloadBtn.getAttribute("data-file");
  let a = document.createElement("a");
  a.href = `assets/audio/${file}`;
  a.download = file;
  a.click();
}

function saveLastListened(id) {
  let lastListened = JSON.parse(localStorage.getItem("lastListened") || "[]");
  lastListened = lastListened.filter(songId => songId != id);
  lastListened.unshift(id);
  if (lastListened.length > 5) lastListened.pop();
  localStorage.setItem("lastListened", JSON.stringify(lastListened));
  currentPlaylist = lastListened;
}

// Event Listeners
playBtn.addEventListener("click", playPause);
stopBtn.addEventListener("click", stopSong);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);
seek.addEventListener("input", setSeek);
vol.addEventListener("input", setVolume);
downloadBtn.addEventListener("click", downloadSong);
music.addEventListener("timeupdate", updateSeekBar);
music.addEventListener("ended", nextSong);

// Initialize
if (currentPlaylist.length > 0) {
  loadSong(currentPlaylist[currentSongIndex]);
} else {
  loadSong(8); // Default to "Lut Gaye" if no last listened songs
  currentPlaylist = [8];
}
vol.value = 50;
setVolume();
