import { H as Hls } from './hls-dru42stk.js';

function ready(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

function showMessage(player, message) {
    var messageBox = player.querySelector('[data-player-message]');
    if (messageBox) {
        messageBox.textContent = message;
        messageBox.hidden = false;
    }
}

function setupPlayer(player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-play-button]');
    var source = video ? video.getAttribute('data-src') : '';
    var attached = false;
    var hls = null;

    if (!video || !button || !source) {
        showMessage(player, '播放源不存在。');
        return;
    }

    function attachSource() {
        if (attached) {
            return true;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            attached = true;
            return true;
        }

        if (Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal) {
                    showMessage(player, '播放器遇到错误，请刷新页面后重试。');
                    if (hls) {
                        hls.destroy();
                        hls = null;
                        attached = false;
                    }
                }
            });
            attached = true;
            return true;
        }

        showMessage(player, '当前浏览器不支持 HLS 播放。');
        return false;
    }

    function play() {
        if (!attachSource()) {
            return;
        }
        video.controls = true;
        button.classList.add('is-hidden');
        video.play().catch(function () {
            button.classList.remove('is-hidden');
            showMessage(player, '浏览器阻止了自动播放，请再次点击播放按钮。');
        });
    }

    button.addEventListener('click', play);
    player.addEventListener('click', function (event) {
        if (event.target === video) {
            return;
        }
        if (!button.classList.contains('is-hidden')) {
            play();
        }
    });
}

ready(function () {
    document.querySelectorAll('[data-player]').forEach(setupPlayer);
});
