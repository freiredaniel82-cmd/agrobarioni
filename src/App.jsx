import { useState, useRef } from "react";
import * as XLSX from "xlsx";

const categorias = [
  { nome: "Herbicida", descricao: "Controle de plantas daninhas", icon: "🌿", cor: "#C8A84B", bg: "rgba(200,168,75,0.15)" },
  { nome: "Fungicida", descricao: "Controle de fungos e doenças", icon: "🍄", cor: "#4BAE72", bg: "rgba(75,174,114,0.15)" },
  { nome: "Inseticida", descricao: "Controle de insetos-praga", icon: "🐛", cor: "#E05C5C", bg: "rgba(224,92,92,0.15)" },
  { nome: "Inseticida / Acaricida", descricao: "Controle de insetos e ácaros", icon: "🕷️", cor: "#C0392B", bg: "rgba(192,57,43,0.15)" },
  { nome: "Foliar / Fertilizante", descricao: "Nutrição foliar das plantas", icon: "🌱", cor: "#3498DB", bg: "rgba(52,152,219,0.15)" },
  { nome: "Adjuvante / Óleo Mineral", descricao: "Auxiliar de pulverização", icon: "💧", cor: "#9B59B6", bg: "rgba(155,89,182,0.15)" },
];

const classificacaoMap = {
  "ACQUAMAX POWER": "Foliar / Fertilizante",
  "ACT OIL": "Adjuvante / Óleo Mineral",
  "ADVER": "Inseticida / Acaricida",
  "ARRAY CX": "Fungicida",
  "ASSARIS": "Inseticida",
  "ATRAZINA": "Herbicida",
  "AZIMUT": "Fungicida",
  "AZOS": "Inseticida",
  "BELT": "Inseticida",
  "BLAVIT": "Fungicida",
  "CHEVAL": "Inseticida",
  "CLINCHER": "Herbicida",
  "CLORPIRI": "Inseticida / Acaricida",
  "COMBOIA": "Fungicida",
  "DIFO 250 EC": "Fungicida",
  "DIQUAT": "Herbicida",
  "ENGEO PLENO": "Inseticida",
  "EVO MANZIC": "Fungicida",
  "EXION POTENCER ULTRA": "Foliar / Fertilizante",
  "FESAME": "Fungicida",
  "FOX SUPRA": "Fungicida",
  "FOX XPRO": "Fungicida",
  "HERFAST": "Herbicida",
  "LACTOFEN 240 EC": "Herbicida",
  "LARMAX F5": "Inseticida",
  "MANZIC": "Fungicida",
  "MESOTRIONA": "Herbicida",
  "METOMY": "Inseticida",
  "N H I": "Inseticida",
  "PLANADOR": "Adjuvante / Óleo Mineral",
  "POQUER": "Inseticida",
  "PREMIO STAR": "Inseticida",
  "PRIORI EXTRA 800": "Fungicida",
  "REGENTE 800 CX": "Inseticida",
  "SALLVARE": "Fungicida",
  "SHYPER 250": "Fungicida",
  "STANDARK TOP": "Fungicida",
  "SULFATO DE ZINCO": "Foliar / Fertilizante",
  "TAURA": "Fungicida",
  "TEBUCONAZOL 430 SC": "Fungicida",
  "TERRAD OR 339SC": "Fungicida",
  "THOPHANATE": "Fungicida",
  "TROPPOIL": "Adjuvante / Óleo Mineral",
  "VIOVAN": "Inseticida",
  "WONDER": "Fungicida",
  "ZAPP": "Herbicida",
  "ZEUS": "Fungicida",
};

