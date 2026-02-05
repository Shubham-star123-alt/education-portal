(function () {
  // -----------------------
  // UI: nav only (login/signup removed)
  // -----------------------
  const navToggle = document.getElementById('navToggle');
  const primaryMenu = document.getElementById('primaryMenu');
  const submenuToggles = document.querySelectorAll('.submenu-toggle');
  const contrastToggle = document.getElementById('contrastToggle');

  // Mobile nav toggle
  if (navToggle && primaryMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = primaryMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Submenu toggles
  submenuToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const parent = e.currentTarget.closest('.has-submenu');
      const submenu = parent.querySelector('.submenu');
      const expanded = e.currentTarget.getAttribute('aria-expanded') === 'true';
      e.currentTarget.setAttribute('aria-expanded', String(!expanded));
      submenu.style.display = expanded ? 'none' : 'block';
    });
  });

  // High contrast toggle
  if (contrastToggle) {
    contrastToggle.addEventListener('click', (e)=>{
      e.preventDefault();
      const on = document.documentElement.classList.toggle('hc');
      contrastToggle.setAttribute('aria-pressed', String(on));
    });
  }

  // ======================
  // MAP FUNCTIONALITY
  // ======================
  document.addEventListener('DOMContentLoaded', function () {

    const defaultCenter = [19.0760, 72.8777];
    const map = L.map('schoolMap').setView(defaultCenter, 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const schools = [

      // Mumbai
      { name:"BMC Primary School Worli", city:"Mumbai", coords:[19.0025,72.8158], type:"primary"},
      { name:"BMC Primary School Dadar", city:"Mumbai", coords:[19.0176,72.8424], type:"primary"},
      { name:"BMC High School Lower Parel", city:"Mumbai", coords:[19.0030,72.8308], type:"secondary"},
      { name:"Municipal High School Byculla", city:"Mumbai", coords:[18.9782,72.8332], type:"secondary"},
      { name:"Municipal School Dharavi", city:"Mumbai", coords:[19.0390,72.8560], type:"primary"},
      { name:"Municipal School Matunga", city:"Mumbai", coords:[19.0281,72.8553], type:"primary"},
      { name:"Municipal School Ghatkopar", city:"Mumbai", coords:[19.0855,72.9080], type:"primary"},
      { name:"Municipal High School Chembur", city:"Mumbai", coords:[19.0623,72.9015], type:"secondary"},
      { name:"Municipal School Kurla", city:"Mumbai", coords:[19.0728,72.8790], type:"primary"},
      { name:"Municipal School Andheri West", city:"Mumbai", coords:[19.1300,72.8336], type:"primary"},
      { name:"Municipal School Malad", city:"Mumbai", coords:[19.1860,72.8422], type:"primary"},
      { name:"Municipal High School Kandivali", city:"Mumbai", coords:[19.2056,72.8425], type:"secondary"},

      // Badlapur
      { name:"Zilla Parishad School Badlapur East", city:"Badlapur", coords:[19.1555,73.2367], type:"primary"},
      { name:"Zilla Parishad School Badlapur West", city:"Badlapur", coords:[19.1582,73.2310], type:"primary"},
      { name:"Zilla Parishad School Katrap", city:"Badlapur", coords:[19.1685,73.2380], type:"primary"},
      { name:"Government School Shirgaon", city:"Badlapur", coords:[19.1490,73.2550], type:"primary"},
      { name:"Municipal School Kulgaon", city:"Badlapur", coords:[19.1610,73.2305], type:"secondary"},
      { name:"Government Ashram School Badlapur", city:"Badlapur", coords:[19.1540,73.2450], type:"secondary"},
      { name:"Zilla Parishad School Sonivali", city:"Badlapur", coords:[19.1425,73.2500], type:"primary"},

      // Ambernath
      { name:"Zilla Parishad School Ambernath", city:"Ambernath", coords:[19.1900,73.2000], type:"primary"},
      { name:"Government School Ambernath East", city:"Ambernath", coords:[19.2090,73.1900], type:"secondary"},
      { name:"Zilla Parishad School Ambernath West", city:"Ambernath", coords:[19.1985,73.1860], type:"primary"},
      { name:"Municipal Marathi School Ambernath", city:"Ambernath", coords:[19.2015,73.1875], type:"primary"},
      { name:"Government High School Ambernath", city:"Ambernath", coords:[19.2040,73.1850], type:"secondary"},

      // Ulhasnagar
      { name:"Government School Ulhasnagar", city:"Ulhasnagar", coords:[19.2202,73.1641], type:"secondary"},
      { name:"Municipal Primary School Camp 1", city:"Ulhasnagar", coords:[19.2170,73.1600], type:"primary"},
      { name:"Municipal School Camp 2", city:"Ulhasnagar", coords:[19.2215,73.1635], type:"primary"},
      { name:"Government High School Camp 3", city:"Ulhasnagar", coords:[19.2240,73.1650], type:"secondary"},
      { name:"Municipal Secondary School", city:"Ulhasnagar", coords:[19.2220,73.1675], type:"secondary"}
    ];

    const icons = {
      primary: L.icon({iconUrl:'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png', iconSize:[25,41]}),
      secondary: L.icon({iconUrl:'https://maps.gstatic.com/mapfiles/ms2/micons/orange-dot.png', iconSize:[25,41]}),
      'higher-secondary': L.icon({iconUrl:'https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png', iconSize:[25,41]})
    };

    const bounds = [];

    schools.forEach(school=>{
      L.marker(school.coords,{icon:icons[school.type]})
        .addTo(map)
        .bindPopup(`<strong>${school.name}</strong><br>${school.city}`);
      bounds.push(school.coords);
    });

    // IMPORTANT: auto show all schools
    if(bounds.length){
      map.fitBounds(bounds,{padding:[40,40]});
    }

  });
})();
// ===============================
// SITE CONTENT SEARCH & HIGHLIGHT
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("siteSearch");
  const searchForm = document.querySelector(".search-form");

  if (!searchInput || !searchForm) {
    console.warn("Search elements not found");
    return;
  }

  function clearHighlights() {
    document.querySelectorAll(".search-highlight")
      .forEach(el => el.classList.remove("search-highlight"));
  }

  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    clearHighlights();

    // Only search meaningful content areas
    const searchable = document.querySelectorAll(
      "section, article, .service-card, .program-card"
    );

    for (const el of searchable) {
      if (el.innerText.toLowerCase().includes(query)) {
        el.classList.add("search-highlight");

        el.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        return;
      }
    }

    alert("No matching content found on this page.");
  }

  // Form submit (button click or Enter)
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    performSearch();
  });

});
