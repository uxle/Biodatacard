// Colors configured for the card theme
const themes = [
    {n:'Royal Purple', b1:'#1a0b2e', b2:'#341255', bdr:'#d4af37', txt:'#c5a059', lt:'#f3e5ab'},
    {n:'Deep Maroon', b1:'#2a0a0a', b2:'#4a0e0e', bdr:'#d4af37', txt:'#c5a059', lt:'#f3e5ab'},
    {n:'Midnight Blue', b1:'#0a1128', b2:'#1c2b5a', bdr:'#a5b4fc', txt:'#c7d2fe', lt:'#e0e7ff'},
    {n:'Emerald', b1:'#061a12', b2:'#0f3d2b', bdr:'#34d399', txt:'#6ee7b7', lt:'#d1fae5'},
    {n:'Black Gold', b1:'#0f0f0f', b2:'#1f1f1f', bdr:'#d4af37', txt:'#c5a059', lt:'#f3e5ab'},
];

// Updated Hindi Default Data
const defaults = {
    meta: { accent: 0 }, // Index of theme
    data: { 
        name:'शिवानी कुमारी', 
        dob:'2005-08-02', 
        tob:'06:30', 
        pob:'अलीगढ़',
        height:'5 फुट 5 इंच', 
        complexion:'साफ (Fair)', 
        rashi:'मकर', 
        manglik:'नहीं',
        religion:'हिन्दू', 
        caste:'जाटव', 
        education:'इंटरमीडिएट',
        father:'ज्ञान सिंह', 
        fatherOcc:'किसान', 
        mother:'गुड्डी देवी', 
        motherOcc:'गृहिणी',
        brothers:'1', 
        sisters:'3 विवाहित, 1 अविवाहित',
        contact:'9876543210', 
        address:'खैरा बुजुर्ग, रणजीत गढ़ी, खैर, अलीगढ़'
    }
};

let state;
const get = id => document.getElementById(id);

function init() {
    try {
        const saved = localStorage.getItem('royalBioStateHindi');
        state = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(defaults));
    } catch(e) { state = JSON.parse(JSON.stringify(defaults)); }

    // Render Palette
    const pCont = get('palette-popover');
    pCont.innerHTML = themes.map((t, i) => `
        <div class="swatch" style="background:${t.b2}" title="${t.n}" onclick="setTheme(${i})"></div>
    `).join('');

    // Restore inputs
    document.querySelectorAll('[data-bind]').forEach(el => {
        const key = el.dataset.bind;
        if(state.data[key]) el.value = state.data[key];
    });

    setTheme(state.meta.accent);
    updatePreview();
    handleResize();
    setupEvents();
}

function setupEvents() {
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('button') || e.target.closest('.swatch');
        if (!e.target.closest('.palette-popover') && !e.target.closest('[data-action="toggle-palette"]')) {
            get('palette-popover').classList.remove('open');
        }
        if (!btn) return;
        
        const action = btn.dataset.action;
        if (action === 'toggle-palette') get('palette-popover').classList.toggle('open');
        if (action === 'mode') {
            document.body.className = `mode-${btn.dataset.value}`;
            document.querySelectorAll('.v-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        }
        if (action === 'print') window.print();
    });

    // Handle inputs and selects
    document.body.addEventListener('input', (e) => {
        if (e.target.dataset.bind) {
            state.data[e.target.dataset.bind] = e.target.value;
            updatePreview();
            save();
        }
    });

    window.addEventListener('resize', handleResize);
}

function updatePreview() {
    Object.keys(state.data).forEach(k => {
        const el = get(`out-${k}`);
        if (el) {
            let val = state.data[k];
            // Format Date (Display as DD-MM-YYYY)
            if(k === 'dob' && val) {
                const d = new Date(val);
                if(!isNaN(d)) {
                    const day = String(d.getDate()).padStart(2, '0');
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const year = d.getFullYear();
                    val = `${day}-${month}-${year}`;
                }
            }
            // Format Time (12 Hour format logic if needed, or kept as is)
            if(k === 'tob' && val && val.includes(':') && val.length <= 5) {
                const [h,m] = val.split(':');
                const d = new Date(); d.setHours(h); d.setMinutes(m);
                val = d.toLocaleTimeString('en-US', {hour:'numeric', minute:'2-digit', hour12:true});
            }
            el.innerText = val || '';
        }
    });
}

function setTheme(idx) {
    state.meta.accent = idx;
    const t = themes[idx];
    document.documentElement.style.setProperty('--card-bg-1', t.b1);
    document.documentElement.style.setProperty('--card-bg-2', t.b2);
    document.documentElement.style.setProperty('--card-border', t.bdr);
    document.documentElement.style.setProperty('--card-gold', t.txt);
    document.documentElement.style.setProperty('--card-gold-light', t.lt);
    document.documentElement.style.setProperty('--primary', t.b2);
    save();
}

function handleResize() {
    if(window.innerWidth <= 1024) return;
    const p = get('paper');
    const previewWidth = document.querySelector('.preview').clientWidth;
    // 700px is the card fixed width + 80px padding buffer
    const scale = Math.min(1, (previewWidth - 80) / 700); 
    p.style.transform = `scale(${scale})`;
}

function save() { localStorage.setItem('royalBioStateHindi', JSON.stringify(state)); }

init();

