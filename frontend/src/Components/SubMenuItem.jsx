import React from "react";
import arrowRight from '../assets/arrowRight.svg'
import arrowRightActive from '../assets/arrowRightActive.svg'
const SubMenuItem = (props) => {
  return (
    <div className="flex gap-3 my-3">
      <img src={props.active ? arrowRightActive : arrowRight} alt="" />
      <p className={props.active?'text-[#3772FF]':'text-[#B1B5C3]'}>{props.title}</p>
    </div>
  );
};

export default SubMenuItem;
