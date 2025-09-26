import React, { useId, useState } from "react";
import { EyeClosed, Eye } from "lucide-react";

function FormInput(
  {
    rows = 1,
    label,
    type = "text",
    className = "",
    inputClassname = "",
    labelClassname = "",
    textareaClassName = "",
    ...props
  },
  ref
) {
  const [see, setSee] = useState(false);
  const id = useId();

  const changeSee = () => {
    setSee((prev) => !prev);
  };
  return (
    <div className={`inputBox rounded-lg ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={` ${labelClassname} `}
        >
          {label}
        </label>
      )}

      {type === "password" ? (
        <div className="flex items-center relative justify-between bg-transparent w-full rounded-lg ">
          <input
            type={see ? "text" : type}
            className={`text-base focus:outline-none p-2 ${inputClassname}`}
            ref={ref}
            id={id}
            
            {...props  }
          />

          {see ? (
            <button
              type="button"
              className="absolute top-[50%] right-[5%] translate-x-[-50%] translate-y-[-50%]"
              onClick={changeSee}
            >
              <Eye className="w-[20px] h-[20px] text-inherit" />
            </button>
          ) : (
            <button
              type="button"
              className="absolute top-[50%] right-[5%] translate-x-[-50%] translate-y-[-50%]"
              onClick={changeSee}
            >
              <EyeClosed className="w-[20px] h-[20px] text-inherit" />
            </button>
          )}
        </div>
      ) 
      : 
      ( 
        type === "textarea" ? 
        (
          <textarea
            rows={rows}
            className= {textareaClassName}
            ref={ref}
            id={id}
            {...props}
          />
        ) 
        : 
        (
        <input
          type={type}
          className={`text-base focus:outline-none ${inputClassname}  `}
          ref={ref}
          id={id}
          {...props}
        />
        )
      )}
    </div>
  );
}

export default React.forwardRef(FormInput);
