const video = document.getElementById('movie-player');
const startButton = document.querySelector('[data-player-start]');
const playerWrap = document.querySelector('.player-wrap');

if (video) {
    const source = video.getAttribute('data-src');
    let initialized = false;

    const attachSource = () => {
        if (!source || initialized) {
            return;
        }

        initialized = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
            const hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
        } else {
            video.src = source;
        }
    };

    const startPlayback = () => {
        attachSource();
        const playPromise = video.play();

        if (playPromise && typeof playPromise.then === 'function') {
            playPromise.then(() => {
                if (playerWrap) {
                    playerWrap.classList.add('playing');
                }
            }).catch(() => {
                if (playerWrap) {
                    playerWrap.classList.remove('playing');
                }
            });
        } else if (playerWrap) {
            playerWrap.classList.add('playing');
        }
    };

    video.addEventListener('play', () => {
        if (playerWrap) {
            playerWrap.classList.add('playing');
        }
    });

    video.addEventListener('pause', () => {
        if (playerWrap && video.currentTime === 0) {
            playerWrap.classList.remove('playing');
        }
    });

    if (startButton) {
        startButton.addEventListener('click', startPlayback);
    }

    video.addEventListener('click', () => {
        if (video.paused) {
            startPlayback();
        }
    });
}
