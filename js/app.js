// Supabase client
let dbClient;
function initSupabase() {
  if (typeof SUPABASE_URL === 'undefined' || SUPABASE_URL.includes('SEU-PROJETO')) {
    console.warn('Configure SUPABASE_URL e SUPABASE_ANON_KEY em js/config.js');
    return false;
  }
  dbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return true;
}

// ── Raças em cascata ──────────────────────────────────────
const RACAS = {
  'Cachorro': [
    'Akita','Australian Shepherd','Basenji','Basset Hound','Beagle','Bichon Frisé',
    'Border Collie','Boxer','Borzói','Bulldog Francês','Bulldog Inglês','Bull Terrier',
    'Cavalier King Charles Spaniel','Chihuahua','Chow-Chow','Cocker Spaniel Americano',
    'Cocker Spaniel Inglês','Dachshund','Dálmata','Dobermann','Fila Brasileiro',
    'Golden Retriever','Great Dane','Husky Siberiano','Jack Russell Terrier',
    'Labrador Retriever','Lhasa Apso','Maltês','Pastor Alemão','Pastor Belga Malinois',
    'Pinscher Miniatura','Pit Bull Terrier','Poodle','Pug','Rottweiler','Schnauzer',
    'Shar-Pei','Shiba Inu','Shih Tzu','São Bernardo','Vizsla','Weimaraner',
    'West Highland White Terrier','Yorkshire Terrier','Sem Raça Definida (SRD)'
  ],
  'Gato': [
    'Abissínio','Angorá Turco','Bengal','Birmanês','British Shorthair','Burmês',
    'Cornish Rex','Devon Rex','Himalaio','Maine Coon','Norueguês da Floresta',
    'Oriental','Persa','Ragdoll','Russian Blue','Sagrado da Birmânia','Scottish Fold',
    'Siamês','Somali','Sphynx','Sem Raça Definida (SRD)'
  ],
  'Ave': ['Calopsita','Periquito','Papagaio','Arara','Canário','Outro'],
  'Coelho': ['Holland Lop','Mini Rex','Angorá','Lionhead','Nova Zelândia','Outro'],
  'Réptil': ['Iguana','Gecko','Tartaruga','Jabuti','Outro'],
  'Outro': ['Outro'],
};

function popularRacas(selectEspecie, selectRaca, valorAtual = '') {
  const especie = selectEspecie.value;
  const racas = RACAS[especie] || [];
  selectRaca.innerHTML = '<option value="">Selecione a raça...</option>';
  racas.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r;
    opt.textContent = r;
    if (r === valorAtual) opt.selected = true;
    selectRaca.appendChild(opt);
  });
  if (!racas.length) {
    const opt = document.createElement('option');
    opt.value = 'Outro';
    opt.textContent = 'Outro';
    selectRaca.appendChild(opt);
  }
}

// ── Toast ─────────────────────────────────────────────────
function toast(msg, type = 'ok', duration = 3200) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = 'show' + (type === 'error' ? ' error' : '');
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.className = ''; }, duration);
}

// ── Formatação ────────────────────────────────────────────
function fmtMoeda(v) {
  if (v === null || v === undefined || v === '') return '—';
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function fmtData(s) {
  if (!s) return '—';
  return new Date(s).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function fmtDataHora(s) {
  if (!s) return '—';
  return new Date(s).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function fmtIdade(dataNasc) {
  if (!dataNasc) return '—';
  const d = new Date(dataNasc);
  const hoje = new Date();
  let anos = hoje.getFullYear() - d.getFullYear();
  let meses = hoje.getMonth() - d.getMonth();
  if (meses < 0) { anos--; meses += 12; }
  if (anos === 0) return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
  if (meses === 0) return `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
  return `${anos}a ${meses}m`;
}

// ── Validações e Máscaras ─────────────────────────────────
function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let s = 0;
  for (let i = 0; i < 9; i++) s += parseInt(cpf[i]) * (10 - i);
  let r = (s * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  if (r !== parseInt(cpf[9])) return false;
  s = 0;
  for (let i = 0; i < 10; i++) s += parseInt(cpf[i]) * (11 - i);
  r = (s * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  return r === parseInt(cpf[10]);
}

function mascaraCPF(v) {
  return v.replace(/\D/g,'').slice(0,11)
    .replace(/(\d{3})(\d)/,'$1.$2')
    .replace(/(\d{3})(\d)/,'$1.$2')
    .replace(/(\d{3})(\d{1,2})$/,'$1-$2');
}

function mascaraTelefone(v) {
  v = v.replace(/\D/g,'').slice(0,11);
  if (v.length <= 10) return v.replace(/(\d{2})(\d{4})(\d{0,4})/,'($1) $2-$3');
  return v.replace(/(\d{2})(\d{5})(\d{0,4})/,'($1) $2-$3');
}

function mascaraCEP(v) {
  return v.replace(/\D/g,'').slice(0,8).replace(/(\d{5})(\d)/,'$1-$2');
}

function fmtTelefone(c) {
  if (!c) return '—';
  c = String(c).replace(/\D/g,'');
  if (c.length === 11) return `(${c.slice(0,2)}) ${c.slice(2,7)}-${c.slice(7)}`;
  if (c.length === 10) return `(${c.slice(0,2)}) ${c.slice(2,6)}-${c.slice(6)}`;
  return c;
}

// ── CEP ───────────────────────────────────────────────────
async function buscarCEP(cep, cb) {
  cep = cep.replace(/\D/g,'');
  if (cep.length !== 8) return;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const d = await res.json();
    if (d.erro) { toast('CEP não encontrado.', 'error'); return; }
    cb(d);
  } catch { toast('Erro ao buscar CEP.', 'error'); }
}

// ── Busca de paciente com autocomplete ───────────────────
async function buscarPacientes(termo) {
  if (!dbClient || termo.length < 2) return [];
  const { data } = await dbClient.from('pacientes')
    .select('id, nome, especie, raca, tutor_id, tutores(nome)')
    .ilike('nome', `%${termo}%`)
    .eq('status', 'ativo')
    .limit(8);
  return data || [];
}

// ── Busca de tutor com autocomplete ──────────────────────
async function buscarTutores(termo) {
  if (!dbClient || termo.length < 2) return [];
  const { data } = await dbClient.from('tutores')
    .select('id, nome, telefone')
    .ilike('nome', `%${termo}%`)
    .eq('ativo', true)
    .limit(8);
  return data || [];
}

// ── Nav ativo ────────────────────────────────────────────
function setNavAtivo() {
  const path = location.pathname.split('/').pop() || 'home.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    a.classList.toggle('active', href === path);
  });
}

// ── Escape HTML ──────────────────────────────────────────
function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Badge status ─────────────────────────────────────────
function badgeStatus(s) {
  const map = {
    agendado: 'badge-agendada', realizado: 'badge-realizada', cancelado: 'badge-cancelada',
    ativo: 'badge-realizada', inativo: 'badge-cancelada', 'óbito': 'badge-cancelada',
  };
  return `<span class="badge ${map[s]||'badge-agendada'}">${s}</span>`;
}

document.addEventListener('DOMContentLoaded', () => {
  setNavAtivo();
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.textContent = '☰';
    }));
  }
});
