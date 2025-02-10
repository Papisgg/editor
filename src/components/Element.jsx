import React, { useCallback } from 'react';
import { useDrag } from 'react-dnd';
import { useEditor } from './EditorContext';
import styled from 'styled-components';

const ElementContainer = styled.div`
  position: absolute;
  left: ${(props) => props.$x}px;
  top: ${(props) => props.$y}px;
  cursor: move;
  opacity: ${(props) => (props.$isDragging ? 0.5 : 1)};
  transition: none;
  border: ${(props) =>
    props.$isSelected ? '2px solid #1976d2' : '1px solid transparent'};
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

const Element = ({ id, props, position }) => {
  const {
    state: { selectedElementId },
    actions: { selectElement, updateElement }, // Добавьте updateElement в деструктуризацию
  } = useEditor();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'existing-element',
    item: { id, position },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      selectElement(id);
    },
    [selectElement, id]
  );

  const handleResize = useCallback(
    (e) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = props.width || 150;

      const onMouseMove = (e) => {
        const newWidth = startWidth + (e.clientX - startX);
        updateElement(id, { width: Math.max(50, newWidth) }); // Используйте updateElement вместо actions.updateElement
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [updateElement, id, props.width]
  );

  return (
    <ElementContainer
      ref={drag}
      $x={position.x}
      $y={position.y}
      $isDragging={isDragging}
      $isSelected={selectedElementId === id}
      onClick={handleClick}
    >
      {props.content && <div>{props.content}</div>}
      {props.label && (
        <button
          style={{
            backgroundColor: props.bgColor,
            color: props.color,
            width: props.width,
          }}
        >
          {props.label}
        </button>
      )}
      {props.src && <img src={props.src} alt="element" width={props.width} />}
      <ResizeHandle
        $visible={selectedElementId === id}
        onMouseDown={handleResize}
      />
    </ElementContainer>
  );
};

export default Element;