const produtosIniciais = [
  { nome: "ACQUAMAX POWER", categoria: "Foliar / Fertilizante", unidade: "litros", saldo: 30 },
  { nome: "ACT OIL", categoria: "Adjuvante / Óleo Mineral", unidade: "litros", saldo: 175 },
  { nome: "ADVER", categoria: "Inseticida / Acaricida", unidade: "litros", saldo: 700 },
  { nome: "ARRAY CX", categoria: "Fungicida", unidade: "litros", saldo: 20 },
  { nome: "ASSARIS", categoria: "Inseticida", unidade: "litros", saldo: 40 },
  { nome: "ATRAZINA", categoria: "Herbicida", unidade: "litros", saldo: 80 },
  { nome: "AZIMUT", categoria: "Fungicida", unidade: "litros", saldo: 20 },
  { nome: "AZOS", categoria: "Inseticida", unidade: "litros", saldo: 54 },
  { nome: "BELT", categoria: "Inseticida", unidade: "litros", saldo: 100 },
  { nome: "BLAVIT", categoria: "Fungicida", unidade: "litros", saldo: 60 },
  { nome: "CHEVAL", categoria: "Inseticida", unidade: "litros", saldo: 2680 },
  { nome: "CLINCHER", categoria: "Herbicida", unidade: "litros", saldo: 440 },
  { nome: "CLORPIRI", categoria: "Inseticida / Acaricida", unidade: "litros", saldo: 2520 },
  { nome: "COMBOIA", categoria: "Fungicida", unidade: "litros", saldo: 5 },
  { nome: "DIFO 250 EC", categoria: "Fungicida", unidade: "litros", saldo: 40 },
  { nome: "DIQUAT", categoria: "Herbicida", unidade: "litros", saldo: 660 },
  { nome: "ENGEO PLENO", categoria: "Inseticida", unidade: "litros", saldo: 10 },
  { nome: "EVO MANZIC", categoria: "Fungicida", unidade: "litros", saldo: 60 },
  { nome: "EXION POTENCER ULTRA", categoria: "Foliar / Fertilizante", unidade: "litros", saldo: 1000 },
  { nome: "FESAME", categoria: "Fungicida", unidade: "litros", saldo: 1100 },
  { nome: "FOX SUPRA", categoria: "Fungicida", unidade: "litros", saldo: 600 },
  { nome: "FOX XPRO", categoria: "Fungicida", unidade: "litros", saldo: 300 },
  { nome: "HERFAST", categoria: "Herbicida", unidade: "litros", saldo: 100 },
  { nome: "LACTOFEN 240 EC", categoria: "Herbicida", unidade: "litros", saldo: 600 },
  { nome: "LARMAX F5", categoria: "Inseticida", unidade: "litros", saldo: 10 },
  { nome: "MANZIC", categoria: "Fungicida", unidade: "litros", saldo: 60 },
  { nome: "MESOTRIONA", categoria: "Herbicida", unidade: "litros", saldo: 5 },
  { nome: "METOMY", categoria: "Inseticida", unidade: "kg", saldo: 480 },
  { nome: "N H I", categoria: "Inseticida", unidade: "litros", saldo: 10 },
  { nome: "PLANADOR", categoria: "Adjuvante / Óleo Mineral", unidade: "litros", saldo: 20 },
  { nome: "POQUER", categoria: "Inseticida", unidade: "litros", saldo: 60 },
  { nome: "PREMIO STAR", categoria: "Inseticida", unidade: "litros", saldo: 85 },
  { nome: "PRIORI EXTRA 800", categoria: "Fungicida", unidade: "litros", saldo: 800 },
  { nome: "REGENTE 800 CX", categoria: "Inseticida", unidade: "kg", saldo: 119 },
  { nome: "SALLVARE", categoria: "Fungicida", unidade: "litros", saldo: 70 },
  { nome: "SHYPER 250", categoria: "Fungicida", unidade: "litros", saldo: 4320 },
  { nome: "STANDARK TOP", categoria: "Fungicida", unidade: "litros", saldo: 20 },
  { nome: "SULFATO DE ZINCO", categoria: "Foliar / Fertilizante", unidade: "kg", saldo: 100 },
  { nome: "TAURA", categoria: "Fungicida", unidade: "litros", saldo: 20 },
  { nome: "TEBUCONAZOL 430 SC", categoria: "Fungicida", unidade: "litros", saldo: 1920 },
  { nome: "TERRAD OR 339SC", categoria: "Fungicida", unidade: "litros", saldo: 40 },
  { nome: "THOPHANATE", categoria: "Fungicida", unidade: "litros", saldo: 600 },
  { nome: "TROPPOIL", categoria: "Adjuvante / Óleo Mineral", unidade: "litros", saldo: 550 },
  { nome: "VIOVAN", categoria: "Inseticida", unidade: "litros", saldo: 40 },
  { nome: "WONDER", categoria: "Fungicida", unidade: "litros", saldo: 140 },
  { nome: "ZAPP", categoria: "Herbicida", unidade: "litros", saldo: 20 },
  { nome: "ZEUS", categoria: "Fungicida", unidade: "litros", saldo: 2000 },
];

