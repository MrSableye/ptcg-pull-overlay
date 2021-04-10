import { Card } from '../../card-cache';

const CardComponent = ({
  card,
  onClick,
  onRightClick,
}: {
  card: Card,
  onClick?: () => void,
  onRightClick?: () => void,
}) => {
  return <img
    key={card.id}
    onClick={() => (onClick || (() => {}))()}
    onContextMenu={() => (onRightClick || (() => {}))()}
    src={card.images.small}
    alt={card.name}
  />;
};

export default CardComponent;
