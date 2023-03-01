const Zoom = ({ state, change }) => {
  return (
    <span className="toolbar-item">
      Zoom:
      <label>
        <input
          type="radio"
          name="zoom"
          value="month"
          onChange={change}
          checked={state.level === "month"}
        />{" "}
        Month
      </label>
      <label>
        <input
          type="radio"
          name="zoom"
          value="week"
          onChange={change}
          checked={state.level === "week"}
        />{" "}
        Week
      </label>
    </span>
  );
};

export default Zoom;
