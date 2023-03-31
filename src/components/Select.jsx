/* eslint-disable react/display-name */
import React, { useEffect } from "react";

function Select(props) {
  const classes = `text-black form-input px-4 py-3 mb-4 ${props.className || ''}`;

  return (
    <>
      <select ref={props.inputref} {...props} defaultValue={props.defaultValue} className={classes} >
        {props.options.map(el => (
          <option key={el.value} value={el.value}>{el.label}</option>
        ))}
      </select>
    </>
  );
}

export default React.forwardRef((props, ref) => {
  return <Select {...props} inputref={ref} />
});
