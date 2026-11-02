// EP catalogue - shared by the portfolio (index.html) and the listening page (ep.html).
// Each EP is reachable at /ep/<slug>, the link sent to listeners and libraries.
const EPS = [
    {
        slug: 'piano-and-orchestra-1',
        title: 'Piano and Orchestra 1',
        tracks: [
            { title: 'Trees', src: '/audio/Trees.mp3' },
            { title: 'Monotony', src: '/audio/Monotony.mp3' }
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

// Listening page card: title and numbered tracklist with players.
function renderEp(ep) {
    const card = document.createElement('article');
    card.className = 'ep-card';

    const tracks = ep.tracks.map((track, index) => `
        <li class="ep-track">
            <span class="ep-track-number">${index + 1}</span>
            <span class="ep-track-title">${track.title}</span>
            <audio controls preload="metadata">
                <source src="${track.src}" type="audio/mpeg">
            </audio>
        </li>
    `).join('');

    card.innerHTML = `
        <header class="ep-header">
            <h3 class="ep-title">${ep.title}</h3>
        </header>
        <ol class="ep-tracks">${tracks}</ol>
    `;

    return card;
}
