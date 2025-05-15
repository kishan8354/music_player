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
let popSongLeft = document.getElementById("pop_song_left");
let popSongRight = document.getElementById("pop_song_right");
let popSongs = document.querySelector(".pop_songs");
let popArtistLeft = document.getElementById("pop_artist_left");
let popArtistRight = document.getElementById("pop_artist_right");
let popArtists = document.querySelector(".popular_artist .item");

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

let currentSongIndex = 7; // Start with "Lut Gaye"
let isPlaying = false;
let isShuffling = false;

function loadSong(index) {
  let song = songs[index];
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
  if (isShuffling) {
    currentSongIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
  }
  loadSong(currentSongIndex);
  if (isPlaying) music.play();
  wave.classList.add("active1");
  playBtn.classList.remove("fa-play");
  playBtn.classList.add("fa-pause");
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
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
  currentSongIndex = songs.findIndex(song => song.id == id);
  loadSong(currentSongIndex);
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

function scrollSongs(direction) {
  popSongs.scrollLeft += direction * 200;
}

function scrollArtists(direction) {
  popArtists.scrollLeft += direction * 200;
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
popSongLeft.addEventListener("click", () => scrollSongs(-1));
popSongRight.addEventListener("click", () => scrollSongs(1));
popArtistLeft.addEventListener("click", () => scrollArtists(-1));
popArtistRight.addEventListener("click", () => scrollArtists(1));
document.querySelectorAll(".playlistplay").forEach(btn => {
  btn.addEventListener("click", () => playSong(btn.id));
});
document.querySelectorAll(".fa-heart").forEach(btn => {
  btn.addEventListener("click", () => toggleFavorite(btn.dataset.id));
});
music.addEventListener("timeupdate", updateSeekBar);
music.addEventListener("ended", nextSong);

// Initialize
loadSong(currentSongIndex);
vol.value = 50;
setVolume();
initFavorites();