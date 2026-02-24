const campusData = [
    {
        room: "A101",
        faculty: "Dr. Rajesh Sharma",
        block: "A Block",
        floor: "Ground Floor",
        description: "Computer Science Lab - Equipped with 40 workstations and latest software"
    },
    {
        room: "B205",
        faculty: "Dr. Priya Patel",
        block: "B Block",
        floor: "Second Floor",
        description: "Mathematics Department Office - Faculty consultation and course coordination"
    },
    {
        room: "C301",
        faculty: "Dr. Amit Kumar",
        block: "C Block",
        floor: "Third Floor",
        description: "Physics Laboratory - Advanced experimental equipment for undergraduate research"
    },
    {
        room: "A202",
        faculty: "Dr. Sneha Reddy",
        block: "A Block",
        floor: "Second Floor",
        description: "English Literature Classroom - Seminar room with audio-visual facilities"
    },
    {
        room: "D104",
        faculty: "Dr. Vikram Singh",
        block: "D Block",
        floor: "First Floor",
        description: "Chemistry Lab - Fume hoods and safety equipment for practical sessions"
    },
    {
        room: "B310",
        faculty: "Dr. Meera Iyer",
        block: "B Block",
        floor: "Third Floor",
        description: "Economics Department - Faculty offices and student consultation area"
    },
    {
        room: "C105",
        faculty: "Dr. Arjun Nair",
        block: "C Block",
        floor: "First Floor",
        description: "Mechanical Engineering Workshop - CNC machines and fabrication tools"
    },
    {
        room: "A305",
        faculty: "Dr. Kavita Desai",
        block: "A Block",
        floor: "Third Floor",
        description: "Psychology Counseling Center - Private consultation rooms available"
    },
    {
        room: "D201",
        faculty: "Dr. Ravi Gupta",
        block: "D Block",
        floor: "Second Floor",
        description: "Electronics Lab - Microprocessor kits and circuit design workstations"
    },
    {
        room: "B108",
        faculty: "Dr. Anita Joshi",
        block: "B Block",
        floor: "First Floor",
        description: "Library Reference Section - Research materials and digital resources"
    },
    {
        room: "C204",
        faculty: "Dr. Suresh Rao",
        block: "C Block",
        floor: "Second Floor",
        description: "Civil Engineering Drawing Hall - Large format plotters and CAD software"
    },
    {
        room: "A403",
        faculty: "Dr. Pooja Mehta",
        block: "A Block",
        floor: "Fourth Floor",
        description: "Biotechnology Research Lab - Sterile workspace and incubation facilities"
    }
];

const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close-btn');
const recentSearchesDiv = document.getElementById('recentSearches');
const clearBtn = document.getElementById('clearBtn');

function getRecentSearches() {
    const recent = localStorage.getItem('recentSearches');
    return recent ? JSON.parse(recent) : [];
}

function saveRecentSearch(query) {
    if (!query.trim()) return;

    let recent = getRecentSearches();
    recent = recent.filter(item => item.toLowerCase() !== query.toLowerCase());
    recent.unshift(query);
    recent = recent.slice(0, 3);

    localStorage.setItem('recentSearches', JSON.stringify(recent));
    displayRecentSearches();
}

function displayRecentSearches() {
    const recent = getRecentSearches();

    if (recent.length === 0) {
        recentSearchesDiv.innerHTML = '';
        return;
    }

    let html = '<h3>Recent Searches</h3>';
    recent.forEach(query => {
        html += `<span class="recent-item" data-query="${query}">${query}</span>`;
    });

    recentSearchesDiv.innerHTML = html;

    document.querySelectorAll('.recent-item').forEach(item => {
        item.addEventListener('click', function() {
            const query = this.getAttribute('data-query');
            searchInput.value = query;
            performSearch(query);
        });
    });
}

function performSearch(query) {
    if (!query.trim()) {
        resultsDiv.innerHTML = '';
        return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = campusData.filter(item =>
        item.room.toLowerCase().includes(lowerQuery) ||
        item.faculty.toLowerCase().includes(lowerQuery) ||
        item.block.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
    );

    if (filtered.length === 0) {
        resultsDiv.innerHTML = '<div class="no-results">No results found. Try searching for a room number or faculty name.</div>';
        return;
    }

    let html = '';
    filtered.forEach(item => {
        html += `
            <div class="result-item" data-room="${item.room}">
                <h3>${item.room}</h3>
                <div class="faculty-name">${item.faculty}</div>
                <div class="location">${item.block} • ${item.floor}</div>
            </div>
        `;
    });

    resultsDiv.innerHTML = html;

    document.querySelectorAll('.result-item').forEach(item => {
        item.addEventListener('click', function() {
            const room = this.getAttribute('data-room');
            const data = campusData.find(d => d.room === room);
            showModal(data);
            saveRecentSearch(query);
        });
    });
}

function showModal(data) {
    modalBody.innerHTML = `
        <h2>${data.room}</h2>
        <div class="detail-row">
            <div class="detail-label">Faculty</div>
            <div class="detail-value faculty">${data.faculty}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Block</div>
            <div class="detail-value">${data.block}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Floor</div>
            <div class="detail-value">${data.floor}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Description</div>
            <div class="detail-value">${data.description}</div>
        </div>
    `;

    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
}

searchInput.addEventListener('input', function() {
    const query = this.value;
    performSearch(query);

    if (query.trim()) {
        clearBtn.classList.add('visible');
    } else {
        clearBtn.classList.remove('visible');
    }
});

clearBtn.addEventListener('click', function() {
    searchInput.value = '';
    resultsDiv.innerHTML = '';
    clearBtn.classList.remove('visible');
    searchInput.focus();
});

closeBtn.addEventListener('click', closeModal);

modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

displayRecentSearches();
