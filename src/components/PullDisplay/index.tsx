import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  Popover,
  Select,
  Typography,
} from 'antd';
import {
  ExportOutlined,
  ImportOutlined,
  TwitterOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import cardCache, { Card } from '../../card-cache';
import CardComponent from '../Card';
import CardCollection from '../CardCollection';
import './index.css';

const toId = (text: string) => ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');

const searchCache = (setIds: string[], query: string) => {
  return setIds.reduce((accumulatedCards, setId) => {
    const setCards = Object.values(cardCache.cards[setId] || {});

    return [...accumulatedCards, ...setCards.filter((card) => {
      return toId(card.name).includes(toId(query));
    })];
  }, [] as Card[]);
};

const PullDisplay = () => {
  const [query, setQuery] = useState('');
  const [setIds, setSetIds] = useState([]);
  const [collection, setCollection] = useState<Card[]>([]);
  const [specialCollection, setSpecialCollection] = useState<Card[]>([]);
  const [columnSize, setColumnSize] = useState(5);
  const [useTransparentBackground, setUseTransparentBackground] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [cardOffset, setCardOffset] = useState(100);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importInput, setImportInput] = useState('');
  const cards = query.length > 0 ? searchCache(setIds, query) : [];

  const cardState = JSON.stringify({
    collection: collection.map((card) => ({ id: card.id, setId: card.set.id })),
    specialCollection: specialCollection.map((card) => ({ id: card.id, setId: card.set.id })),
  });

  const adjustedBackgroundColor = useTransparentBackground ? undefined : backgroundColor;

  const addCard = (isSpecial: boolean = false) => (card: Card) => {
    (isSpecial ? setSpecialCollection : setCollection)(
      (currentCollection) => [...currentCollection, card],
    );
  };

  const removeCard = (isSpecial: boolean = false) => (index: number) => {
    (isSpecial ? setSpecialCollection : setCollection)(
      (currentCollection) => {
        const collectionCopy = [...currentCollection];
        collectionCopy.splice(index, 1);
        return collectionCopy;
      },
    );
  };

  const importCards = () => {
    const parsedImport = JSON.parse(importInput);

    const collection = (parsedImport.collection || []).map((card: any) => cardCache.cards[card.setId][card.id]);
    const specialCollection = (parsedImport.specialCollection || []).map((card: any) => cardCache.cards[card.setId][card.id]);
  
    setCollection(collection);
    setSpecialCollection(specialCollection);

    setImportModalVisible(false);
  };

  return (
    <div className='pull-display-container' style={{ backgroundColor: adjustedBackgroundColor }}>
      <div className='settings-pane'>
        <Form layout='vertical' size='small'>
          <Form.Item label='Author'>
            <Typography.Link href='https://twitter.com/MisterSableye'>
              <TwitterOutlined /> MisterSableye
            </Typography.Link>
          </Form.Item>
          <Form.Item label='Import/Export'>
            <CopyToClipboard text={cardState}>
              <Popover trigger='click' content='Cards copied to clipboard'>
                <Button icon={<ExportOutlined />}>
                  Export Cards
                </Button>
              </Popover>
            </CopyToClipboard>
            <Button icon={<ImportOutlined />} onClick={() => setImportModalVisible(true)}>
              Import Cards
            </Button>
            <Modal
              visible={importModalVisible}
              title='Import Cards'
              okText='Import'
              onOk={importCards}
              onCancel={() => setImportModalVisible(false)}
            >
              <Input.TextArea
                value={importInput}
                onChange={(event) => setImportInput(event.target.value)}
              />
            </Modal>
          </Form.Item>
          <Form.Item label='Background Color'>
            <Checkbox
              value={useTransparentBackground}
              defaultChecked
              onChange={(event) => setUseTransparentBackground(event.target.checked)}
            >
              Use transparent background?
            </Checkbox>
            <input
              type='color'
              value={backgroundColor}
              disabled={useTransparentBackground}
              onChange={(event) => setBackgroundColor(event.target.value)}
            />
            <Input
              value={backgroundColor}
              disabled={useTransparentBackground}
              onChange={(event) => setBackgroundColor(event.target.value)}
              placeholder='Color'
            />
          </Form.Item>
          <Form.Item label='Card Offset'>
            <InputNumber min={0} value={cardOffset} onChange={setCardOffset} />
          </Form.Item>
          <Form.Item label='Cards per Column'>
            <InputNumber min={1} value={columnSize} onChange={setColumnSize} />
          </Form.Item>
          <Form.Item label='Available Sets'>
            <Select
              mode='multiple'
              allowClear
              defaultValue={[]}
              onChange={setSetIds}
              placeholder='Sets to search in'
              style={{ width: '100%' }}
            >
              {[cardCache.sets.map((set) => (
                <Select.Option
                  key={set.id}
                  value={set.id}
                >
                  {`${set.name}${set.ptcgoCode ? ` (${set.ptcgoCode})` : ''}`}
                </Select.Option>
              ))]}
            </Select>
          </Form.Item>
          <Form.Item label='Search query'>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder='Card search query'
            />
          </Form.Item>
        </Form>
        <div>
          {cards.map((card) => <div>
            <CardComponent
              card={card}
              onClick={() => addCard()(card)}
              onRightClick={() => addCard(true)(card)}
            />
          </div>)}
        </div>
      </div>
      <div className='collection-pane'>
        <CardCollection
          cardOffset={cardOffset}
          columnSize={columnSize}
          cards={collection}
          remove={removeCard()}
        />
        <CardCollection
          cardOffset={cardOffset}
          columnSize={columnSize}
          reverseColumns
          cards={specialCollection}
          remove={removeCard(true)}
        />
      </div>
    </div>
  );
};

export default PullDisplay;
