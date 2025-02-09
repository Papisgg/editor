import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { usePreview } from 'react-dnd-preview';
import { useEditor } from './EditorContext';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ElementContainer = styled.div`
  position: absolute;
  left: ${(props) => props.$x}px;
  top: ${(props) => props.$y}px;
  /* Уберите transform и transition */
  margin: 0;
  padding: 0;
  z-index: ${(props) => (props.$isDragging ? 1000 : 1)};
`;
const ResizeHandle = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  background: #1976d2;
  bottom: -6px;
  right: -6px;
  cursor: nwse-resize;
  border-radius: 2px;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity 0.2s;
`;

// Кастомный превью для перетаскивания
export const CustomDragPreview = () => {
  const { display, item, style } = usePreview();
  if (!display) return null;
  return (
    <div
      style={{
        ...style,
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 1000,
        opacity: 0.8,
      }}
    >
      {renderElement(item.type, item.props)}
    </div>
  );
};

const Element = React.memo(({ id, type, props, position }) => {
  const {
    state: { selectedElementId },
    actions: { selectElement, moveElement },
  } = useEditor();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'existing-element',
    item: { id, type, props, position },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    previewOptions: {
      captureDraggingState: false, // Отключаем встроенный превью
    },
  }));

  const [, drop] = useDrop({
    accept: 'existing-element',
    hover: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset || item.id === id) return;
      moveElement(item.id, { x: offset.x, y: offset.y });
    },
  });

  const handleSelect = (e) => {
    e.stopPropagation();
    selectElement(id);
  };

  return (
    <ElementContainer
      ref={(node) => drag(drop(node))}
      $isSelected={selectedElementId === id}
      $x={position.x}
      $y={position.y}
      $background={type === 'image' ? 'transparent' : 'white'}
      $isDragging={isDragging}
      onClick={handleSelect}
    >
      {renderElement(type, props)}
      <ResizeHandle
        $visible={selectedElementId === id}
        onMouseDown={(e) => e.stopPropagation()}
      />
    </ElementContainer>
  );
});

Element.displayName = 'Element';

Element.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'button', 'image']).isRequired,
  props: PropTypes.object.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
};

const renderElement = (type, props) => {
  switch (type) {
    case 'text':
      return (
        <div style={{ fontSize: props.fontSize, color: props.color }}>
          {props.content}
        </div>
      );
    case 'button':
      return (
        <button
          style={{
            backgroundColor: props.bgColor,
            color: props.color,
            width: props.width,
          }}
        >
          {props.label}
        </button>
      );
    case 'image':
      return (
        <img src={props.src} alt="Element" style={{ width: props.width }} />
      );
    default:
      return null;
  }
};

export { Element };
