// Supabase client — carregado após config.js
let dbClient;
function initSupabase() {
  if (typeof SUPABASE_URL === 'undefined' || SUPABASE_URL.includes('SEU-PROJETO')) {
    console.warn('Configure SUPABASE_URL e SUPABASE_ANON_KEY em js/config.js');
    return false;
  }
  dbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return true;
}

// Toast
function toast(msg, type = 'ok', duration = 3000) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = 'show' + (type === 'error' ? ' error' : '');
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.className = ''; }, duration);
}

// Formata moeda
function fmtMoeda(v) {
  if (!v && v !== 0) return '—';
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Formata data legível
function fmtData(s) {
  if (!s) return '—';
  const d = new Date(s);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function fmtDataHora(s) {
  if (!s) return '—';
  const d = new Date(s);
  return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Valida CPF (dígitos verificadores)
function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let r = (soma * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  if (r !== parseInt(cpf[9])) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  r = (soma * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  return r === parseInt(cpf[10]);
}

// Máscara CPF
function mascaraCPF(v) {
  return v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

// Máscara telefone
function mascaraTelefone(v) {
  v = v.replace(/\D/g, '').slice(0, 11);
  if (v.length <= 10) return v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  return v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
}

// Máscara CEP
function mascaraCEP(v) {
  return v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
}

// Busca CEP via ViaCEP
async function buscarCEP(cep, callback) {
  cep = cep.replace(/\D/g, '');
  if (cep.length !== 8) return;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();
    if (data.erro) { toast('CEP não encontrado.', 'error'); return; }
    callback(data);
  } catch {
    toast('Erro ao buscar CEP.', 'error');
  }
}

// Nav link ativo
function setNavAtivo() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    a.classList.toggle('active', href === path);
  });
}

// Marca link ativo ao carregar
document.addEventListener('DOMContentLoaded', setNavAtivo);