function classificar(nome) {
  const n = nome.trim().toUpperCase();
  if (classificacaoMap[n]) return classificacaoMap[n];
  for (const [k, v] of Object.entries(classificacaoMap)) {
    if (n.includes(k) || k.includes(n)) return v;
  }
  return "Outros";
}

export default function AgroBarioni() {
  const [tela, setTela] = useState("home");
  const [buscaGeral, setBuscaGeral] = useState("");
  const [produtos, setProdutos] = useState(produtosIniciais);
  const [categoriaSel, setCategoriaSel] = useState(null);
  const [busca, setBusca] = useState("");
  const [dataAt, setDataAt] = useState("10/04/2026");
  const [toast, setToast] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const fileRef = useRef();

  function showToast(msg, tipo = "ok") {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3500);
  }

  function handleArquivo(e) {
    const file = e.target.files[0];
    if (!file) return;
    setCarregando(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const wb = XLSX.read(ev.target.result, { type: "array" });
        const sheetName = wb.SheetNames.includes("Consumo por Produto")
          ? "Consumo por Produto" : wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

        let headerIdx = -1;
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].some(c => String(c).toLowerCase().includes("produto"))) {
            headerIdx = i; break;
          }
        }
        if (headerIdx === -1) throw new Error("Coluna 'Produto' não encontrada");

        const headers = rows[headerIdx].map(h => String(h).toLowerCase().trim());
        const cP = headers.findIndex(h => h.includes("produto"));
        const cU = headers.findIndex(h => h.includes("unidade"));
        const cS = headers.findIndex(h => h.includes("saldo"));
        if (cP === -1 || cS === -1) throw new Error("Colunas não encontradas");

        const novos = [];
        for (let i = headerIdx + 1; i < rows.length; i++) {
          const row = rows[i];
          const nome = String(row[cP] || "").trim();
          if (!nome) continue;
          const saldo = parseFloat(String(row[cS]).replace(",", ".")) || 0;
          const unidade = cU >= 0 ? String(row[cU] || "litros").trim() : "litros";
          const cat = classificar(nome);
          novos.push({ nome: nome.toUpperCase(), categoria: cat, unidade, saldo });
        }
        if (novos.length === 0) throw new Error("Nenhum produto encontrado");

        setProdutos(novos);
        const hoje = new Date();
        setDataAt(`${String(hoje.getDate()).padStart(2,"0")}/${String(hoje.getMonth()+1).padStart(2,"0")}/${hoje.getFullYear()}`);
        showToast(`✅ ${novos.length} produtos atualizados!`, "ok");
      } catch (err) {
        showToast(`❌ Erro: ${err.message}`, "erro");
      } finally {
        setCarregando(false);
        e.target.value = "";
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function getInfoCat(nome) {
    const ps = produtos.filter(p => p.categoria === nome);
    return { qtd: ps.length, total: ps.reduce((a, b) => a + b.saldo, 0), lista: ps };
  }

  function abrirCat(cat) {
    setCategoriaSel(cat);
    setBusca("");
    setTela("categoria");
  }

  const prodsFiltrados = categoriaSel
    ? produtos.filter(p => p.categoria === categoriaSel.nome && p.nome.toLowerCase().includes(busca.toLowerCase()))
    : [];

  const maxSaldo = prodsFiltrados.length > 0 ? Math.max(...prodsFiltrados.map(x => x.saldo)) : 1;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A1A10",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      color: "#E8EDE9",
      maxWidth: 480,
      margin: "0 auto",
    }}>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
          background: toast.tipo === "ok" ? "#132B1A" : "#2B1313",
          border: `1px solid ${toast.tipo === "ok" ? "#4BAE72" : "#E05C5C"}`,
          color: toast.tipo === "ok" ? "#7FD99A" : "#F1948A",
          padding: "12px 22px", borderRadius: 14, fontSize: 13, fontWeight: 600,
          zIndex: 999, textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          whiteSpace: "nowrap",
        }}>{toast.msg}</div>
      )}

      {/* HEADER */}
      <div style={{
        background: "linear-gradient(180deg, #071410 0%, #0A1A10 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 18px",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", height: 72,
        }}>
          {/* Botão voltar ou espaço */}
          {tela === "categoria" ? (
            <button onClick={() => setTela("home")} style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, color: "#888", padding: "7px 13px",
              cursor: "pointer", fontSize: 13, fontWeight: 600,
            }}>← Voltar</button>
          ) : <div style={{ width: 72 }} />}

          {/* LOGO CENTRAL */}
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, justifyContent: "center" }}>
              {/* Ícone folha SVG */}
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <circle cx="15" cy="15" r="15" fill="#112A1A"/>
                <path d="M15 6C15 6 8 11 8 17C8 20.3 11 23 15 23C19 23 22 20.3 22 17C22 11 15 6 15 6Z" fill="#4BAE72"/>
                <path d="M15 23V14" stroke="#071410" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M15 18C15 18 11.5 16 9.5 14" stroke="#071410" strokeWidth="1.4" strokeLinecap="round"/>
                <path d="M15 16C15 16 17.5 14.5 19 13" stroke="#071410" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <div style={{ lineHeight: 1 }}>
                <span style={{ fontSize: 27, fontWeight: 900, color: "#5FCA84", letterSpacing: 0.5, textShadow: "0 0 20px rgba(95,202,132,0.45)" }}>Agro</span>
                <span style={{ fontSize: 27, fontWeight: 900, color: "#E0BE5A", letterSpacing: 0.5, textShadow: "0 0 20px rgba(224,190,90,0.45)" }}>Barioni</span>
              </div>
            </div>
            <div style={{ fontSize: 9.5, color: "#3A5040", letterSpacing: 2, textTransform: "uppercase", marginTop: 3 }}>
              Grupo Barioni · Fazenda Estiva
            </div>
          </div>

          {/* Botão importar */}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={carregando}
            title="Importar planilha"
            style={{
              background: "rgba(75,174,114,0.12)",
              border: "1px solid rgba(75,174,114,0.35)",
              borderRadius: 10, color: "#4BAE72",
              width: 44, height: 36,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 19, flexShrink: 0,
            }}>
            {carregando ? "⏳" : "📂"}
          </button>
          <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{ display: "none" }} onChange={handleArquivo} />
        </div>
      </div>

      <div style={{ padding: "0 16px 60px" }}>

        {/* ══════════ TELA HOME ══════════ */}
        {tela === "home" && (
          <>
            {/* Título */}
            <div style={{ padding: "22px 0 16px" }}>
              <div style={{ fontSize: 23, fontWeight: 800 }}>Estoque de Produtos</div>
              <div style={{ fontSize: 12, color: "#3A5040", marginTop: 4 }}>
                Atualizado em {dataAt} · {produtos.length} produtos
              </div>
            </div>

            {/* Resumo rápido */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
              {[
                { label: "Produtos", valor: produtos.length, icon: "📦" },
                { label: "Categorias", valor: categorias.filter(c => getInfoCat(c.nome).qtd > 0).length, icon: "🗂️" },
                { label: "Fazenda", valor: "Estiva", icon: "🌾" },
              ].map(item => (
                <div key={item.label} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 14, padding: "12px 8px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: "#4BAE72" }}>{item.valor}</div>
                  <div style={{ fontSize: 9.5, color: "#3A5040", textTransform: "uppercase", letterSpacing: 1, marginTop: 2 }}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* Botão de atualizar estoque */}
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                width: "100%",
                background: "rgba(75,174,114,0.07)",
                border: "1.5px dashed rgba(75,174,114,0.4)",
                borderRadius: 14, padding: "13px 16px",
                display: "flex", alignItems: "center", gap: 12,
                cursor: "pointer", marginBottom: 22, color: "#4BAE72",
                textAlign: "left",
              }}>
              <div style={{ fontSize: 26 }}>📤</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Atualizar Estoque</div>
                <div style={{ fontSize: 11, color: "#3A5040", marginTop: 2 }}>
                  Importe a planilha Excel enviada pelo pessoal
                </div>
              </div>
              <div style={{ marginLeft: "auto", color: "#3A5040", fontSize: 20 }}>›</div>
            </button>

            {/* Label */}
            <div style={{
              fontSize: 10.5, fontWeight: 700, letterSpacing: 2.5,
              color: "#3A5040", textTransform: "uppercase", marginBottom: 10,
            }}>Categorias</div>

            {/* Cards de categoria */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {categorias.map(cat => {
                const info = getInfoCat(cat.nome);
                if (info.qtd === 0) return null;
                return (
                  <button key={cat.nome} onClick={() => abrirCat(cat)} style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderLeft: `4px solid ${cat.cor}`,
                    borderRadius: 14, padding: "14px 14px",
                    display: "flex", alignItems: "center", gap: 13,
                    cursor: "pointer", textAlign: "left", width: "100%",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                  >
                    <div style={{
                      width: 54, height: 54, borderRadius: 12,
                      background: cat.bg, border: `1.5px solid ${cat.cor}50`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 26, flexShrink: 0,
                    }}>{cat.icon}</div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", marginBottom: 3 }}>
                        {cat.nome}
                      </div>
                      <div style={{ fontSize: 12, color: "#6B8F74" }}>{cat.descricao}</div>
                    </div>

                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 26, fontWeight: 800, color: cat.cor, lineHeight: 1 }}>
                        {info.qtd}
                      </div>
                      <div style={{ fontSize: 11, color: "#6B8F74" }}>produtos</div>
                    </div>
                    <div style={{ color: "#6B8F74", fontSize: 20, marginLeft: 4 }}>›</div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ══════════ TELA CATEGORIA ══════════ */}
        {tela === "categoria" && categoriaSel && (
          <>
            {/* Cabeçalho */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 0 16px" }}>
              <div style={{
                width: 60, height: 60, borderRadius: 14,
                background: categoriaSel.bg,
                border: `2px solid ${categoriaSel.cor}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30,
              }}>{categoriaSel.icon}</div>
              <div>
                <div style={{ fontSize: 19, fontWeight: 800 }}>{categoriaSel.nome}</div>
                <div style={{ fontSize: 12, color: "#3A5040" }}>
                  {getInfoCat(categoriaSel.nome).qtd} produtos ·{" "}
                  {getInfoCat(categoriaSel.nome).total.toLocaleString("pt-BR")} un. em estoque
                </div>
              </div>
            </div>

            {/* Busca */}
            <input
              type="text"
              placeholder="🔍  Buscar produto..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              style={{
                width: "100%", padding: "11px 15px", borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.09)",
                background: "rgba(255,255,255,0.04)",
                color: "#E8EDE9", fontSize: 14, outline: "none",
                boxSizing: "border-box", marginBottom: 14,
              }}
            />

            {/* Lista */}
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {prodsFiltrados.length === 0 ? (
                <div style={{ textAlign: "center", color: "#3A5040", padding: "40px 0", fontSize: 14 }}>
                  Nenhum produto encontrado
                </div>
              ) : prodsFiltrados
                .slice()
                .sort((a, b) => b.saldo - a.saldo)
                .map(p => {
                  const pct = Math.max(4, (p.saldo / maxSaldo) * 100);
                  return (
                    <div key={p.nome} style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderLeft: `4px solid ${categoriaSel.cor}`,
                      borderRadius: 14, padding: "16px 16px",
                    }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#FFFFFF", marginBottom: 10, lineHeight: 1.3 }}>
                        {p.nome}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ height: 7, background: "rgba(255,255,255,0.1)", borderRadius: 4 }}>
                            <div style={{
                              height: "100%", width: `${pct}%`,
                              background: `linear-gradient(90deg, ${categoriaSel.cor}88, ${categoriaSel.cor})`,
                              borderRadius: 4,
                            }} />
                          </div>
                        </div>
                        <div style={{ flexShrink: 0, textAlign: "right" }}>
                          <span style={{ fontSize: 20, fontWeight: 900, color: categoriaSel.cor }}>
                            {p.saldo.toLocaleString("pt-BR")}
                          </span>
                          <span style={{ fontSize: 13, color: "#9AABA0", marginLeft: 5, fontWeight: 600 }}>{p.unidade}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>

      {/* ══════════ TELA BUSCA GERAL ══════════ */}
      {tela === "busca" && (
        <div style={{ padding: "0 16px 80px" }}>
          <div style={{ padding: "22px 0 16px" }}>
            <div style={{ fontSize: 23, fontWeight: 800 }}>Busca Geral</div>
            <div style={{ fontSize: 12, color: "#3A5040", marginTop: 4 }}>
              Pesquise qualquer produto do estoque
            </div>
          </div>

          <input
            type="text"
            placeholder="🔍  Digite o nome do produto..."
            value={buscaGeral}
            onChange={e => setBuscaGeral(e.target.value)}
            autoFocus
            style={{
              width: "100%", padding: "14px 16px", borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.07)",
              color: "#FFFFFF", fontSize: 16, outline: "none",
              boxSizing: "border-box", marginBottom: 18,
            }}
          />

          {buscaGeral.trim() === "" ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#3A5040" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Digite para pesquisar</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>{produtos.length} produtos disponíveis</div>
            </div>
          ) : (() => {
            const resultados = produtos.filter(p =>
              p.nome.toLowerCase().includes(buscaGeral.toLowerCase())
            );
            if (resultados.length === 0) return (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#3A5040" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>😕</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Nenhum produto encontrado</div>
                <div style={{ fontSize: 13, marginTop: 6 }}>Tente outro nome</div>
              </div>
            );
            return (
              <div>
                <div style={{ fontSize: 12, color: "#3A5040", marginBottom: 12 }}>
                  {resultados.length} produto{resultados.length > 1 ? "s" : ""} encontrado{resultados.length > 1 ? "s" : ""}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {resultados.map(p => {
                    const cat = categorias.find(c => c.nome === p.categoria) || { cor: "#888", icon: "📦" };
                    return (
                      <div key={p.nome} style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.13)",
                        borderLeft: `4px solid ${cat.cor}`,
                        borderRadius: 14, padding: "14px 16px",
                      }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: "#FFFFFF", marginBottom: 6 }}>
                          {p.nome}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{
                            display: "flex", alignItems: "center", gap: 6,
                            background: `${cat.cor}20`, border: `1px solid ${cat.cor}40`,
                            borderRadius: 8, padding: "3px 10px",
                          }}>
                            <span style={{ fontSize: 13 }}>{cat.icon}</span>
                            <span style={{ fontSize: 12, color: cat.cor, fontWeight: 600 }}>{p.categoria}</span>
                          </div>
                          <div>
                            <span style={{ fontSize: 20, fontWeight: 900, color: cat.cor }}>
                              {p.saldo.toLocaleString("pt-BR")}
                            </span>
                            <span style={{ fontSize: 13, color: "#9AABA0", marginLeft: 5, fontWeight: 600 }}>{p.unidade}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ══════════ BARRA DE NAVEGAÇÃO INFERIOR ══════════ */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480,
        background: "rgba(7,20,16,0.97)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        backdropFilter: "blur(12px)",
        zIndex: 200,
      }}>
        {[
          { id: "home", icon: "🏠", label: "Início" },
          { id: "busca", icon: "🔍", label: "Buscar" },
        ].map(tab => (
          <button key={tab.id} onClick={() => {
            setTela(tab.id);
            setBuscaGeral("");
          }} style={{
            flex: 1, padding: "12px 0 10px",
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          }}>
            <div style={{ fontSize: 22 }}>{tab.icon}</div>
            <div style={{
              fontSize: 11, fontWeight: 700,
              color: tela === tab.id ? "#4BAE72" : "#3A5040",
              letterSpacing: 0.5,
            }}>{tab.label}</div>
            {tela === tab.id && (
              <div style={{ width: 20, height: 3, background: "#4BAE72", borderRadius: 2 }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
