// App.tsx - COMPLETO
import { useReducer } from 'react';
import { unoReducer } from './context/unoReducer';
import { CartaUno } from './components/CartaUno';
import { MesaUno } from './components/MesaUno';
import './App.css';

function App() {
  const [state, dispatch] = useReducer(unoReducer, {
    jogadores: [],
    monteCompra: [],
    monteDescarte: [],
    vez: 0,
    corAtual: 'vermelho',
    vencedor: null,
    estado: 'preparacao'
  });

  // Iniciar jogo automaticamente
  if (state.estado === 'preparacao') {
    dispatch({ type: 'INICIAR_JOGO' });
  }

  const jogadorAtual = state.jogadores[state.vez];
  const cartaTopo = state.monteDescarte[0];

  const handleJogarCarta = (carta: any, jogadorIndex: number) => {
    if (jogadorIndex === state.vez) {
      dispatch({ type: 'JOGAR_CARTA', carta, jogadorIndex });
    }
  };

  const handleComprarCarta = (jogadorIndex: number) => {
    if (jogadorIndex === state.vez) {
      dispatch({ type: 'COMPRAR_CARTA', jogadorIndex });
    }
  };

  const podeJogarCarta = (carta: any) => {
    return carta.cor === state.corAtual || carta.valor === cartaTopo.valor;
  };

  if (state.vencedor) {
    return (
      <div className="tela-vitoria">
        <div className="vitoria-container">
          <h1>{state.vencedor.nome} Venceu!</h1>
          <p>Parabéns!</p>
          <button 
            onClick={() => dispatch({ type: 'INICIAR_JOGO' })}
            className="btn-principal"
          >
            Jogar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-uno">
      <header className="header-uno">
        <h1>UNO Simplificado</h1>
        <div className="info-jogo">
          <span>Vez: <strong>{jogadorAtual?.nome}</strong></span>
          <span>Cor atual: <span className={`cor-${state.corAtual}`}>{state.corAtual}</span></span>
        </div>
      </header>

      <div className="area-jogo">
        {/* Jogador 2 */}
        <div className={`jogador-area ${state.vez === 1 ? 'jogador-ativo' : ''}`}>
          <h2>{state.jogadores[1]?.nome}</h2>
          <div className="mao-jogador">
            {state.jogadores[1]?.mao.map((carta) => (
              <CartaUno
                key={carta.id}
                carta={carta}
                onClick={() => handleJogarCarta(carta, 1)}
                jogavel={podeJogarCarta(carta) && state.vez === 1}
              />
            ))}
          </div>
          <div className="contador-cartas">
            {state.jogadores[1]?.mao.length} cartas
          </div>
          {state.vez === 1 && (
            <button onClick={() => handleComprarCarta(1)} className="btn-comprar">
              Comprar Carta
            </button>
          )}
        </div>

        {/* Mesa Central */}
        <div className="mesa-central">
          <MesaUno
            cartaTopo={cartaTopo}
            corAtual={state.corAtual}
            monteCompra={state.monteCompra}
            onComprarCarta={() => handleComprarCarta(state.vez)}
          />
        </div>

        {/* Jogador 1 */}
        <div className={`jogador-area ${state.vez === 0 ? 'jogador-ativo' : ''}`}>
          <h2>{state.jogadores[0]?.nome}</h2>
          <div className="mao-jogador">
            {state.jogadores[0]?.mao.map((carta) => (
              <CartaUno
                key={carta.id}
                carta={carta}
                onClick={() => handleJogarCarta(carta, 0)}
                jogavel={podeJogarCarta(carta) && state.vez === 0}
              />
            ))}
          </div>
          <div className="contador-cartas">
            {state.jogadores[0]?.mao.length} cartas
          </div>
          {state.vez === 0 && (
            <button onClick={() => handleComprarCarta(0)} className="btn-comprar">
              Comprar Carta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;