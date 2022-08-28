
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playlist = $('.playlist');
const cd = $('.cd');
let heading = $('header h2');
let cdThumb = $('.cd-thumb');
let audio = $('#audio');
let playBtn = $('.btn-toggle-play');
let player = $('.player');
let progress = $('#progress');
let nextBtn = $('.btn-next');
let prevBtn = $('.btn-prev');
let randomBtn = $('.btn-random');
let repeatBtn = $('.btn-repeat');
const PLAYER_STORAGE_KEY = 'Player'
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  arrRandom: [],
  songs: [
    {
      name: 'Vì anh đâu có biết',
      singer: 'Madihu',
      path: './music/y2mate.com - Vì Anh Đâu Có Biết  Madihu Feat Vũ  Official MV_320kbps.mp3',
      image: './img/img1.png'
    },
    {
      name: 'THICHTHICH',
      singer: 'Phương Ly',
      path: './music/y2mate.com - THICHTHICH  PHƯƠNG LY  OFFCIAL MV_320kbps.mp3',
      image: './img/img2.png'
    },
    {
      name: 'Lạ lùng',
      singer: 'Vũ',
      path: './music/y2mate.com - LẠ LÙNG  Vũ Original_320kbps.mp3',
      image: './img/img3.png'
    },
    {
      name: 'Tôi muốn làm cái cây',
      singer: 'Hoàng Dũng',
      path: './music/y2mate.com - TÔI MUỐN LÀM CÁI CÂY  HOÀNG DŨNG  OFFICIAL MUSIC VIDEO_320kbps.mp3',
      image: './img/img1.png'
    },
    {
      name: 'Bên trên tầng lầu',
      singer: 'Tăng Duy Tân',
      path: './music/y2mate.com - BAE Tăng Duy Tân  Bên Trên Tầng Lầu  Official Lyric Video_320kbps.mp3',
      image: './img/img1.png'
    },
    {
      name: 'Lối nhỏ',
      singer: 'Đen',
      path: './music/y2mate.com - Đen  Lối Nhỏ ft Phương Anh Đào MV_320kbps.mp3',
      image: './img/img1.png'
    },
    {
      name: 'Tháng tư là lời nói dối của em',
      singer: 'Bùi Anh Tuấn',
      path: './music/y2mate.com - Hà Anh Tuấn  Tháng Tư Là Lời Nói Dối Của Em Official MV_320kbps.mp3',
      image: './img/img1.png'
    },
    {
      name: 'Va vào giai điệu này',
      singer: 'MCK',
      path: './music/y2mate.com - RPT MCK  Va Vào Giai Điệu Này   Team Karik  RAP VIỆT MV Lyrics_320kbps.mp3',
      image: './img/img1.png'
    },
    {
      name: 'Chỉ một đêm nữa thôi',
      singer: 'MCK if TLinh',
      path: './music/y2mate.com - MCK TLINH  CHỈ MỘT ĐÊM NỮA THÔI   LIVE BUJI CLUB by NIGHTHUB _320kbps.mp3',
      image: './img/img1.png'
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom || false;
    this.isRepeat = this.config.isRepeat || false;
    this.currentIndex = this.config.currentIndex || 0;
  }
  ,
  render: function () {
    let _this = this;
    let htmls = this.songs.map(function (song, index) {
      return `<div class="song ${index === _this.currentIndex ? 'active' : ''}" data-index = "${index}">
              <div class="thumb" style="background-image: url('${song.image}')">
              </div>
              <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
              </div>
              <div class="option">
                <i class="fas fa-ellipsis-h"></i>
              </div>
    </div>`
    });
    playlist.innerHTML = htmls.join('');
  },
  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex];
      }
    })
  },
  handleEvents: function () {
    let _this = this;
    //Xử lý phóng to thu nhỏ
    let cdWitdh = cd.offsetWidth;
    document.onscroll = function () {
      let scrollTop = window.scrollY || document.documentElement.scrollTop;
      let newCdWitdh = cdWitdh - scrollTop;
      cd.style.width = newCdWitdh > 0 ? `${newCdWitdh}px` : 0;
      cd.style.opacity = newCdWitdh / cdWitdh;
    }
    // Xử lý cd xoay dừng
    const cdThumbAnimate = cdThumb.animate([
      { transform: 'rotate(360deg)' }
    ], {
      duration: 10000,
      iterations: Infinity
    })
    cdThumbAnimate.pause();
    //Xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying === true) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    // khi audio đang chạy
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add('playing');
      _this.setConfig('currentIndex', _this.currentIndex);
      cdThumbAnimate.play();
    }
    // khi audio đang dừng
    audio.onpause = function () {
      player.classList.remove('playing');
      _this.isPlaying = false;
      _this.setConfig('currentIndex', _this.currentIndex);
      cdThumbAnimate.pause();
    }
    // khi audio đang update
    audio.ontimeupdate = function () {
      if (audio.duration) {
        let progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
        progress.value = progressPercent;
      }
    }
    // Next khi kết thúc bài hát
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    }
    // Lắng nghe hành vi khi click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest('.song:not(active)');
      if (songNode || !e.target.closest('.option')) {
        // Xử lý khi click vào song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          audio.play();
          _this.render();
        }
      }
    }

    // Xử lý khi tua bài hát
    progress.oninput = function (e) {
      let seekTime = e.target.value * audio.duration / 100;
      audio.currentTime = seekTime;
    }
    // Khi nhấn next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    }
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    }
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig('isRandom', _this.isRandom)
      randomBtn.classList.toggle("active", _this.isRandom);
    }
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig('isRepeat', _this.isRepeat)
      repeatBtn.classList.toggle("active", _this.isRepeat);
    }
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.setAttribute("src", `${this.currentSong.path}`);
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }

    this.loadCurrentSong();
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 500)
  }
  ,

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  randomSong: function () {
    let newIndex;
    let isCheck = false;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
      if (this.arrRandom.indexOf(newIndex) === -1) {
        this.arrRandom.push(newIndex);
        isCheck = false;
      } else {
        if (this.arrRandom.length === this.songs.length) {
          this.arrRandom = Array.apply(this.songs.length).fill(0);
          isCheck = false;
        } else {
          isCheck = true;
        }
      }
    } while (newIndex === this.currentIndex || isCheck);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },


  start: function () {
    //
    this.loadConfig();
    // Định nghĩa thuộc tính cho object
    this.defineProperties();
    // Các sự kiện
    this.handleEvents();
    //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();
    //render các bài hát có sẵn
    this.render();

    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  }
}

app.start()
