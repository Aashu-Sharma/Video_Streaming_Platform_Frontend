import React, { useState } from "react";
import { Tags, Copy, CopyCheck, X, Volume2 } from "lucide-react";
import { Controller } from "react-hook-form";

function TagsComp({ control, name = "tags", maxTags = 6, videoTags }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyTags = async (tags) => {
    if (!tags) return;
    const tagsArray = Array.from(tags);
    try {
      await navigator.clipboard.writeText(tagsArray.join(", "));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 10000);
    } catch (error) {
      console.error("Failed to copy tags: ", error);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: (value) => {
          if (value.size === 0) return "At least one tag is requuired";
          if (value.size >= 6) return `Maximum ${maxTags} are allowed`;
          return true;
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const tags = value;
        const addTag = (tag) => {
          if (tag && (tags.length < maxTags) && !tags.includes(tag)) {
            onChange([...tags, tag]);
          }
        };

        const removeTag = (tag) => {
          onChange(tags.filter((t) => t !== tag));
        };

        const clearAllTags = () => {
          if (tags.length > 0) {
            onChange([]);
          }
        };

        const handleKeyDown = (e) => {
          if ((e.key === "Enter" || e.key === ", ") && e.target.value !== "") {
            e.preventDefault();
            const tag = e.target.value.replace(",", "").trim();
            if (tag) {
              addTag(tag);
              e.target.value = "";
            }
          }
        };

        return (
          <div className="tags-card w-full border rounded-lg flex flex-col gap-2 p-4">
            <div className="card-header w-full flex items-center justify-between ">
              <h1>
                <Tags className="inline-block" /> Tags
              </h1>
              <div className="tooltips flex flex-row gap-2">
                <span className="tooltip-copy">
                  {isCopied ? (
                    <CopyCheck className="text-green-500" />
                  ) : (
                    <Copy onClick={() => copyTags(tags)} />
                  )}
                </span>
                <span className="tooltip-delete">
                  <X onClick={clearAllTags} />
                </span>
              </div>
            </div>

            <div className="card-body w-full flex flex-col gap-2 overflow-y-auto">
              <p>
                <Volume2 className="inline-block" /> use comma (,), or press
                <strong> Enter </strong> to separate each tag
              </p>
              <div className="tags w-full border rounded-lg p-2 flex flex-wrap items-center">
                {Array.from(tags).map((tag, index) => (
                  <span
                    key={tag}
                    className="tag w-fit flex items-center justify-center bg-gray-600 rounded-full p-3 m-2"
                  >
                    {tag} {"  "}
                    <span className="remove-tag cursor-pointer inline-block w-[30px] h-[30px] text-center bg-gray-800 rounded-full ml-2">
                      <X
                        className=" inline-block w-[16px]"
                        onClick={() => removeTag(tag)}
                      />
                    </span>
                  </span>
                ))}
                <input
                  type="text"
                  disabled={tags.length >= 6}
                  placeholder={
                    tags.length >= maxTags ? "Maximum tags reached" : "Add tags"
                  }
                  className="w-full outline-none p-4"
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>

            <div className="card-footer">
              <span className="current-tag">{Array.from(tags).length}</span> /{" "}
              <span className="max-tag">6</span> tags used
            </div>
          </div>
        );
      }}
    />
  );
}

export default TagsComp;
