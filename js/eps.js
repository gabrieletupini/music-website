// EP catalogue - shared by the portfolio (index.html) and the listening page (ep.html).
// Each EP is reachable at /ep/<slug>, the link sent to listeners and libraries.
// A track's preview is the section played in Preview mode.
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

const EP_ARTIST = 'Gabriele Tupini';

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
// Previous restarts the current track once it has played this long.
const RESTART_AFTER = 3;

function toSeconds(time) {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
}

function formatTime(seconds) {
    const whole = Math.max(0, Math.floor(seconds || 0));
    return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

const ICON_PATHS = {
    play: 'M8 5v14l11-7z',
    pause: 'M6 5h4v14H6zm8 0h4v14h-4z',
    previous: 'M6 6h2v12H6zm3.5 6 8.5 6V6z',
    next: 'M16 6h2v12h-2zM6 18l8.5-6L6 6z'
};

function icon(name) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICON_PATHS[name]}"/></svg>`;
}

// Listening page, laid out like a playlist: banner with the big play button,
// Preview / Full version toggle, tracklist and one player bar for the whole EP.
// Preview mode (the default) plays each track's preview with a short fade-in
// and a fade-out into its end; Full version plays whole tracks. Either way the
// EP plays through, track after track.
function renderEp(ep) {
    const page = document.createElement('div');
    page.className = 'ep-player mode-preview';

    const rows = ep.tracks.map((track, index) => `
        <li>
            <button type="button" class="ep-track">
                <span class="ep-cover ep-track-cover"><span class="ep-disc"></span></span>
                <span class="ep-track-number">${index + 1}</span>
                <span class="ep-track-title">${track.title}</span>
                <span class="ep-track-meta"></span>
            </button>
        </li>
    `).join('');

    page.innerHTML = `
        <section class="ep-hero">
            <div class="ep-hero-head">
                <button type="button" class="ep-hero-play" aria-label="Play">${icon('play')}</button>
                <div class="ep-hero-titles">
                    <h1 class="ep-hero-title"><span>${ep.title}</span></h1>
                    <p class="ep-hero-artist"><span>${EP_ARTIST}</span></p>
                </div>
            </div>
            <div class="ep-hero-badge">
                <strong>${ep.tracks.length}</strong>
                <span>${ep.tracks.length === 1 ? 'Track' : 'Tracks'}</span>
                <span class="ep-hero-total"></span>
            </div>
            <div class="ep-cover ep-hero-cover"><div class="ep-disc"></div></div>
        </section>
        <div class="ep-actions">
            <div class="ep-mode" role="group" aria-label="Listening mode">
                <button type="button" data-mode="preview" aria-pressed="true">Preview</button>
                <button type="button" data-mode="full" aria-pressed="false">Full version</button>
            </div>
        </div>
        <ol class="ep-tracks">${rows}</ol>
        <div class="ep-bar">
            <div class="ep-bar-inner">
                <button type="button" class="ep-bar-button ep-bar-previous" aria-label="Previous track">${icon('previous')}</button>
                <button type="button" class="ep-bar-button ep-bar-play" aria-label="Play">${icon('play')}</button>
                <button type="button" class="ep-bar-button ep-bar-next" aria-label="Next track">${icon('next')}</button>
                <span class="ep-bar-time ep-bar-elapsed">0:00</span>
                <input type="range" class="ep-bar-seek" min="0" max="1000" value="0" aria-label="Seek">
                <span class="ep-bar-time ep-bar-length">0:00</span>
                <div class="ep-bar-now">
                    <span class="ep-cover ep-bar-cover"><span class="ep-disc"></span></span>
                    <span class="ep-bar-text">
                        <span class="ep-bar-ep">${ep.title}</span>
                        <span class="ep-bar-track">${ep.tracks[0].title}</span>
                    </span>
                </div>
            </div>
        </div>
    `;

    const audio = new Audio();
    audio.preload = 'metadata';
    const durations = ep.tracks.map(() => null);
    let mode = 'preview';
    let current = null;
    let dragging = false;
    let timer = null;

    const trackButtons = [...page.querySelectorAll('.ep-track')];
    const playButtons = [page.querySelector('.ep-hero-play'), page.querySelector('.ep-bar-play')];
    const seek = page.querySelector('.ep-bar-seek');
    const elapsedLabel = page.querySelector('.ep-bar-elapsed');
    const lengthLabel = page.querySelector('.ep-bar-length');

    // The part of a track the current mode plays, in seconds.
    function section(index) {
        if (mode === 'preview') {
            const { start, end } = ep.tracks[index].preview;
            return { start: toSeconds(start), end: toSeconds(end) };
        }
        return { start: 0, end: durations[index] || 0 };
    }

    function playing() {
        return current !== null && !audio.paused;
    }

    function playTrack(index) {
        current = index;
        const url = new URL(ep.tracks[index].src, window.location.href).href;
        if (audio.src !== url) {
            audio.src = url;
        }
        audio.volume = mode === 'preview' ? 0 : 1;
        audio.currentTime = section(index).start;
        audio.play().catch(render);
        render();
    }

    function stop() {
        audio.pause();
        current = null;
        render();
    }

    function togglePlay() {
        if (current === null) {
            playTrack(0);
        } else if (audio.paused) {
            audio.play().catch(render);
        } else {
            audio.pause();
        }
    }

    function next() {
        if (current !== null && current + 1 < ep.tracks.length) {
            playTrack(current + 1);
        } else {
            stop();
        }
    }

    function previous() {
        if (current === null) {
            return;
        }
        const { start } = section(current);
        if (current === 0 || audio.currentTime - start > RESTART_AFTER) {
            audio.currentTime = start;
        } else {
            playTrack(current - 1);
        }
    }

    // Ends previews on time and shapes their fades.
    function tick() {
        if (current === null) {
            return;
        }
        if (mode === 'preview') {
            const { start, end } = section(current);
            const time = audio.currentTime;
            if (time >= end) {
                next();
                return;
            }
            audio.volume = Math.max(0, Math.min(1, (time - start) / PREVIEW_FADE_IN, (end - time) / PREVIEW_FADE_OUT));
        }
        renderProgress();
    }

    function renderProgress() {
        const { start, end } = section(current === null ? 0 : current);
        const length = end - start;
        const elapsed = current === null ? 0 : Math.min(Math.max(audio.currentTime - start, 0), length);
        const shown = dragging ? (seek.value / 1000) * length : elapsed;
        if (!dragging) {
            seek.value = length > 0 ? Math.round((elapsed / length) * 1000) : 0;
        }
        seek.style.setProperty('--fill', `${seek.value / 10}%`);
        elapsedLabel.textContent = formatTime(shown);
        lengthLabel.textContent = formatTime(length);
    }

    function render() {
        const isPlaying = playing();
        playButtons.forEach(button => {
            button.innerHTML = icon(isPlaying ? 'pause' : 'play');
            button.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
        });
        trackButtons.forEach((button, index) => {
            button.classList.toggle('is-current', index === current);
            button.classList.toggle('is-playing', index === current && isPlaying);
            const { start, end } = section(index);
            button.querySelector('.ep-track-meta').textContent = mode === 'preview'
                ? `${ep.tracks[index].preview.start}–${ep.tracks[index].preview.end}`
                : (end ? formatTime(end - start) : '');
        });
        page.querySelector('.ep-bar-track').textContent = ep.tracks[current === null ? 0 : current].title;

        const lengths = ep.tracks.map((track, index) => section(index).end - section(index).start);
        const complete = lengths.every(length => length > 0);
        page.querySelector('.ep-hero-total').textContent = complete
            ? formatTime(lengths.reduce((sum, length) => sum + length, 0))
            : '';
        renderProgress();
    }

    audio.addEventListener('play', () => {
        clearInterval(timer);
        timer = setInterval(tick, 50);
        render();
    });
    audio.addEventListener('pause', () => {
        clearInterval(timer);
        render();
    });
    audio.addEventListener('ended', next);
    audio.addEventListener('loadedmetadata', () => {
        if (current !== null) {
            durations[current] = audio.duration;
            render();
        }
    });

    // Full-version lengths for the tracklist and the banner total.
    ep.tracks.forEach((track, index) => {
        const probe = new Audio();
        probe.preload = 'metadata';
        probe.addEventListener('loadedmetadata', () => {
            durations[index] = probe.duration;
            render();
        }, { once: true });
        probe.src = track.src;
    });

    playButtons.forEach(button => button.addEventListener('click', togglePlay));
    page.querySelector('.ep-bar-previous').addEventListener('click', previous);
    page.querySelector('.ep-bar-next').addEventListener('click', () => {
        if (current !== null) {
            next();
        }
    });
    trackButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            if (index === current) {
                togglePlay();
            } else {
                playTrack(index);
            }
        });
    });

    // The timeline follows the drag and seeks on release, within the current section.
    seek.addEventListener('input', () => {
        dragging = true;
        renderProgress();
    });
    seek.addEventListener('change', () => {
        dragging = false;
        if (current === null) {
            renderProgress();
            return;
        }
        const { start, end } = section(current);
        audio.currentTime = start + (seek.value / 1000) * (end - start);
        renderProgress();
    });

    const modeButtons = [...page.querySelectorAll('.ep-mode button')];
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            stop();
            mode = button.dataset.mode;
            audio.volume = 1;
            page.classList.toggle('mode-preview', mode === 'preview');
            page.classList.toggle('mode-full', mode === 'full');
            modeButtons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
            render();
        });
    });

    render();
    return page;
}
