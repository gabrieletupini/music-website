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

function epUrl(ep) {
    return `${window.location.origin}/ep/${ep.slug}`;
}

// Builds an EP card: title, numbered tracklist with players and, when
// shareable, a button copying the EP's listening-page link.
function renderEp(ep, { shareable }) {
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
            ${shareable ? '<button type="button" class="ep-share"><i class="fas fa-link"></i> <span>Copy link</span></button>' : ''}
        </header>
        <ol class="ep-tracks">${tracks}</ol>
    `;

    if (shareable) {
        const button = card.querySelector('.ep-share');
        const label = button.querySelector('span');
        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(epUrl(ep));
                label.textContent = 'Link copied';
            } catch (error) {
                window.location.href = epUrl(ep);
            }
            setTimeout(() => { label.textContent = 'Copy link'; }, 2000);
        });
    }

    return card;
}
