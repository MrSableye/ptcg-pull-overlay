import { chunk } from 'lodash';
import CardComponent from '../Card';
import { Card } from '../../card-cache';

const CardCollectionComponent = ({
  cardOffset,
  columnSize,
  reverseColumns,
  cards,
  remove,
}: {
  cardOffset: number,
  columnSize: number,
  reverseColumns?: boolean,
  cards: Card[],
  remove: (index: number) => void,
}) => {
  const cardComponents = cards.map((card, cardIndex) => <CardComponent
    card={card}
    onClick={() => remove(cardIndex)}
  />);

  const cardColumns = chunk(cardComponents, columnSize);

  if (reverseColumns) {
    cardColumns.reverse();
  }

  return <div style={{ display: 'flex' }}>
    {cardColumns.map((cardColumn) => {
      return <div style={{ position: 'relative' }}>
        {cardColumn.map((card, cardIndex) => <div style={{ position: cardIndex === 0 ? 'static' : 'absolute', top: cardIndex * cardOffset }}>
          {card}
        </div>)}
      </div>;
    })}
  </div>;
};

export default CardCollectionComponent;
