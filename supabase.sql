-- Execute no SQL Editor do Supabase (https://app.supabase.com → SQL Editor)

CREATE TABLE cirurgias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Pet
  nome_pet TEXT NOT NULL,
  especie TEXT DEFAULT 'Cachorro',
  raca TEXT,

  -- Cirurgia
  tipo_cirurgia TEXT,
  data_cirurgia TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'agendada' CHECK (status IN ('agendada', 'realizada', 'cancelada')),
  observacoes TEXT,

  -- Financeiro
  valor NUMERIC(10,2),
  forma_pagamento TEXT,

  -- Proprietário
  nome_proprietario TEXT NOT NULL,
  cpf TEXT,
  contato TEXT,

  -- Endereço
  cep TEXT,
  logradouro TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,

  -- Meta
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices úteis para buscas
CREATE INDEX idx_cirurgias_status ON cirurgias(status);
CREATE INDEX idx_cirurgias_data ON cirurgias(data_cirurgia);
CREATE INDEX idx_cirurgias_proprietario ON cirurgias(nome_proprietario);

-- Row Level Security (RLS) — habilite e crie política se quiser restringir acesso
-- ALTER TABLE cirurgias ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "acesso_livre" ON cirurgias FOR ALL USING (true);
