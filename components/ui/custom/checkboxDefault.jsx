import { useState } from "react";

const CheckboxDefault = ({ title, name, checked}) => {
    const [isChecked, setIsChecked] = useState(!checked == false);

  return (
    <div>
      <label className="form-label">
      {title}
          <input
            type="checkbox"
            name={name}
            checked={isChecked}
            style={{ marginLeft: "5px", marginRight: "5px", width: "16px", height: "16px" }}
            value={isChecked}
            onChange={() => {
              setIsChecked(!isChecked);
            }}
          />
        {isChecked ? "Yes" : "No"}
      </label>
    </div>
  );
};

export default CheckboxDefault;