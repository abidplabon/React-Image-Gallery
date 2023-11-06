import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import "./LayOutImages.css";
import { useDrag, useDrop } from "react-dnd";

const style = {
  backgroundColor: "white",
  cursor: "move",
  position: "relative",
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  borderRadius: "10px",
  margin: "0 10px 10px 0",
  "&:hover": {
    border: "1px solid #000",
  },
};

const LayOutImages = (props) => {
  const { image, index, state, handelSet, moveGrid } = props;
  const [checked, setChecked] = useState(false);
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: "image",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveGrid(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "image",
    options: {
      dropEffect: "copy",
    },
    item: () => {
      return { index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  const handleCheckboxChange = useCallback(
    (id) => {
      if (!checked) {
        handelSet({
          ...state,
          count: state.count + 1,
          selected: [...state.selected, id],
        });
      } else {
        handelSet({
          ...state,
          count: state.count - 1,
          selected: state.selected.filter((item) => item !== id),
        });
      }
      setChecked(!checked);
    },
    [handelSet, state, checked]
  );

  useEffect(() => {
    if (state.count === 0) {
      setChecked(false);
    }
  }, [state]);

  // Add a class name to the selected image
  const imageClass = checked ? "selected-image" : "";

  return (
    <div
      ref={ref}
      style={{ ...style, opacity }}
      data-handlerId={handlerId}
      draggable
      className={`${index === 0 ? "wide" : ""} ${imageClass}`}
    >
      {/* Overlay div with black background (if selected) */}
      {checked && <div className="overlay"></div>}
      <img src={image.name} alt="avatar" />
      <div className="hide">
        <input
          onClick={() => handleCheckboxChange(image.id)}
          type="checkbox"
          checked={checked}
        />
      </div>
    </div>
  );
};

LayOutImages.propTypes = {
  image: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  state: PropTypes.object.isRequired,
  handelSet: PropTypes.func.isRequired,
  moveGrid: PropTypes.func.isRequired,
};

export default LayOutImages;
