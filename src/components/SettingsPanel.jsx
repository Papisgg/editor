import React from 'react';
import { useEditor } from './EditorContext';
import styled from 'styled-components';

const Panel = styled.div`
  width: 300px;
  padding: 20px;
  border-left: 1px solid #ddd;
  background: #f5f5f5;
`;

const SettingsPanel = () => {
  const { state, actions } = useEditor();
  const selectedElement = state.elements.find(
    (el) => el.id === state.selectedElementId
  );

  if (!selectedElement) return <Panel>Выберите элемент</Panel>;

  const handleChange = (prop, value) => {
    actions.updateElement(selectedElement.id, { [prop]: value });
  };

  return (
    <Panel>
      <h3>Настройки элемента</h3>

      {selectedElement.type === 'text' && (
        <>
          <label>
            Текст:
            <input
              type="text"
              value={selectedElement.props.content}
              onChange={(e) => handleChange('content', e.target.value)}
            />
          </label>

          <label>
            Размер шрифта:
            <input
              type="number"
              value={selectedElement.props.fontSize}
              onChange={(e) =>
                handleChange('fontSize', parseInt(e.target.value))
              }
            />
          </label>
        </>
      )}

      <label>
        Цвет фона:
        <input
          type="color"
          value={selectedElement.props.bgColor || '#ffffff'}
          onChange={(e) => handleChange('bgColor', e.target.value)}
        />
      </label>

      <label>
        Граница:
        <input
          type="number"
          value={selectedElement.props.borderWidth || 0}
          onChange={(e) =>
            handleChange('borderWidth', parseInt(e.target.value))
          }
        />
        <input
          type="color"
          value={selectedElement.props.borderColor || '#000000'}
          onChange={(e) => handleChange('borderColor', e.target.value)}
        />
      </label>
    </Panel>
  );
};

export default SettingsPanel;
