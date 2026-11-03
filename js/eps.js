// EP catalogue - shared by the portfolio (index.html) and the listening page (ep.html).
// Each EP is reachable at /ep/<slug>, the link sent to listeners and libraries.
// A track's preview is the section played on its own, or in the all-previews reel.
const EPS = [
    {
        slug: 'piano-and-orchestra-1',
        title: 'Piano and Orchestra 1',
        tracks: [
            { title: 'Trees', src: '/audio/Trees.mp3', preview: { start: '0:45', end: '1:40' } },
            { title: 'Monotony', src: '/audio/Monotony.mp3', preview: { start: '2:00', end: '3:00' } },
            { title: 'Heartbreak', src: '/audio/Heartbreak.mp3', preview: { start: '0:45', end: '1:55' } },
            { title: 'Fear', src: '/audio/Fear.mp3', preview: { start: '2:50', end: '3:50' } },
            { title: 'Intrigue', src: '/audio/Intrigue.mp3', preview: { start: '2:20', end: '4:50' } }
        ]
    },
    {
        slug: 'piano-and-orchestra-2',
        title: 'Piano and Orchestra 2',
        tracks: [
            { title: 'Sausalito', src: '/audio/Sausalito.mp3', preview: { start: '1:20', end: '2:20' } },
            { title: 'Lovers by the Sea', src: '/audio/LoversByTheSea.mp3', preview: { start: '1:50', end: '2:50' } }
        ]
    }
];

// Portfolio tile: square disc cover and title, opening the EP's listening page.
function renderEpTile(ep) {
    const tile = document.createElement('a');
    tile.className = 'ep-tile';
    tile.href = `/ep/${ep.slug}`;
    tile.innerHTML = `
        <div class="ep-cover"><div class="ep-disc"></div></div>
        <h4 class="ep-tile-title">${ep.title}</h4>
    `;
    return tile;
}

const PREVIEW_FADE_IN = 0.3;
const PREVIEW_FADE_OUT = 2;

function toSeconds(time) {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
}

// The preview currently playing, if any. It ends when it reaches its end
// (completed) or when the listener stops it or starts something else.
let activePreview = null;

function stopPreview(completed) {
    if (!activePreview) {
        return;
    }
    const preview = activePreview;
    activePreview = null;
    clearInterval(preview.timer);
    preview.audio.volume = 1;
    preview.row.classList.remove('is-previewing');
    preview.row.style.removeProperty('--progress');
    preview.onFinish(completed);
}

// Plays [start, end] of a track with a short fade-in and a fade-out into the end,
// exposing progress through the row's --progress (0..1).
// Volume is read-only on iOS, so there the preview simply stops at its end.
function playPreview(row, audio, track, onFinish) {
    stopPreview(false);
    const start = toSeconds(track.preview.start);
    const end = toSeconds(track.preview.end);
    const preview = { row, audio, onFinish, ownSeek: true, timer: null };
    activePreview = preview;

    row.classList.add('is-previewing');
    audio.volume = 0;
    audio.currentTime = start;
    audio.play().catch(() => stopPreview(false));

    preview.timer = setInterval(() => {
        const time = audio.currentTime;
        if (time >= end || audio.ended) {
            stopPreview(true);
            audio.pause();
            return;
        }
        audio.volume = Math.max(0, Math.min(1, (time - start) / PREVIEW_FADE_IN, (end - time) / PREVIEW_FADE_OUT));
        row.style.setProperty('--progress', Math.max(0, (time - start) / (end - start)));
    }, 50);
}

// Listening page card: title, Preview / Full version toggle, all-previews reel
// and numbered tracklist. Preview mode (the default) plays each track's preview
// from its button; full mode shows the full-length players.
function renderEp(ep) {
    const card = document.createElement('article');
    card.className = 'ep-card mode-preview';

    const tracks = ep.tracks.map((track, index) => `
        <li class="ep-track">
            <span class="ep-track-number">${index + 1}</span>
            <span class="ep-track-title">${track.title}</span>
            <button type="button" class="ep-preview">
                <span class="ep-preview-play">&#9654; ${track.preview.start}&ndash;${track.preview.end}</span>
                <span class="ep-preview-stop">&#9632; Stop</span>
            </button>
            <audio controls preload="metadata">
                <source src="${track.src}" type="audio/mpeg">
            </audio>
        </li>
    `).join('');

    card.innerHTML = `
        <header class="ep-header">
            <h3 class="ep-title">${ep.title}</h3>
            <div class="ep-controls">
                <div class="ep-mode" role="group" aria-label="Listening mode">
                    <button type="button" data-mode="preview" aria-pressed="true">Preview</button>
                    <button type="button" data-mode="full" aria-pressed="false">Full version</button>
                </div>
                <button type="button" class="ep-reel">&#9654; Play all previews</button>
            </div>
        </header>
        <ol class="ep-tracks">${tracks}</ol>
    `;

    const rows = [...card.querySelectorAll('.ep-track')];
    const audios = rows.map(row => row.querySelector('audio'));

    function stopAll() {
        stopPreview(false);
        audios.forEach(audio => audio.pause());
    }

    audios.forEach(audio => {
        // One track at a time.
        audio.addEventListener('play', () => {
            audios.filter(other => other !== audio).forEach(other => other.pause());
        });
        // Pausing or scrubbing hands control back to the listener. A preview
        // running to the end of its track also pauses: that one completed.
        audio.addEventListener('pause', () => {
            if (activePreview && activePreview.audio === audio) {
                stopPreview(audio.ended);
            }
        });
        audio.addEventListener('seeking', () => {
            if (activePreview && activePreview.audio === audio && !activePreview.ownSeek) {
                stopPreview(false);
            }
        });
        audio.addEventListener('seeked', () => {
            if (activePreview && activePreview.audio === audio) {
                activePreview.ownSeek = false;
            }
        });
    });

    rows.forEach((row, index) => {
        row.querySelector('.ep-preview').addEventListener('click', () => {
            if (row.classList.contains('is-previewing')) {
                stopAll();
                return;
            }
            playPreview(row, audios[index], ep.tracks[index], () => {});
        });
    });

    const modeButtons = [...card.querySelectorAll('.ep-mode button')];
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            stopAll();
            card.classList.toggle('mode-preview', button.dataset.mode === 'preview');
            card.classList.toggle('mode-full', button.dataset.mode === 'full');
            modeButtons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
        });
    });

    const reelButton = card.querySelector('.ep-reel');
    let reelPlaying = false;

    function setReel(playing) {
        reelPlaying = playing;
        reelButton.innerHTML = playing ? '&#9632; Stop previews' : '&#9654; Play all previews';
    }

    function playReelFrom(index) {
        if (index >= rows.length) {
            setReel(false);
            return;
        }
        playPreview(rows[index], audios[index], ep.tracks[index], completed => {
            if (completed && reelPlaying) {
                playReelFrom(index + 1);
            } else {
                setReel(false);
            }
        });
    }

    reelButton.addEventListener('click', () => {
        if (reelPlaying) {
            stopAll();
            return;
        }
        setReel(true);
        playReelFrom(0);
    });

    return card;
}
