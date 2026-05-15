// components/CartaUno.tsx - INTERATIVA
import type { Carta } from '../types/gametypes';

type CartaUnoProps = {
  carta: Carta;
  onClick?: () => void;
  selecionada?: boolean;
  jogavel?: boolean;
  virada?: boolean;
}

export function CartaUno({ carta, onClick, selecionada = false, jogavel = true, virada = false }: CartaUnoProps) {
  if (virada) {
    return (
      <div className="carta carta-virada">
        <div className="carta-verso">
          <div className="logo-uno">UNO</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`carta carta-${carta.cor} ${selecionada ? 'carta-selecionada' : ''} ${!jogavel ? 'carta-inativa' : ''}`}
      onClick={jogavel ? onClick : undefined}
    >
      <div className="carta-topo">
        <span className="carta-valor-pequeno">{carta.valor}</span>
      </div>
      
      <div className="carta-centro">
        <span className="carta-valor-grande">{carta.valor}</span>
      </div>
      
      <div className="carta-base">
        <span className="carta-valor-pequeno">{carta.valor}</span>
      </div>
    </div>
  );
}