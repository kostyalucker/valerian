/* eslint-disable react/display-name */
import React from "react";
import { HTMLInputTypeAttribute } from "react";

type Props = {
  type?: HTMLInputTypeAttribute;
  className?: string;
  onChange?: any;
  disabled?: boolean;
  value: any;
  inputref?: any;
}

function Input(props: Props) {
  const classes = `text-black form-input px-4 py-3 mb-4 ${props.className || ''}`
  const typeNumberAttr = props.type === 'number' ? { min: 0 } : {};

  return (
    <input {...props} ref={props.inputref} type={props.type} className={classes} {...typeNumberAttr}></input>
  );
}

export default React.forwardRef((props: Props, ref) => {
  return <Input {...props} inputref={ref} />
});
