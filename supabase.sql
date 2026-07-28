-- ============================================================
-- Goldfeder Cardiologia Veterinária — Schema completo
-- Execute no SQL Editor do Supabase
-- ============================================================

-- 1. Tutores (proprietários)
CREATE TABLE IF NOT EXISTS tutores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cpf TEXT,
  telefone TEXT,
  email TEXT,
  cep TEXT,
  logradouro TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Pacientes (pets)
CREATE TABLE IF NOT EXISTS pacientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  especie TEXT DEFAULT 'Cachorro',
  raca TEXT,
  sexo TEXT,
  castrado BOOLEAN DEFAULT FALSE,
  data_nascimento DATE,
  peso NUMERIC(5,2),
  cor TEXT,
  tutor_id UUID REFERENCES tutores(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'óbito')),
  observacoes TEXT,
  foto_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Atendimentos (consultas, exames, retornos)
CREATE TABLE IF NOT EXISTS atendimentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID REFERENCES pacientes(id) ON DELETE SET NULL,
  tutor_id UUID REFERENCES tutores(id) ON DELETE SET NULL,
  tipo TEXT DEFAULT 'consulta',
  data_atendimento TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'agendado' CHECK (status IN ('agendado', 'realizado', 'cancelado')),
  valor NUMERIC(10,2),
  forma_pagamento TEXT,
  queixa_principal TEXT,
  diagnostico TEXT,
  prescricao TEXT,
  retorno_em DATE,
  nf_emitida BOOLEAN DEFAULT FALSE,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Procedimentos (cirurgias e intervenções)
CREATE TABLE IF NOT EXISTS procedimentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID REFERENCES pacientes(id) ON DELETE SET NULL,
  tutor_id UUID REFERENCES tutores(id) ON DELETE SET NULL,
  tipo TEXT,
  data_procedimento TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'agendado' CHECK (status IN ('agendado', 'realizado', 'cancelado')),
  valor NUMERIC(10,2),
  forma_pagamento TEXT,
  anestesia TEXT,
  duracao_min INTEGER,
  intercorrencias TEXT,
  nf_emitida BOOLEAN DEFAULT FALSE,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Eventos (log imutável)
CREATE TABLE IF NOT EXISTS eventos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL,
  entidade TEXT,
  entidade_id UUID,
  dados JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_pacientes_tutor ON pacientes(tutor_id);
CREATE INDEX IF NOT EXISTS idx_pacientes_status ON pacientes(status);
CREATE INDEX IF NOT EXISTS idx_atendimentos_paciente ON atendimentos(paciente_id);
CREATE INDEX IF NOT EXISTS idx_atendimentos_data ON atendimentos(data_atendimento);
CREATE INDEX IF NOT EXISTS idx_atendimentos_status ON atendimentos(status);
CREATE INDEX IF NOT EXISTS idx_procedimentos_paciente ON procedimentos(paciente_id);
CREATE INDEX IF NOT EXISTS idx_procedimentos_data ON procedimentos(data_procedimento);
CREATE INDEX IF NOT EXISTS idx_procedimentos_status ON procedimentos(status);
CREATE INDEX IF NOT EXISTS idx_eventos_entidade ON eventos(entidade, entidade_id);

-- Migração: adicionar nf_emitida se as tabelas já existirem
ALTER TABLE atendimentos ADD COLUMN IF NOT EXISTS nf_emitida BOOLEAN DEFAULT FALSE;
ALTER TABLE procedimentos ADD COLUMN IF NOT EXISTS nf_emitida BOOLEAN DEFAULT FALSE;

-- RLS
ALTER TABLE tutores ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE atendimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "acesso_publico" ON tutores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acesso_publico" ON pacientes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acesso_publico" ON atendimentos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acesso_publico" ON procedimentos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acesso_publico" ON eventos FOR ALL USING (true) WITH CHECK (true);
