function $(id){ return document.getElementById(id); }

let entries = JSON.parse(localStorage.getItem('kalorienLog') || '[]');
let total   = entries.reduce((s,e)=>s+e.cal,0);
render();

function addEntry(){
  const food = $('food').value.trim();
  const cal  = parseInt($('cal').value,10);
  if(!food || isNaN(cal)){
    alert('Bitte gültigen Namen & kcal eingeben');
    return;
  }

  entries.push({food, cal});
  localStorage.setItem('kalorienLog', JSON.stringify(entries));
  total += cal;
  $('food').value=''; $('cal').value='';
  render();
}

function render(){
  $('log').innerHTML = entries.map(e =>
    `<div class="item">🍽 ${e.food} – ${e.cal} kcal</div>`
  ).join('');
  $('total').textContent = 'Gesamtkalorien: ' + total;
}

function resetAll(){
  if(!confirm('Alle Einträge löschen?')) return;
  entries=[]; total=0;
  localStorage.removeItem('kalorienLog');
  render();
}

function calcTDEE(){
  const age = parseInt($('age').value,10);
  const height = parseInt($('height').value,10);
  const weight = parseFloat($('weight').value);
  const gender = $('gender').value;
  const activity = parseFloat($('activity').value);

  if(isNaN(age)||isNaN(height)||isNaN(weight)){
    alert('Bitte Alter, Größe, Gewicht eingeben'); return;
  }

  const bmr = (gender==='male')
      ? 88.362 + 13.397*weight + 4.799*height - 5.677*age
      : 447.593 + 9.247*weight + 3.098*height - 4.330*age;

  const tdee = Math.round(bmr * activity);
  $('bmrResult').innerHTML =
      `💡 <b>BMR</b>: ${Math.round(bmr)} kcal<br>🔥 <b>TDEE</b>: ${tdee} kcal`;
}

function sendResult(){
  const email   = $('email').value.trim();
  const result  = $('bmrResult').innerHTML;

  if(!email || !result){
    alert('Bitte Email eingeben und BMR/TDEE zuerst berechnen!');
    return;
  }

  const bmr  = parseInt(result.match(/BMR<\/b>: (\d+)/)?.[1]||0,10);
  const tdee = parseInt(result.match(/TDEE<\/b>: (\d+)/)?.[1]||0,10);

  fetch('https://kalorienrechnen.onrender.com/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, bmr, tdee })
  })
  .then(r => r.json())
  .then(d => {
    alert(d.success ? '✅ Email wurde erfolgreich gesendet'
                    : '❌ Fehler beim Senden');
  })
  .catch(() => alert('❌ Verbindungsfehler'));
}
