import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import Element from './Element';
import { useEditor } from './EditorContext';
import styled from 'styled-components';

const WorkspaceContainer = styled.div`
  position: relative;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: ${(props) =>
    props.$isOver ? '2px dashed #1976d2' : '1px solid #ddd'};
  min-height: 500px;
  overflow: auto;
  flex: 1;
  margin: 10px;
`;

const Workspace = () => {
  const {
    state: { elements },
    actions,
  } = useEditor();
  const containerRef = useRef(null);

  const [{ isOver }, drop] = useDrop({
    accept: 'new-element',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const rect = containerRef.current.getBoundingClientRect();
      const scrollLeft = containerRef.current.scrollLeft || 0;
      const scrollTop = containerRef.current.scrollTop || 0;

      const x = offset.x - rect.left + scrollLeft;
      const y = offset.y - rect.top + scrollTop;

      actions.addElement(item.type, { x, y });
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  const [, dropExisting] = useDrop({
    accept: 'existing-element',
    hover: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scrollLeft = containerRef.current.scrollLeft || 0;
      const scrollTop = containerRef.current.scrollTop || 0;

      const x = offset.x - rect.left + scrollLeft;
      const y = offset.y - rect.top + scrollTop;

      actions.moveElement(item.id, { x, y });
    },
  });

  drop(containerRef);
  dropExisting(containerRef);

  return (
    <WorkspaceContainer ref={containerRef} $isOver={isOver}>
      {elements.map((element) => (
        <Element key={element.id} {...element} />
      ))}
    </WorkspaceContainer>
  );
};

export default Workspace;
