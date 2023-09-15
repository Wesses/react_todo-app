import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../TodosContext';
import { ActionType } from '../../types/Action';

type Props = {
  item: Todo;
};

export const TodoItem: React.FC<Props> = ({ item }) => {
  const { id, title, completed } = item;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const { dispatch } = useContext(TodosContext);

  const editInput = useRef<HTMLInputElement | null>(null);
  const cancelEdit = () => {
    setEditedTitle(title);
    setIsEditing(false);
  };

  const handleChekBoxChange = () => {
    dispatch({ type: ActionType.ChangeCompleted, payload: id });
  };

  const handleDestroyButton = () => {
    dispatch({ type: ActionType.DeleteTodo, payload: id });
  };

  const handleLableDoubleClick = () => {
    setIsEditing(true);
  };

  const handleInputKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (editedTitle === '') {
        dispatch({ type: ActionType.DeleteTodo, payload: id });

        cancelEdit();

        return;
      }

      if (editedTitle !== title) {
        dispatch({
          type: ActionType.ChangeTitle,
          payload: { id, title: editedTitle },
        });
      }

      setIsEditing(false);

      return;
    }

    if (event.key === 'Escape') {
      cancelEdit();
    }
  };

  const handleOnBlurInput = () => {
    cancelEdit();
  };

  useEffect(() => {
    if (editInput.current) {
      editInput.current.focus();
    }
  }, [isEditing]);

  return (
    <li className={classNames({
      completed,
      editing: isEditing,
    })}
    >
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
          id={`toggle-${id}`}
          checked={completed}
          onChange={handleChekBoxChange}
        />
        <label
          onDoubleClick={handleLableDoubleClick}
        >
          {title}
        </label>
        <button
          aria-label="deleteTodo"
          type="button"
          className="destroy"
          data-cy="deleteTodo"
          onClick={handleDestroyButton}
        />
      </div>
      <input
        ref={editInput}
        type="text"
        className="edit"
        value={editedTitle}
        onChange={(event) => setEditedTitle(event.target.value)}
        onKeyUp={handleInputKeyUp}
        onBlur={handleOnBlurInput}
      />
    </li>
  );
};
