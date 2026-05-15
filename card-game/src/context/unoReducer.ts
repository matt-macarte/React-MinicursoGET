// context/unoReducer.ts
import { BARALHO_COMPLETO } from "../types/gametypes";
import type { EstadoJogo, Carta, Jogador } from "../types/gametypes";

type AcaoUno =
  | { type: "INICIAR_JOGO" }
  | { type: "JOGAR_CARTA"; carta: Carta; jogadorIndex: number }
  | { type: 'COMPRAR_CARTA'; jogadorIndex: number };

function jogarCarta(
  state: EstadoJogo,
  carta: Carta,
  jogadorIndex: number,
): EstadoJogo {
  if (jogadorIndex !== state.vez) return state;

  const jogador = state.jogadores[jogadorIndex];

  // Verificar se a carta é jogável
  if (!podeJogarCarta(carta, state.monteDescarte[0], state.corAtual)) {
    return state;
  }

  // Remover carta da mão do jogador
  const novaMao = jogador.mao.filter((c) => c.id !== carta.id);
  const novosJogadores = [...state.jogadores];
  novosJogadores[jogadorIndex] = { ...jogador, mao: novaMao };

  // Adicionar carta ao descarte
  const novoDescarte = [carta, ...state.monteDescarte];

  // Verificar vitória
  if (novaMao.length === 0) {
    return {
      ...state,
      jogadores: novosJogadores,
      monteDescarte: novoDescarte,
      vencedor: jogador,
      estado: "finalizado",
    };
  }

  // Passar para o próximo jogador
  const proximaVez = (state.vez + 1) % state.jogadores.length;

  return {
    ...state,
    jogadores: novosJogadores,
    monteDescarte: novoDescarte,
    vez: proximaVez,
    corAtual: carta.cor,
  };
}

export function unoReducer(state: EstadoJogo, action: AcaoUno): EstadoJogo {
  switch (action.type) {
    case "INICIAR_JOGO":
      return iniciarJogo();

    case "JOGAR_CARTA":
      return jogarCarta(state, action.carta, action.jogadorIndex);
    
    case 'COMPRAR_CARTA':
      return comprarCarta(state, action.jogadorIndex);
    
    default:
      return state;
  }
}

function iniciarJogo(): EstadoJogo {
  // Embaralhar baralho
  const baralhoEmbaralhado = [...BARALHO_COMPLETO].sort(
    () => Math.random() - 0.5,
  );

  // Distribuir 7 cartas para cada jogador (2 jogadores humanos)
  const jogadores: Jogador[] = [
    {
      id: "jogador-1",
      nome: "Jogador 1",
      mao: baralhoEmbaralhado.splice(0, 7),
      isHumano: true,
    },
    {
      id: "jogador-2",
      nome: "Jogador 2",
      mao: baralhoEmbaralhado.splice(0, 7),
      isHumano: true,
    },
  ];

  // Primeira carta do descarte
  const cartaInicial = baralhoEmbaralhado.pop()!;

  return {
    jogadores,
    monteCompra: baralhoEmbaralhado,
    monteDescarte: [cartaInicial],
    vez: 0, // Jogador 1 começa
    corAtual: cartaInicial.cor,
    vencedor: null,
    estado: "jogando",
  };
}

function podeJogarCarta(
  carta: Carta,
  cartaTopo: Carta,
  corAtual: string,
): boolean {
  // Mesma cor ou mesmo valor
  return carta.cor === corAtual || carta.valor === cartaTopo.valor;
}

function comprarCarta(state: EstadoJogo, jogadorIndex: number): EstadoJogo {
  if (jogadorIndex !== state.vez) return state;
  
  const jogador = state.jogadores[jogadorIndex];
  
  // Verificar se há cartas no monte de compra
  if (state.monteCompra.length === 0) {
    // Se não há cartas, reembaralhar o descarte (exceto a carta do topo)
    const [cartaTopo, ...restoDescarte] = state.monteDescarte;
    const novoMonteCompra = [...restoDescarte].sort(() => Math.random() - 0.5);
    const novoDescarte = [cartaTopo];
    
    return {
      ...state,
      monteCompra: novoMonteCompra,
      monteDescarte: novoDescarte
    };
  }

  // Comprar uma carta
  const cartaComprada = state.monteCompra.pop()!;
  const novaMao = [...jogador.mao, cartaComprada];
  const novosJogadores = [...state.jogadores];
  novosJogadores[jogadorIndex] = { ...jogador, mao: novaMao };

  // Passar a vez automaticamente após comprar
  const proximaVez = (state.vez + 1) % state.jogadores.length;

  return {
    ...state,
    jogadores: novosJogadores,
    monteCompra: [...state.monteCompra],
    vez: proximaVez
  };
}