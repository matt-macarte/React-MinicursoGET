// components/MesaUno.tsx
import type { Carta } from '../types/gametypes';
import { CartaUno } from './CartaUno';

type MesaUnoProps = {
  cartaTopo: Carta;
  corAtual: string;
  monteCompra: Carta[];
  onComprarCarta: () => void;
}

export function MesaUno({ cartaTopo, corAtual, monteCompra, onComprarCarta }: MesaUnoProps) {
  return (
    <div className="mesa-uno">
      <div className="area-monte">
        <div className="monte-descarte">
          <CartaUno carta={cartaTopo} />
          <div className="cor-atual">
            Cor atual: <span className={`cor-${corAtual}`}>{corAtual}</span>
          </div>
        </div>
        
        <div className="monte-compra" onClick={onComprarCarta}>
          <div className="carta-virada">
            <div className="carta-verso">
              <div className="logo-uno">UNO</div>
            </div>
          </div>
          <div className="texto-comprar">Comprar ({monteCompra.length})</div>
        </div>
      </div>
    </div>
  );
}