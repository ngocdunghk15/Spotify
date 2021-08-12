const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
var listSong;
const playList = $('.playlist');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const runTime = $('.progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [{
            id: 1,
            name: "This is RAP VIET",
            singer: "HLV và GK Rap Việt",
            path: ".../../assets/audio/rapViet.mp3",
            image: ".../../assets/img/rapViet.jpg"
        },
        {
            id: 2,
            name: "Dog in The Car",
            singer: "TLinh",
            path: ".../../assets/audio/chootoTlinh.mp3",
            image: ".../../assets/img/chootoTlinh.jpg",
        },
        {
            id: 3,
            name: "Sparrows and Strawberries",
            singer: "Wowy, Dế Choắt",
            path: ".../../assets/audio/king.mp3",
            image: ".../../assets/img/king.jpg"
        },
        {
            id: 4,
            name: "What's a Lot Of Money for",
            singer: "GDucky ",
            path: ".../../assets/audio/moneyGducky.mp3",
            image: ".../../assets/img/moneyGducky.jpg"
        },
        {
            id: 5,
            name: "Because you are so beautiful",
            singer: "Thành Draw",
            path: ".../../assets/audio/sodepDraw.mp3",
            image: ".../../assets/img/sodepDraw.jpg"
        },
        {
            id: 6,
            name: "Rich for You, Sang For Wife",
            singer: "RPT MCK",
            path: ".../../assets/audio/sovoMCK.mp3",
            image: ".../../assets/img/sovoMCK.jpg"
        },
        {
            id: 7,
            name: "Who is he?",
            singer: "16 Typh",
            path: ".../../assets/audio/who16Typh.mp3",
            image: ".../../assets/img/who16Typh.jpg"
        },
        {
            id: 8,
            name: "My Iron Leather",
            singer: "Tez",
            path: ".../../assets/audio/wukongTez.mp3",
            image: ".../../assets/img/wukongTez.jpg"
        }
    ],
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    render: function() {
        const htmls = this.songs.map(song => {
            return `
            <div class="song">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playList.innerHTML = htmls.join('');
        listSong = $$('.song');
    },
    handleEvents: function() {

        // Xử lí CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([{
            transform: 'rotate(360deg)'
        }], {
            duration: 12000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause();

        //Xử lí phóng to thu nhỏ
        const cdWidth = cd.offsetWidth;
        document.onscroll = function() {
            const scrollTop = (window.scrollY || document.documentElement.scrollTop);
            const newCdWidth = cdWidth - scrollTop;
            console.log(newCdWidth);
            cd.style.width = newCdWidth >= 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth >= 0 ? newCdWidth / cdWidth : 0;

        }

        //Xử lí khi click play btn 
        playBtn.onclick = function() {
            if(!app.isPlaying) {
                audio.play();
            } else {
                audio.pause();

            }
        }
        audio.onplay = function() {
            app.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        audio.onpause = function() {
            app.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();

        }
        audio.ontimeupdate = function() {
                if(audio.duration) {
                    runTime.value = Math.floor(audio.currentTime / audio.duration * 100);
                }
            }
            // Xử lí khi tua song 
        runTime.oninput = function(e) {
                let timeChange = e.target.value;
                audio.currentTime = timeChange * audio.duration / 100;
                console.log(audio.currentTime);

            }
            //Khi next song 
        prevBtn.onclick = function() {
            listSong[app.currentIndex].classList.remove('active');
            if(app.isRandom == true) {
                app.playRandom();
                audio.play();
            } else {
                app.prevSong();
                audio.play();
            }

        }
        nextBtn.onclick = function() {
            listSong[app.currentIndex].classList.remove('active');
            if(app.isRandom == true) {
                app.playRandom();
                audio.play();
            } else {
                app.nextSong();
                audio.play();
            }
        }
        randomBtn.onclick = function() {
            if(!app.isRandom) {
                randomBtn.classList.add('active');
                app.isRandom = true;
            } else {

                randomBtn.classList.remove('active');
                app.isRandom = false;
            }

        }
        audio.onended = function() {

                if(!app.isRepeat) {
                    nextBtn.click();
                } else {
                    audio.play();
                }
            }
            // Xử lí repeat song 
        repeatBtn.onclick = function(e) {
            console.warn(app.isRepeat);
            app.isRepeat = !app.isRepeat;
            console.warn(app.isRepeat);
            repeatBtn.classList.toggle('active', app.isRepeat);
        }
        playList.onclick = function(e) {
            let switchSong = e.target.closest('.song:not(.active)');
            if(switchSong) {
                listSong[app.currentIndex].classList.remove('active');

                for(var i = 0; i < listSong.length; i++) {
                    if(switchSong == listSong[i]) {
                        app.currentIndex = i;
                        app.loadCurrentSong();
                        audio.play();
                        break;
                    }
                }

            }
        }
    },
    scrollToCurrentSong: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behaviour: 'smooth',
                block: 'center',
            });
        }, 200)
    },
    loadCurrentSong: function() {
        listSong[app.currentIndex].classList.add('active');
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        this.scrollToCurrentSong();
        console.log(heading, cdThumb, audio);
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    playRandom() {
        let curSong = this.currentIndex;
        do {
            this.currentIndex = Math.floor(Math.random() * this.songs.length);
        } while (this.currentIndex == curSong);
        this.loadCurrentSong();
    },
    start: function() {
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe các xử lý và sự kiện
        this.handleEvents();
        this.render();
        this.loadCurrentSong();

    }
}

app.start();