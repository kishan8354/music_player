let music = new Audio();
let playBtn = document.querySelector(".fa-play");
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
let shuffleBtn = document.querySelector(".fa-shuffle");
let prevBtn = document.querySelector(".fa-backward-step");
let nextBtn = document.querySelector(".fa-forward-step");
let downloadBtn = document.getElementById("download_music");
let songContainer = document.getElementById("last_listen_songs");

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

let lastListened = JSON.parse(localStorage.getItem("lastListened") || "[]");
let currentSongIndex = 0;
let isPlaying = false;
let isShuffling = false;

function loadSong(id) {
  let song = songs.find(s => s.id === id);
  if (!song) return;
  music.src = `Music Website Img and Audio File_/audio/${song.src}`;
  poster.src = `Music Website Img and Audio File_/img/${song.img}`;
  title.innerHTML = `${song.title} <div class="subtitle">${song.artist}</div>`;
  downloadBtn.setAttribute("data-file", song.src);
  music.addEventListener("loadedmetadata", () => {
    currentEnd.textContent = formatTime(music.duration);
    seek.max = music.duration;
  }, { once: true });
  saveLastListened(song.id);
}

function playPause() {
  if (isPlaying) {
    music.pause();
    playBtn.classList.remove("fa-pause");
    playBtn.classList.add("fa-play");
    wave.classList.remove("active1");
  } else {
    music.play();
    playBtn.classList.remove("fa-play");
    playBtn.classList.add("fa-pause");
    wave.classList.add("active1");
  }
  isPlaying = !isPlaying;
}

function nextSong() {
  if (lastListened.length === 0) return;
  if (isShuffling) {
    currentSongIndex = Math.floor(Math.random() * lastListened.length);
  } else {
    currentSongIndex = (currentSongIndex + 1) % lastListened.length;
  }
  loadSong(lastListened[currentSongIndex]);
  if (isPlaying) music.play();
  wave.classList.add("active1");
  playBtn.classList.remove("fa-play");
  playBtn.classList.add("fa-pause");
}

function prevSong() {
  if (lastListened.length === 0) return;
  currentSongIndex = (currentSongIndex - 1 + lastListened.length) % lastListened.length;
  loadSong(lastListened[currentSongIndex]);
  if (isPlaying) music.play();
  wave.classList.add("active1");
  playBtn.classList.remove("fa-play");
  playBtn.classList.add("fa-pause");
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

function toggleShuffle() {
  isShuffling = !isShuffling;
  shuffleBtn.style.color = isShuffling ? "#36e2ec" : "white";
}

function playSong(id) {
  currentSongIndex = lastListened.indexOf(parseInt(id));
  if (currentSongIndex === -1) {
    currentSongIndex = 0;
    lastListened.unshift(parseInt(id));
    if (lastListened.length > 5) lastListened.pop();
    localStorage.setItem("lastListened", JSON.stringify(lastListened));
    renderSongs();
  }
  loadSong(id);
  music.play();
  isPlaying = true;
  playBtn.classList.remove("fa-play");
  playBtn.classList.add("fa-pause");
  wave.classList.add("active1");
}

function downloadSong() {
  let file = downloadBtn.getAttribute("data-file");
  let a = document.createElement("a");
  a.href = `Music Website Img and Audio File_/audio/${file}`;
  a.download = file;
  a.click();
}

function toggleFavorite(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  if (favorites.includes(id)) {
    favorites = favorites.filter(fav => fav != id);
    document.querySelectorAll(`.fa-heart[data-id="${id}"]`).forEach(btn => btn.classList.remove("active"));
  } else {
    favorites.push(id);
    document.querySelectorAll(`.fa-heart[data-id="${id}"]`).forEach(btn => btn.classList.add("active"));
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function saveLastListened(id) {
  let lastListened = JSON.parse(localStorage.getItem("lastListened") || "[]");
  lastListened = lastListened.filter(songId => songId != id);
  lastListened.unshift(id);
  if (lastListened.length > 5) lastListened.pop();
  localStorage.setItem("lastListened", JSON.stringify(lastListened));
  renderSongs();
}

function renderSongs() {
  songContainer.innerHTML = "";
  lastListened.forEach((id, index) => {
    let song = songs.find(s => s.id === id);
    if (song) {
      let li = document.createElement("li");
      li.className = "songItem";
      li.innerHTML = `
        <span>${(index + 1).toString().padStart(2, "0")}</span>
        <img src="Music Website Img and Audio File_/img/${song.img}" alt="${song.title} cover">
        <h5>${song.title} <br> <div class="subtitle">${song.artist}</div></h5>
        <i class="fa-sharp playlistplay fa-solid fa-circle-play" id="${song.id}"></i>
        <i class="fa-solid fa-heart favorite" data-id="${song.id}"></i>
      `;
      songContainer.appendChild(li);
    }
  });
  document.querySelectorAll(".playlistplay").forEach(btn => {
    btn.addEventListener("click", () => playSong(btn.id));
  });
  document.querySelectorAll(".fa-heart").forEach(btn => {
    btn.addEventListener("click", () => toggleFavorite(parseInt(btn.dataset.id)));
  });
  initFavorites();
}

function initFavorites() {
  let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  document.querySelectorAll(".fa-heart").forEach(btn => {
    if (favorites.includes(parseInt(btn.dataset.id))) {
      btn.classList.add("active");
    }
  });
}

// Event Listeners
playBtn.addEventListener("click", playPause);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);
seek.addEventListener("input", setSeek);
vol.addEventListener("input", setVolume);
shuffleBtn.addEventListener("click", toggleShuffle);
downloadBtn.addEventListener("click", downloadSong);
music.addEventListener("timeupdate", updateSeekBar);
music.addEventListener("ended", nextSong);

// Initialize
if (lastListened.length > 0) {
  loadSong(lastListened[currentSongIndex]);
} else {
  loadSong(8); // Default to "Lut Gaye" if no last listened songs
}
vol.value = 50;
setVolume();
renderSongs();